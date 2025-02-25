export interface ThesisConfig {
  topic: string;
  academicLevel: 'S1' | 'S2' | 'S3';
  writingStyle: 'formal' | 'informal';
  language: 'id' | 'en';
  citationStyle: 'APA' | 'MLA' | 'IEEE';
}

export interface ThesisContent {
  title: string;
  abstract: string;
  tableOfContents: string[];
  chapters: {
    [key: string]: {
      title: string;
      content: string;
    };
  };
  references: string[];
  plagiarismScore?: number;
  aiSuggestions?: string[];
}

export interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  icon?: React.ReactNode;
}

export interface GroqResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface SecurityConfig {
  userIP: string;
  timestamp: number;
  requestCount: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface SecurityCheckResult {
  allowed: boolean;
  error?: string;
}
