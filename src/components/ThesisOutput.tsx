import React from 'react';
import { Download, FileText, AlertTriangle, Lightbulb, BookOpen, GraduationCap, Share2 } from 'lucide-react';
import { ThesisContent } from '../types';
import { generatePDF, generateDOCX } from '../utils/export';
import Button from './ui/Button';

interface Props {
  content: ThesisContent;
  isLoading?: boolean;
  onExport: () => void;
}

// Extract components for better organization
const TitleHeader = ({ title }: { title: string }) => (
  <div className="flex items-center gap-4">
    <GraduationCap className="w-10 h-10 text-blue-600 dark:text-blue-400" />
    <h1 className="heading-gradient text-3xl md:text-4xl font-bold">
      {title.toUpperCase()}
    </h1>
  </div>
);

const DownloadButtons = ({ onPDFClick, onDOCXClick }: {
  onPDFClick: () => void;
  onDOCXClick: () => void;
}) => (
  <div className="flex gap-4">
    <Button
      onClick={onPDFClick}
      variant="danger"
      icon={<Download className="w-5 h-5" />}
      className="uppercase tracking-wider"
    >
      PDF
    </Button>
    <Button
      onClick={onDOCXClick}
      variant="primary"
      icon={<FileText className="w-5 h-5" />}
      className="uppercase tracking-wider"
    >
      DOCX
    </Button>
  </div>
);

const PlagiarismAlert = ({ score }: { score: number }) => (
  <div className={`p-6 rounded-xl flex items-center gap-4 ${
    score > 20 
      ? 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200' 
      : 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200'
  }`}>
    <AlertTriangle className="w-6 h-6 flex-shrink-0" />
    <div>
      <h3 className="font-semibold mb-1">Similarity Score: {score}%</h3>
      {score > 20 && 
        <p className="text-sm">Consider revising your content to improve originality</p>
      }
    </div>
  </div>
);

const SectionHeader = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <div className="flex items-center gap-3">
    {icon}
    <h2 className="section-title">{title}</h2>
  </div>
);

// Add these new components for better visual hierarchy
const ContentCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white dark:bg-[#2A2A2A] border-4 border-black dark:border-white p-6 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'success' | 'warning' }) => {
  const variants = {
    default: 'bg-[#FFD23F] text-black',
    success: 'bg-[#40C057] text-white',
    warning: 'bg-[#FF6B6B] text-white'
  };

  return (
    <span className={`inline-block px-3 py-1 border-2 border-black dark:border-white font-bold uppercase text-sm
                     ${variants[variant]}`}>
      {children}
    </span>
  );
};

// Main component
export default function ThesisOutput({ content, isLoading, onExport }: Props) {
  const handleDownloadPDF = () => generatePDF(content);
  const handleDownloadDOCX = () => generateDOCX(content);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: content.title,
          text: content.abstract,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="card p-8 w-full max-w-4xl animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-8 w-full max-w-4xl space-y-10">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#FFD23F] border-4 border-black dark:border-white 
                          flex items-center justify-center rotate-12">
              <GraduationCap className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase">
              {content.title}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <Button
              onClick={handleDownloadPDF}
              variant="danger"
              icon={<Download className="w-3 h-3 sm:w-5 sm:h-5" />}
              className="rounded-xl px-3 sm:px-6 text-xs sm:text-base"
            >
              PDF
            </Button>
            <Button
              onClick={handleDownloadDOCX}
              variant="primary"
              icon={<FileText className="w-3 h-3 sm:w-5 sm:h-5" />}
              className="rounded-xl px-3 sm:px-6 text-xs sm:text-base"
            >
              DOCX
            </Button>
            <Button
              onClick={handleShare}
              variant="secondary"
              icon={<Share2 className="w-3 h-3 sm:w-5 sm:h-5" />}
              className="rounded-xl px-3 sm:px-6 text-xs sm:text-base"
            >
              Share
            </Button>
          </div>
        </div>

        {content.plagiarismScore !== undefined && (
          <ContentCard className="flex items-center gap-4">
            <Badge variant={content.plagiarismScore > 20 ? 'warning' : 'success'}>
              Similarity {content.plagiarismScore}%
            </Badge>
            {content.plagiarismScore > 20 && (
              <p className="font-bold">Consider revising your content to improve originality</p>
            )}
          </ContentCard>
        )}

        {content.aiSuggestions && content.aiSuggestions.length > 0 && (
          <ContentCard>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#FFD23F] border-4 border-black dark:border-white 
                            flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-black" />
              </div>
              <h3 className="font-black uppercase">AI Suggestions</h3>
            </div>
            <ul className="space-y-3 ml-4">
              {content.aiSuggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="font-black">•</span>
                  <span className="leading-relaxed">{suggestion}</span>
                </li>
              ))}
            </ul>
          </ContentCard>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <section className="space-y-6">
          <SectionHeader icon={<BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />} title="ABSTRACT" />
          <div className="prose dark:prose-invert">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {content.abstract}
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <SectionHeader icon={<FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />} title="TABLE OF CONTENTS" />
          <ul className="space-y-3">
            {content.tableOfContents.map((item, index) => (
              <li 
                key={index} 
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 
                         cursor-pointer transition-colors pl-4 border-l-2 border-gray-200 dark:border-gray-700"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="space-y-12">
        {Object.entries(content.chapters).map(([key, chapter]) => (
          <section key={key} className="space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 className="chapter-title">{chapter.title.toUpperCase()}</h2>
            </div>
            <div className="prose dark:prose-invert">
              {chapter.content.split('\n').map((paragraph, index) => (
                <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="chapter-title">REFERENCES</h2>
          </div>
          <ul className="space-y-4">
            {content.references.map((reference, index) => (
              <li key={index} className="text-gray-700 dark:text-gray-300 pl-8 -indent-8">
                {reference}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}