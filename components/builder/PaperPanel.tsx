
import React, { useState, useMemo, useEffect } from 'react';
import { PaperState, PaperSettings, QuestionType, PaperQuestion } from '../../types';
import { TrashIcon, DocumentPlusIcon, Cog6ToothIcon, PaperAirplaneIcon, PlusIcon } from '@heroicons/react/24/solid';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';

interface PaperPanelProps {
  paper: PaperState;
  onRemoveQuestion: (paperId: string) => void;
  onUpdateMarks: (paperId: string, marks: number) => void;
  onUpdateSettings: (settings: Partial<PaperSettings>) => void;
  onUpdateAttemptRule: (section: string, attempt: number) => void;
  onAddCustomQuestion: (payload: { text: string; type: QuestionType; marks: number; options?: string[] }) => void;
  onGenerate: () => void;
  totalMarks: number;
  activeTab: 'paper' | 'settings' | 'custom';
  setActiveTab: (tab: 'paper' | 'settings' | 'custom') => void;
  customQuestionText: string;
  setCustomQuestionText: (text: string) => void;
}

const tabIcons = {
    paper: DocumentPlusIcon,
    settings: Cog6ToothIcon,
    custom: PaperAirplaneIcon,
};

const PaperPanel: React.FC<PaperPanelProps> = (props) => {
  const {
    paper, onRemoveQuestion, onUpdateMarks, onUpdateSettings, onUpdateAttemptRule,
    onAddCustomQuestion, onGenerate, totalMarks, activeTab, setActiveTab,
    customQuestionText, setCustomQuestionText
  } = props;
  
  const groupedQuestions = useMemo(() => {
    return paper.questions.reduce((acc, q) => {
        const type = q.type;
        if (!acc[type]) acc[type] = [];
        acc[type].push(q);
        return acc;
    }, {} as Record<QuestionType, PaperQuestion[]>);
  }, [paper.questions]);

  return (
    <div className="bg-white dark:bg-zinc-900/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header Tabs */}
      <div className="flex-shrink-0 mb-4">
        <div className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg flex space-x-1">
          {(['paper', 'settings', 'custom'] as const).map(tab => {
            const Icon = tabIcons[tab];
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  'flex-1 py-2 px-2 rounded-md font-medium text-sm transition-colors flex items-center justify-center gap-2',
                  activeTab === tab 
                    ? 'bg-white dark:bg-zinc-700 text-sky-600 dark:text-sky-400 shadow-sm' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="capitalize">{tab}</span>
              </button>
            )
          })}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-grow overflow-y-auto pr-2 -mr-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'paper' && <PaperContent paper={paper} onRemoveQuestion={onRemoveQuestion} onUpdateMarks={onUpdateMarks} groupedQuestions={groupedQuestions} />}
            {activeTab === 'settings' && <SettingsContent paper={paper} onUpdateSettings={onUpdateSettings} onUpdateAttemptRule={onUpdateAttemptRule} groupedQuestions={groupedQuestions} />}
            {activeTab === 'custom' && <CustomQuestionContent onAddCustomQuestion={onAddCustomQuestion} customQuestionText={customQuestionText} setCustomQuestionText={setCustomQuestionText} setActiveTab={setActiveTab} />}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Footer */}
      <div className="flex-shrink-0 mt-6 border-t border-zinc-200 dark:border-zinc-700 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-zinc-700 dark:text-zinc-300">Total Marks</span>
          <span className="text-2xl font-bold text-sky-600 dark:text-sky-400">{totalMarks}</span>
        </div>
        <button 
          onClick={onGenerate} 
          className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-zinc-800 transition-colors disabled:bg-sky-400 dark:disabled:bg-sky-800 disabled:cursor-not-allowed"
          disabled={paper.questions.length === 0}
        >
          Generate Paper
        </button>
      </div>
    </div>
  );
};

// Sub-components for each tab to keep the main component clean

const PaperContent: React.FC<{ paper: PaperState; onRemoveQuestion: (id: string) => void; onUpdateMarks: (id: string, marks: number) => void; groupedQuestions: Record<QuestionType, PaperQuestion[]> }> = ({ paper, onRemoveQuestion, onUpdateMarks, groupedQuestions }) => {
    if (paper.questions.length === 0) {
        return <div className="text-center text-zinc-500 py-10">Add questions from the Question Bank or Textbook to get started.</div>
    }

    return (
        <div className="space-y-6">
            {(Object.keys(groupedQuestions) as QuestionType[]).map(type => (
                <div key={type}>
                    <h3 className="font-semibold capitalize text-zinc-700 dark:text-zinc-300 mb-2">{type} Questions</h3>
                    <div className="space-y-2">
                        {groupedQuestions[type].map(q => (
                            <div key={q.paperId} className="p-2 rounded-md bg-zinc-50 dark:bg-zinc-800/50 text-sm flex justify-between items-center">
                                <p className="flex-1 text-zinc-700 dark:text-zinc-300 pr-2 truncate">{q.originalQuestion.text}</p>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="number" 
                                        value={q.marks} 
                                        onChange={(e) => onUpdateMarks(q.paperId, parseInt(e.target.value) || 0)}
                                        className="w-12 text-center bg-white dark:bg-zinc-700 border border-zinc-300 dark:border-zinc-600 rounded-md p-1 text-xs"
                                    />
                                    <button onClick={() => onRemoveQuestion(q.paperId)} className="p-1.5 text-zinc-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

const SettingsContent: React.FC<{ paper: PaperState; onUpdateSettings: (s: Partial<PaperSettings>) => void; onUpdateAttemptRule: (section: string, attempt: number) => void; groupedQuestions: Record<QuestionType, PaperQuestion[]> }> = ({ paper, onUpdateSettings, onUpdateAttemptRule, groupedQuestions }) => {
    const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdateSettings({ [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-6 text-sm">
            <div>
                <h3 className="font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Paper Details</h3>
                <div className="space-y-2">
                    {Object.keys(paper.settings).map(key => (
                        <div key={key}>
                            <label className="capitalize text-zinc-600 dark:text-zinc-400 block mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                            <input 
                                type={key === 'date' ? 'date' : 'text'}
                                name={key}
                                value={paper.settings[key as keyof PaperSettings]}
                                onChange={handleSettingChange}
                                className="w-full p-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md"
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Attempt Rules</h3>
                <div className="space-y-2">
                    {(Object.keys(groupedQuestions) as QuestionType[]).map(section => {
                        if (section === 'mcq' || section === 'custom' || section === 'translation') return null; // Typically no attempt rules for these
                        const total = groupedQuestions[section].length;
                        if (total === 0) return null;

                        const currentAttempt = paper.attemptRules[section]?.attempt || total;

                        return (
                            <div key={section} className="flex justify-between items-center">
                                <label className="capitalize text-zinc-600 dark:text-zinc-400">{section} Questions</label>
                                <div className="flex items-center gap-2">
                                    <span>Attempt</span>
                                    <input 
                                        type="number"
                                        value={currentAttempt}
                                        onChange={(e) => onUpdateAttemptRule(section, Math.min(total, parseInt(e.target.value) || 0))}
                                        className="w-16 text-center bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md p-1"
                                        min="1"
                                        max={total}
                                    />
                                    <span>of {total}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

const CustomQuestionContent: React.FC<{
    onAddCustomQuestion: (payload: { text: string; type: QuestionType; marks: number; options?: string[] }) => void;
    customQuestionText: string;
    setCustomQuestionText: (text: string) => void;
    setActiveTab: (tab: 'paper' | 'settings' | 'custom') => void;
}> = ({ onAddCustomQuestion, customQuestionText, setCustomQuestionText, setActiveTab }) => {
    const [type, setType] = useState<QuestionType>('short');
    const [marks, setMarks] = useState(2);
    const [options, setOptions] = useState(['', '', '', '']);

    useEffect(() => {
        if (customQuestionText) {
            // A simple heuristic to guess the question type
            if (customQuestionText.length > 150) {
                setType('long');
                setMarks(5);
            } else {
                setType('short');
                setMarks(2);
            }
        }
    }, [customQuestionText]);

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleAdd = () => {
        if (!customQuestionText.trim()) return;
        onAddCustomQuestion({
            text: customQuestionText,
            type,
            marks,
            options: type === 'mcq' ? options.filter(o => o.trim()) : undefined,
        });
        setCustomQuestionText(''); // Clear after adding
        setActiveTab('paper'); // Switch back to paper view
    };

    return (
        <div className="space-y-4 text-sm">
            <p className="text-zinc-500">Extract text from the textbook or write your own custom question.</p>
            <div>
                <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Question Text</label>
                <textarea
                    value={customQuestionText}
                    onChange={(e) => setCustomQuestionText(e.target.value)}
                    rows={5}
                    className="w-full p-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md"
                    placeholder="e.g., What is photosynthesis?"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Type</label>
                    <select value={type} onChange={(e) => setType(e.target.value as QuestionType)} className="w-full p-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md">
                        <option value="short">Short</option>
                        <option value="long">Long</option>
                        <option value="mcq">MCQ</option>
                        <option value="translation">Translation</option>
                        <option value="custom">Custom</option>
                    </select>
                </div>
                 <div>
                    <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Marks</label>
                    <input
                        type="number"
                        value={marks}
                        onChange={(e) => setMarks(parseInt(e.target.value) || 0)}
                        className="w-full p-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md"
                    />
                </div>
            </div>
            {type === 'mcq' && (
                <div>
                    <label className="font-medium text-zinc-700 dark:text-zinc-300 block mb-1">Options</label>
                    <div className="grid grid-cols-2 gap-2">
                        {options.map((opt, i) => (
                            <input
                                key={i}
                                type="text"
                                value={opt}
                                onChange={(e) => handleOptionChange(i, e.target.value)}
                                placeholder={`Option ${i + 1}`}
                                className="w-full p-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-md"
                            />
                        ))}
                    </div>
                </div>
            )}
            <button onClick={handleAdd} className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                <PlusIcon className="w-5 h-5" />
                Add Custom Question
            </button>
        </div>
    );
};

export default PaperPanel;
