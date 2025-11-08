import React from 'react';
import { AppSubject } from '../../types';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface SubjectCardProps {
  subject: AppSubject;
  onClick: () => void;
  index: number;
  classNumber?: string;
}

const colorThemes = [
  { main: 'bg-sky-600 dark:bg-sky-700', label: 'bg-sky-700/70 dark:bg-sky-800/70' },
  { main: 'bg-emerald-600 dark:bg-emerald-700', label: 'bg-emerald-700/70 dark:bg-emerald-800/70' },
  { main: 'bg-rose-600 dark:bg-rose-700', label: 'bg-rose-700/70 dark:bg-rose-800/70' },
  { main: 'bg-indigo-600 dark:bg-indigo-700', label: 'bg-indigo-700/70 dark:bg-indigo-800/70' },
  { main: 'bg-amber-600 dark:bg-amber-700', label: 'bg-amber-700/70 dark:bg-amber-800/70' },
  { main: 'bg-violet-600 dark:bg-violet-700', label: 'bg-violet-700/70 dark:bg-violet-800/70' },
];


const SubjectCard: React.FC<SubjectCardProps> = ({ subject, onClick, index, classNumber }) => {
  const theme = colorThemes[index % colorThemes.length];
  
  return (
    <motion.div
      whileHover="hover"
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onClick={onClick}
      className={clsx(
        "group relative cursor-pointer aspect-[3/4] w-full rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2",
        theme.main
      )}
    >
      {/* Background Class Number */}
      {classNumber && (
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-extrabold text-white/15 select-none z-0">
          {classNumber}
        </span>
      )}

      {/* Pages on the right side */}
      <div className="absolute top-1 bottom-1 right-1 w-3 bg-zinc-50 dark:bg-zinc-300 rounded-r-sm shadow-[inset_2px_0_3px_rgba(0,0,0,0.1)] dark:shadow-[inset_2px_0_3px_rgba(0,0,0,0.2)]"></div>

      {/* Top-left folded corner with gradient for 3D effect. */}
      <div
        className="absolute top-0 left-0 h-4 w-4 bg-gradient-to-br from-zinc-50 to-zinc-200 dark:from-zinc-300 dark:to-zinc-400"
        style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
      ></div>
      
      {/* Darker label area on the cover */}
      <div className={clsx(
        "absolute z-10 top-8 left-1/2 -translate-x-1/2 w-[70%] h-10 rounded-md flex items-center justify-center",
        theme.label
      )}>
        <span className="text-white/90 font-extrabold text-lg tracking-widest select-none">TEXTBOOK</span>
      </div>
      
      {/* Content: Icon and Subject Name */}
      <div className="relative z-10 flex flex-col items-center justify-end h-full text-center text-white px-2 pb-8">
        <motion.div
          variants={{ hover: { scale: 1.2, rotate: 5 } }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="text-5xl mb-4"
        >
          {subject.icon}
        </motion.div>
        <h3 className="font-bold">{subject.name}</h3>
      </div>
    </motion.div>
  );
};

export default SubjectCard;