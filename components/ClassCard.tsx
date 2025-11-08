import React from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { AppClass } from '../types';

interface ClassCardProps {
  appClass: AppClass;
  Icon: React.ElementType;
  onClick: () => void;
}

const colorClasses = {
  indigo: { text: 'text-indigo-500', bg: 'bg-indigo-500/10', bar: 'bg-indigo-500' },
  sky: { text: 'text-sky-500', bg: 'bg-sky-500/10', bar: 'bg-sky-500' },
  emerald: { text: 'text-emerald-500', bg: 'bg-emerald-500/10', bar: 'bg-emerald-500' },
  rose: { text: 'text-rose-500', bg: 'bg-rose-500/10', bar: 'bg-rose-500' },
};

const cardVariants = {
  rest: { y: 0 },
  hover: { y: -5 },
};

const barVariants = {
  rest: { width: '0%' },
  hover: { width: '100%' },
};

const ClassCard: React.FC<ClassCardProps> = ({ appClass, Icon, onClick }) => {
  const { title, description, color } = appClass;
  const colorTheme = colorClasses[color as keyof typeof colorClasses];

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={cardVariants}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      onClick={onClick}
      className="group relative p-6 bg-white/50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 cursor-pointer text-center flex flex-col items-center overflow-hidden"
    >
      <div className="relative z-10 flex flex-col items-center h-full">
        <div className={clsx("p-3 rounded-full mb-4", colorTheme.text, colorTheme.bg)}>
          <Icon className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-zinc-800 dark:text-white">{title}</h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6 flex-grow">{description}</p>
        <button className="w-full mt-auto bg-sky-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-zinc-800 transition-colors">
          Select Class
        </button>
      </div>

      <motion.div
        className={clsx("absolute bottom-0 left-1/2 -translate-x-1/2 h-1.5", colorTheme.bar)}
        variants={barVariants}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      />
    </motion.div>
  );
};

export default ClassCard;
