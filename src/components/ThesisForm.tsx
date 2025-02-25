import React, { useState, useEffect } from 'react';
import { Book, GraduationCap, Pen, Languages, FileText, Loader2 } from 'lucide-react';
import { ThesisConfig } from '../types';
import SelectField from './ui/SelectField';
import Button from './ui/Button';
import { toast } from 'react-hot-toast';

interface Props {
  onGenerate: (config: ThesisConfig) => void;
  isLoading: boolean;
}

const MIN_TOPIC_LENGTH = 10;
const MAX_TOPIC_LENGTH = 500;

export default function ThesisForm({ onGenerate, isLoading }: Props) {
  const [config, setConfig] = useState<ThesisConfig>({
    topic: '',
    academicLevel: 'S1',
    writingStyle: 'formal',
    language: 'id',
    citationStyle: 'APA'
  });

  const [topicError, setTopicError] = useState<string>('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 90 ? 90 : prev + 10));
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isLoading]);

  const handleTopicChange = (value: string) => {
    setConfig({ ...config, topic: value });
    
    if (value.trim().length === 0) {
      setTopicError('Topik penelitian tidak boleh kosong');
    } else if (value.trim().length < MIN_TOPIC_LENGTH) {
      setTopicError(`Topik minimal ${MIN_TOPIC_LENGTH} karakter`);
    } else if (value.trim().length > MAX_TOPIC_LENGTH) {
      setTopicError(`Topik maksimal ${MAX_TOPIC_LENGTH} karakter`);
    } else {
      setTopicError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!config.topic.trim()) {
      toast.error('Topik penelitian tidak boleh kosong!');
      return;
    }

    if (config.topic.trim().length < MIN_TOPIC_LENGTH) {
      toast.error(`Topik minimal ${MIN_TOPIC_LENGTH} karakter!`);
      return;
    }

    if (config.topic.trim().length > MAX_TOPIC_LENGTH) {
      toast.error(`Topik maksimal ${MAX_TOPIC_LENGTH} karakter!`);
      return;
    }

    onGenerate(config);
  };

  const academicLevelOptions = [
    { value: 'S1', label: 'S1 (Skripsi)' },
    { value: 'S2', label: 'S2 (Thesis)' },
    { value: 'S3', label: 'S3 (Disertasi)' }
  ];

  const writingStyleOptions = [
    { value: 'formal', label: 'Formal Academic' },
    { value: 'informal', label: 'Semi-Formal' }
  ];

  const languageOptions = [
    { value: 'id', label: 'Bahasa Indonesia' },
    { value: 'en', label: 'English' }
  ];

  const citationStyleOptions = [
    { value: 'APA', label: 'APA Style' },
    { value: 'MLA', label: 'MLA Style' },
    { value: 'IEEE', label: 'IEEE Style' }
  ];

  return (
    <form onSubmit={handleSubmit} className="card p-8 w-full max-w-2xl backdrop-blur-sm">
      <h2 className="text-3xl font-black uppercase mb-8 tracking-tight">
        Generator Skripsi AI
      </h2>
      
      <div className="space-y-8">
        <div className="space-y-3">
          <label className="flex items-center gap-3 text-lg font-semibold text-gray-800 dark:text-gray-100">
            <Book className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            TOPIK PENELITIAN
          </label>
          <textarea
            value={config.topic}
            onChange={(e) => handleTopicChange(e.target.value)}
            className={`w-full p-4 bg-white dark:bg-[#2A2A2A]
                     text-black dark:text-white
                     input-neubrutalism
                     min-h-[120px] resize-y
                     ${topicError ? 'border-red-500 dark:border-red-400' : ''}`}
            placeholder="Deskripsikan topik penelitian Anda secara detail..."
            required
          />
          {topicError && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
              {topicError}
            </p>
          )}
          <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
            <span>{config.topic.length} karakter</span>
            <span>{MIN_TOPIC_LENGTH} - {MAX_TOPIC_LENGTH} karakter</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label="TINGKAT AKADEMIK"
            value={config.academicLevel}
            onChange={(value) => setConfig({ ...config, academicLevel: value as ThesisConfig['academicLevel'] })}
            options={academicLevelOptions}
            icon={<GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
          />

          <SelectField
            label="GAYA PENULISAN"
            value={config.writingStyle}
            onChange={(value) => setConfig({ ...config, writingStyle: value as ThesisConfig['writingStyle'] })}
            options={writingStyleOptions}
            icon={<Pen className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
          />

          <SelectField
            label="BAHASA"
            value={config.language}
            onChange={(value) => setConfig({ ...config, language: value as ThesisConfig['language'] })}
            options={languageOptions}
            icon={<Languages className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
          />

          <SelectField
            label="FORMAT REFERENSI"
            value={config.citationStyle}
            onChange={(value) => setConfig({ ...config, citationStyle: value as ThesisConfig['citationStyle'] })}
            options={citationStyleOptions}
            icon={<FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
          />
        </div>
      </div>

      <div className="mt-8">
        <Button
          disabled={isLoading || !config.topic.trim() || !!topicError}
          variant="primary"
          onClick={handleSubmit}
          className={`w-full py-4 text-lg font-semibold rounded-xl`}
        >
          {isLoading ? 'Generating Thesis...' : 'Generate Thesis'}
        </Button>
      </div>

      {isLoading && (
        <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </form>
  );
}
