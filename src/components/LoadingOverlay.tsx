import React from 'react';
import LoadingSpinner from './ui/LoadingSpinner';

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-white/10 backdrop-blur-sm 
                    flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#2A2A2A] p-8 border-4 border-black dark:border-white
                    shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
        <div className="space-y-6">
          <LoadingSpinner />
          <div className="text-center">
            <h3 className="font-black uppercase text-xl mb-2">Generating Thesis</h3>
            <p className="text-gray-600 dark:text-gray-400 animate-pulse">
              Please wait while we process your request...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
