import React, { useState, useCallback, useRef, useEffect } from 'react';
import { AppClass, AppSubject, PaperQuestion, PaperSettings, SpacingSettings, Template } from '../../types';
import QuestionBank from '../builder/QuestionBank';
import TextbookViewer from '../builder/TextbookViewer';
import PaperPanel from '../builder/PaperPanel';
import PaperPreview from '../preview/PaperPreview';
import usePaperBuilder from '../../hooks/usePaperBuilder';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import { generateTextbookPdf } from '../../utils/pdfGenerator';
import clsx from 'clsx';

interface PaperBuilderScreenProps {
  selectedClass: AppClass;
  selectedSubject: AppSubject;
  onBack: () => void;
  onSetDownloadAction: (action: (() => Promise<void>) | null) => void;
}

const PaperBuilderScreen: React.FC<PaperBuilderScreenProps> = ({ selectedClass, selectedSubject, onBack, onSetDownloadAction }) => {
  const [leftTab, setLeftTab] = useState<'bank' | 'textbook'>('bank');
  const [rightTab, setRightTab] = useState<'paper' | 'settings' | 'custom'>('paper');
  const [showPreview, setShowPreview] = useState(false);
  
  const textbookContainerRef = useRef<HTMLDivElement>(null);

  const {
    paper,
    addQuestion,
    removeQuestion,
    updateQuestionMarks,
    updateSettings,
    updateAttemptRule,
    addCustomQuestion,
    totalMarks
  } = usePaperBuilder();

  const handleDownloadTextbook = useCallback(async () => {
    if (!textbookContainerRef.current) return;
    const pages = Array.from(textbookContainerRef.current.children) as HTMLElement[];
    
    if (pages.length === 0) {
        alert("No textbook pages to download.");
        return;
    }
    
    await generateTextbookPdf(pages, `${selectedClass.id}-${selectedSubject.name}-textbook`);
  }, [selectedClass.id, selectedSubject.name]);

  useEffect(() => {
    onSetDownloadAction(() => handleDownloadTextbook);
    
    // Cleanup function to remove the download action when component unmounts
    return () => {
      onSetDownloadAction(null);
    };
  }, [handleDownloadTextbook, onSetDownloadAction]);


  const [customQuestionText, setCustomQuestionText] = useState('');

  const handleExtractText = (text: string) => {
    setCustomQuestionText(text);
    setRightTab('custom');
  };

  const handleGenerate = useCallback(() => {
    setShowPreview(true);
  }, []);

  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="animate-scale-in"
    >
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 py-2 px-4 rounded-lg border border-sky-600 dark:border-sky-500 text-sky-600 dark:text-sky-500 font-semibold text-sm transition-colors hover:bg-sky-600 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white mb-4"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        <span>Back to {selectedClass.title} Subjects</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Source Material */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="mb-4">
            <div className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg flex space-x-1">
              <button onClick={() => setLeftTab('bank')} className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-colors ${leftTab === 'bank' ? 'bg-white dark:bg-zinc-700 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50'}`}>
                Question Bank
              </button>
              <button onClick={() => setLeftTab('textbook')} className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-colors ${leftTab === 'textbook' ? 'bg-white dark:bg-zinc-700 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50'}`}>
                Textbook
              </button>
            </div>
          </div>
          <div className="pr-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={leftTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {leftTab === 'bank' ? (
                  <QuestionBank 
                    classId={selectedClass.id} 
                    subjectId={selectedSubject.id}
                    onAddQuestion={addQuestion}
                    addedQuestionIds={paper.questions.map(q => q.originalQuestion.id)}
                  />
                ) : (
                  <TextbookViewer 
                    classId={selectedClass.id} 
                    subjectId={selectedSubject.id}
                    onExtractText={handleExtractText}
                    containerRef={textbookContainerRef}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: Paper Builder Panel */}
        <div className="lg:col-span-1 sticky top-24">
          <PaperPanel 
            paper={paper}
            onRemoveQuestion={removeQuestion}
            onUpdateMarks={updateQuestionMarks}
            onUpdateSettings={updateSettings}
            onUpdateAttemptRule={updateAttemptRule}
            onAddCustomQuestion={addCustomQuestion}
            onGenerate={handleGenerate}
            totalMarks={totalMarks}
            activeTab={rightTab}
            setActiveTab={setRightTab}
            customQuestionText={customQuestionText}
            setCustomQuestionText={setCustomQuestionText}
          />
        </div>
      </div>

      {showPreview && (
        <PaperPreview
          paper={paper}
          onClose={() => setShowPreview(false)}
        />
      )}
    </motion.div>
  );
};

export default PaperBuilderScreen;