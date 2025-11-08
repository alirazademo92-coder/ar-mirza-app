import React from 'react';
import { Question, QuestionType, MCQ } from '../../types';
import { PlusIcon, CheckIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface QuestionCardProps {
  question: Question;
  type: QuestionType;
  onAdd: () => void;
  isAdded: boolean;
}

const difficultyColors = {
  Easy: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 ring-1 ring-inset ring-green-200 dark:ring-green-800',
  Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 ring-1 ring-inset ring-yellow-200 dark:ring-yellow-800',
  Hard: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 ring-1 ring-inset ring-red-200 dark:ring-red-800',
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question, type, onAdd, isAdded }) => {
  return (
    <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg flex justify-between items-start gap-4 bg-white dark:bg-zinc-800/50 hover:border-sky-400/50 dark:hover:border-sky-600/50 transition-colors duration-300">
      <div className="flex-1">
        <div className="flex items-center gap-3 text-xs mb-2">
           <span className={clsx("px-2 py-0.5 rounded-full font-medium", difficultyColors[question.difficulty])}>
            {question.difficulty}
          </span>
          <span className="font-semibold text-sky-600 dark:text-sky-400">Marks: {question.marks}</span>
          <span className="text-zinc-500">Page: {question.page}</span>
        </div>
        <p className="text-zinc-800 dark:text-zinc-200">{question.text}</p>
        {type === 'mcq' && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400 mt-2">
            {(question as MCQ).options.map((opt, i) => (
              <span key={i}>{String.fromCharCode(97 + i)}) {opt}</span>
            ))}
          </div>
        )}
      </div>
      <div>
        {isAdded ? (
          <div className="flex items-center space-x-2 bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 font-semibold py-2 px-3 rounded-lg text-sm">
            <CheckIcon className="w-4 h-4" />
            <span>Added</span>
          </div>
        ) : (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAdd}
            className="flex items-center gap-2 py-2 px-3 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-600 font-semibold text-sm transition-all duration-200"
            aria-label="Add question"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add</span>
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;