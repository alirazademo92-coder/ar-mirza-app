

import React, { useState, useRef, useCallback } from 'react';
// Fix: PaperState is exported from types.ts, not usePaperBuilder.ts.
import { PaperState, SpacingSettings, Template } from '../../types';
import DefaultTemplate from './templates/DefaultTemplate';
import CompactTemplate from './templates/CompactTemplate';
import ModernTemplate from './templates/ModernTemplate';
import { XMarkIcon, ArrowDownTrayIcon, ChevronLeftIcon, ChevronRightIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/react/24/solid';
import { generatePdf } from '../../utils/pdfGenerator';
import { AnimatePresence, motion } from 'framer-motion';

interface PaperPreviewProps {
  paper: PaperState;
  onClose: () => void;
}

const templates: Template[] = ['Default', 'Compact', 'Modern'];

const PaperPreview: React.FC<PaperPreviewProps> = ({ paper, onClose }) => {
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [spacing, setSpacing] = useState<SpacingSettings>({
    afterHeader: 16, afterMcqs: 20, afterShortQuestions: 20, afterLongQuestions: 20,
    mcqItemSpacing: 4, questionItemSpacing: 8,
  });
  const [showSpacingControls, setShowSpacingControls] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  
  const handleDownload = async () => {
    if (!previewRef.current) return;
    setIsDownloading(true);
    await generatePdf(previewRef.current, paper.settings.paperTitle || 'exam-paper');
    setIsDownloading(false);
  };
  
  const updateSpacing = (key: keyof SpacingSettings, value: number) => {
    setSpacing(prev => ({ ...prev, [key]: Math.max(0, prev[key] + value) }));
  };

  const renderTemplate = () => {
    const TemplateComponent = {
      'Default': DefaultTemplate,
      'Compact': CompactTemplate,
      'Modern': ModernTemplate,
    }[templates[currentTemplateIndex]];
    return <TemplateComponent paper={paper} spacing={spacing} />;
  };
  
  const cycleTemplate = (direction: 1 | -1) => {
      setCurrentTemplateIndex(prev => (prev + direction + templates.length) % templates.length);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div className="w-full h-full flex flex-col">
        {/* Toolbar */}
        <div className="flex-shrink-0 bg-white dark:bg-slate-800 rounded-t-lg p-3 flex items-center justify-between shadow-md">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Paper Preview</h2>
          
          {/* Template Controls */}
          <div className="flex items-center gap-2">
            <button onClick={() => cycleTemplate(-1)} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Previous template">
                <ChevronLeftIcon className="w-5 h-5"/>
            </button>
            <span className="font-semibold text-sm w-20 text-center text-slate-700 dark:text-slate-300">{templates[currentTemplateIndex]}</span>
            <button onClick={() => cycleTemplate(1)} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Next template">
                <ChevronRightIcon className="w-5 h-5"/>
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setShowSpacingControls(!showSpacingControls)} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Toggle spacing controls">
                 {showSpacingControls ? <ArrowsPointingInIcon className="w-5 h-5"/> : <ArrowsPointingOutIcon className="w-5 h-5"/>}
              </button>
               <AnimatePresence>
              {showSpacingControls && (
                <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: 10}} className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-700 rounded-lg shadow-xl p-3 z-10 border border-slate-200 dark:border-slate-600">
                  <p className="font-semibold text-sm mb-2">Adjust Spacing</p>
                  {Object.keys(spacing).map(key => (
                     <div key={key} className="flex justify-between items-center text-xs my-1">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <div className="flex items-center gap-1">
                           <button onClick={() => updateSpacing(key as keyof SpacingSettings, -2)} className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-600">-</button>
                           <span className="w-6 text-center">{spacing[key as keyof SpacingSettings]}</span>
                           <button onClick={() => updateSpacing(key as keyof SpacingSettings, 2)} className="w-5 h-5 rounded bg-slate-200 dark:bg-slate-600">+</button>
                        </div>
                     </div>
                  ))}
                </motion.div>
              )}
               </AnimatePresence>
            </div>
            <button onClick={handleDownload} disabled={isDownloading} className="flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400">
              {isDownloading ? 'Downloading...' : <><ArrowDownTrayIcon className="w-5 h-5"/> Download PDF</>}
            </button>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Close preview">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-grow bg-slate-200 dark:bg-slate-900 rounded-b-lg overflow-auto p-8 flex justify-center">
            <div ref={previewRef} className="w-[210mm] min-h-[297mm] bg-white shadow-2xl">
                {renderTemplate()}
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PaperPreview;