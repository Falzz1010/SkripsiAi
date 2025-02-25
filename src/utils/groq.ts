import { ThesisConfig, ThesisContent } from '../types';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = import.meta.env.VITE_GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions';

const DEFAULT_THESIS: ThesisContent = {
  title: '',
  abstract: '',
  tableOfContents: [],
  chapters: {
    chapter1: { title: '', content: '' }
  },
  references: [],
  plagiarismScore: 0,
  aiSuggestions: []
};

// Add rate limiting configuration
const RATE_LIMIT = {
  MAX_REQUESTS: 5,
  WINDOW_MS: 60000, // 1 minute
  COOLDOWN_MS: 300000 // 5 minutes
};

// Track API requests
const requestTracker = new Map<string, {
  count: number,
  timestamp: number,
  cooldownUntil?: number
}>();

// Add security checks
function checkSecurity(userIP: string): { allowed: boolean; error?: string } {
  const now = Date.now();
  const userRequests = requestTracker.get(userIP) || { count: 0, timestamp: now };

  // Check if user is in cooldown
  if (userRequests.cooldownUntil && now < userRequests.cooldownUntil) {
    const waitMinutes = Math.ceil((userRequests.cooldownUntil - now) / 60000);
    return {
      allowed: false,
      error: `Too many requests. Please wait ${waitMinutes} minutes.`
    };
  }

  // Reset counter if window has passed
  if (now - userRequests.timestamp > RATE_LIMIT.WINDOW_MS) {
    userRequests.count = 0;
    userRequests.timestamp = now;
  }

  // Check rate limit
  if (userRequests.count >= RATE_LIMIT.MAX_REQUESTS) {
    userRequests.cooldownUntil = now + RATE_LIMIT.COOLDOWN_MS;
    requestTracker.set(userIP, userRequests);
    return {
      allowed: false,
      error: 'Rate limit exceeded. Please try again later.'
    };
  }

  // Update request count
  userRequests.count++;
  requestTracker.set(userIP, userRequests);
  return { allowed: true };
}

// Add input validation
function validateInput(config: ThesisConfig): { valid: boolean; error?: string } {
  // Check for empty or invalid input
  if (!config.topic.trim()) {
    return { valid: false, error: 'Topic cannot be empty' };
  }

  // Check for minimum length
  if (config.topic.length < 10) {
    return { valid: false, error: 'Topic must be at least 10 characters long' };
  }

  // Check for maximum length
  if (config.topic.length > 500) {
    return { valid: false, error: 'Topic must not exceed 500 characters' };
  }

  // Check for potential XSS attacks
  if (/<script|javascript:|data:/i.test(config.topic)) {
    return { valid: false, error: 'Invalid characters detected' };
  }

  // Validate enum values
  const validAcademicLevels = ['S1', 'S2', 'S3'];
  const validWritingStyles = ['formal', 'informal'];
  const validLanguages = ['id', 'en'];
  const validCitationStyles = ['APA', 'MLA', 'IEEE'];

  if (!validAcademicLevels.includes(config.academicLevel)) {
    return { valid: false, error: 'Invalid academic level' };
  }
  if (!validWritingStyles.includes(config.writingStyle)) {
    return { valid: false, error: 'Invalid writing style' };
  }
  if (!validLanguages.includes(config.language)) {
    return { valid: false, error: 'Invalid language' };
  }
  if (!validCitationStyles.includes(config.citationStyle)) {
    return { valid: false, error: 'Invalid citation style' };
  }

  return { valid: true };
}

async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3, baseDelay = 2000): Promise<Response> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      if (response.ok) {
        return response;
      }
      
      if (response.status === 429) {
        // Get retry-after header if available, otherwise use exponential backoff
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter ? parseInt(retryAfter) * 1000 : baseDelay * Math.pow(2, attempt);
        console.log(`Rate limited. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${maxRetries})`);
        await wait(delay);
        continue;
      }
      
      // If error is not 429, throw immediately
      throw new Error(`API request failed: ${response.status} - ${response.statusText}`);
      
    } catch (error) {
      if (attempt === maxRetries - 1) {
        throw new ThesisGenerationError(
          `Failed after ${maxRetries} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`Request failed. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${maxRetries})`);
      await wait(delay);
    }
  }
  
  throw new ThesisGenerationError('Max retries exceeded');
}

export async function generateThesis(config: ThesisConfig, userIP: string): Promise<ThesisContent> {
  // Security check
  const securityCheck = checkSecurity(userIP);
  if (!securityCheck.allowed) {
    throw new ThesisGenerationError(securityCheck.error || 'Security check failed');
  }

  // Input validation
  const validationResult = validateInput(config);
  if (!validationResult.valid) {
    throw new ThesisGenerationError(validationResult.error || 'Invalid input');
  }

  // Sanitize input
  const sanitizedTopic = config.topic
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim();

  const sanitizedConfig = {
    ...config,
    topic: sanitizedTopic
  };

  const prompt = `Generate a detailed academic thesis in ${config.language === 'id' ? 'Indonesian' : 'English'} language.

Topic: ${config.topic}
Academic Level: ${config.academicLevel}
Writing Style: ${config.writingStyle}
Citation Style: ${config.citationStyle}

Please provide a complete thesis with detailed content for each section. Each chapter should contain comprehensive information, analysis, and discussion relevant to the topic. Include:

1. Detailed introduction with clear background, problem statement, objectives, and significance
2. Comprehensive literature review with current research and theoretical framework
3. Complete methodology section explaining research approach, methods, and procedures
4. In-depth results and discussion with data analysis and findings
5. Thorough conclusion with recommendations and future work
6. Proper citations and references in ${config.citationStyle} format

Format the response as a structured JSON with detailed content for each section:
{
  "title": "Complete thesis title",
  "abstract": "Comprehensive abstract with keywords",
  "tableOfContents": ["Detailed table of contents"],
  "chapters": {
    "chapter1": {
      "title": "BAB 1 PENDAHULUAN",
      "content": "Detailed content including all subsections..."
    },
    "chapter2": {
      "title": "BAB 2 TINJAUAN PUSTAKA",
      "content": "Detailed content including all subsections..."
    },
    "chapter3": {
      "title": "BAB 3 METODOLOGI PENELITIAN",
      "content": "Detailed content including all subsections..."
    },
    "chapter4": {
      "title": "BAB 4 HASIL DAN PEMBAHASAN",
      "content": "Detailed content including all subsections..."
    },
    "chapter5": {
      "title": "BAB 5 KESIMPULAN DAN SARAN",
      "content": "Detailed content including all subsections..."
    }
  },
  "references": ["Complete reference list"],
  "plagiarismScore": 0,
  "aiSuggestions": ["Improvement suggestions"]
}

Ensure each chapter contains substantial content with proper academic writing and analysis.`;

  try {
    const response = await fetchWithRetry(
      GROQ_API_URL,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'system',
              content: 'You are a thesis generator that responds only with valid JSON matching the specified structure. Always include references in your response. Do not include any explanatory text or markdown formatting.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 32768,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content;
    
    try {
      // Enhanced content cleaning
      content = content
        // Remove markdown code blocks
        .replace(/```json\s*|\s*```/g, '')
        // Remove any control characters
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
        // Fix potential string concatenation
        .replace(/"\s*\+\s*"/g, '')
        // Fix line breaks in strings
        .replace(/\n\s*(?=(?:[^"]*"[^"]*")*[^"]*$)/g, ' ')
        // Remove any trailing commas before closing brackets
        .replace(/,(\s*[}\]])/g, '$1')
        // Fix missing commas in arrays
        .replace(/](\s*["\w])/g, '],$1')
        // Remove any double commas
        .replace(/,,+/g, ',')
        .trim();
      
      // Validate JSON structure before parsing
      if (!content.startsWith('{') || !content.endsWith('}')) {
        throw new Error('Invalid JSON structure');
      }

      const parsedContent = JSON.parse(content);
      
      // Transform and validate the content
      return {
        title: typeof parsedContent.title === 'string' ? parsedContent.title : '',
        abstract: typeof parsedContent.abstract === 'string' ? parsedContent.abstract : '',
        tableOfContents: Array.isArray(parsedContent.tableOfContents) 
          ? parsedContent.tableOfContents.filter((item): item is string => typeof item === 'string')
          : [],
        chapters: typeof parsedContent.chapters === 'object' && parsedContent.chapters
          ? parsedContent.chapters
          : { chapter1: { title: '', content: '' } },
        references: Array.isArray(parsedContent.references)
          ? parsedContent.references
              .filter((ref): ref is string => typeof ref === 'string')
              .map(ref => ref.trim())
              .filter(ref => ref.length > 0)
          : [],
        plagiarismScore: typeof parsedContent.plagiarismScore === 'number'
          ? parsedContent.plagiarismScore
          : 0,
        aiSuggestions: Array.isArray(parsedContent.aiSuggestions)
          ? parsedContent.aiSuggestions.filter((suggestion): suggestion is string => typeof suggestion === 'string')
          : []
      };
    } catch (parseError) {
      console.error('Parse error:', parseError);
      console.error('Content that failed to parse:', content);
      throw new ThesisGenerationError(`Failed to parse response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }
  } catch (error) {
    console.error('API error:', error);
    throw error instanceof ThesisGenerationError ? error : new ThesisGenerationError(error instanceof Error ? error.message : 'Unknown error');
  }
}

export async function getRevisionSuggestions(content: string): Promise<string[]> {
  try {
    const response = await fetchWithRetry(
      GROQ_API_URL,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'system',
              content: 'Anda adalah reviewer thesis yang akan memberikan saran perbaikan dalam bentuk array. Berikan saran yang konkret dan dapat ditindaklanjuti.'
            },
            {
              role: 'user',
              content: `Mohon review thesis berikut dan berikan saran perbaikan yang spesifik:\n\n${content}`
            }
          ],
          temperature: 0.3,
          max_tokens: 32768
        })
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    const suggestions = data.choices[0].message.content;

    try {
      const parsed = JSON.parse(suggestions);
      return Array.isArray(parsed) ? parsed : [suggestions];
    } catch (parseError) {
      console.error('Failed to parse suggestions as JSON:', parseError);
      // If not valid JSON, return as single suggestion
      return [suggestions.trim()];
    }
  } catch (error) {
    console.error('Error getting revision suggestions:', error);
    throw new Error('Failed to get revision suggestions: ' + (error instanceof Error ? error.message : String(error)));
  }
}

// Add error types
export class ThesisGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ThesisGenerationError';
  }
}

export class RevisionSuggestionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RevisionSuggestionError';
  }
}