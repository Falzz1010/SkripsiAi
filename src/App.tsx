import React, { useState, lazy, Suspense } from 'react';
import { Sun, Moon, GraduationCap } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import ThesisForm from './components/ThesisForm';
import { generateThesis } from './utils/groq';
import { ThesisConfig, ThesisContent } from './types';
import LoadingOverlay from './components/LoadingOverlay';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load components
const ThesisOutput = lazy(() => import('./components/ThesisOutput'));
const FloatingSocials = lazy(() => import('./components/FloatingSocials'));
const Footer = lazy(() => import('./components/Footer'));

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [thesis, setThesis] = useState<ThesisContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleGenerate = async (config: ThesisConfig) => {
    try {
      setError(null);
      setLoading(true);
      setCurrentStep(1);
      const content = await generateThesis(config);
      setThesis(content);
      setCurrentStep(2);
      toast.success('Thesis generated successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      setCurrentStep(0);
      toast.error(errorMessage);
      console.error('Generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    try {
      // Add your export logic here
      setCurrentStep(3);
      toast.success('Thesis exported successfully!');
    } catch (error) {
      toast.error('Failed to export thesis');
      console.error('Export error:', error);
    }
  };

  return (
    <ErrorBoundary>
      <div className={`min-h-screen ${darkMode ? 'dark bg-[#1A1A1A]' : 'bg-[#F4F3EE]'}`}>
        {loading && <LoadingOverlay />}
        
        <div className="container mx-auto px-2 sm:px-6 py-4 sm:py-8 min-w-[300px]">
          <header className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-12">
            <div className="flex items-center gap-3 w-full justify-between sm:w-auto">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-[#FFD23F] border-3 sm:border-4 border-black dark:border-white 
                              flex items-center justify-center rotate-12">
                  <GraduationCap className="w-4 h-4 sm:w-6 sm:h-6 text-black dark:text-white" />
                </div>
                <h1 className="text-lg sm:text-3xl md:text-4xl font-black uppercase">AI Thesis Generator</h1>
              </div>
              <button
                onClick={toggleDarkMode}
                className="p-2 sm:p-3 bg-white dark:bg-[#2A2A2A] 
                         border-3 sm:border-4 border-black dark:border-white
                         shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)]
                         hover:translate-x-[2px] hover:translate-y-[2px]
                         hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[1px_1px_0px_0px_rgba(255,255,255,0.2)]
                         transition-all duration-200 sm:ml-4"
              >
                {darkMode ? <Sun className="w-4 h-4 sm:w-6 sm:h-6" /> : <Moon className="w-4 h-4 sm:w-6 sm:h-6" />}
              </button>
            </div>
          </header>

          <main className="flex flex-col items-center gap-6 sm:gap-12">
            <div className="w-full max-w-4xl mx-auto">
              <div className="grid grid-cols-3 sm:grid-cols-12 gap-2 sm:gap-4 mb-4 sm:mb-8">
                {['Research', 'Generate', 'Export'].map((step, index) => (
                  <div key={step} className="col-span-1 sm:col-span-4">
                    <div className="flex items-center gap-1 sm:gap-3">
                      <div className={`w-5 h-5 sm:w-8 sm:h-8 flex items-center justify-center
                                    border-2 sm:border-4 border-black dark:border-white text-xs sm:text-base
                                    ${currentStep >= index ? 'bg-[#FFD23F]' : 'bg-white dark:bg-[#2A2A2A]'}`}>
                        {index + 1}
                      </div>
                      <span className="font-bold uppercase text-xs sm:text-base">{step}</span>
                    </div>
                  </div>
                ))}
              </div>
              <ThesisForm onGenerate={handleGenerate} isLoading={loading} />
            </div>
            {error && (
              <div className="w-full max-w-2xl p-2 sm:p-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-xl">
                <p className="text-xs sm:text-sm">{error}</p>
              </div>
            )}
            {thesis && (
              <Suspense fallback={<LoadingOverlay />}>
                <ThesisOutput 
                  content={thesis} 
                  onExport={handleExport}
                />
              </Suspense>
            )}
          </main>
        </div>

        <Suspense fallback={null}>
          <Footer darkMode={darkMode} />
        </Suspense>
        
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              border: '3px solid black',
              borderRadius: '0',
              padding: '12px',
              fontSize: '14px',
              color: '#000',
              boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)',
            },
            className: 'toast-mobile sm:toast-large',
          }}
        />
        <Suspense fallback={null}>
          <FloatingSocials />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}

export default App;
