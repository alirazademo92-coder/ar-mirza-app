import React, { useState, useEffect } from 'react';
import { AppClass, AppSubject } from '../../types';
import SubjectCard from '../SubjectCard';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

interface SubjectSelectionScreenProps {
  selectedClass: AppClass;
  onSubjectSelect: (subject: AppSubject) => void;
  onBack: () => void;
}

const SubjectSelectionScreen: React.FC<SubjectSelectionScreenProps> = ({ selectedClass, onSubjectSelect, onBack }) => {
  const [subjects, setSubjects] = useState<AppSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const classNumber = selectedClass.title.match(/\d+/)?.[0];

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/data/${selectedClass.id}/manifest.json`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch subjects for ${selectedClass.title}.`);
        }
        return res.json();
      })
      .then(data => setSubjects(data))
      .catch(error => {
        console.error(error);
        setError(error.message);
        setSubjects([]);
      })
      .finally(() => setLoading(false));
  }, [selectedClass.id, selectedClass.title]);

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <ErrorMessage message="Could Not Load Subjects" details={error} />;
    }
    if (subjects.length === 0) {
      return <ErrorMessage message="No Subjects Found" details={`There are no subjects defined for ${selectedClass.title}.`} />;
    }
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        <AnimatePresence>
          {subjects.map((subject, index) => (
             <motion.div
                key={subject.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
             >
                <SubjectCard subject={subject} onClick={() => onSubjectSelect(subject)} index={index} classNumber={classNumber} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="animate-scale-in"
    >
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 py-2 px-4 rounded-lg border border-sky-600 dark:border-sky-500 text-sky-600 dark:text-sky-500 font-semibold text-sm transition-colors hover:bg-sky-600 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white mb-6"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        <span>Back to Class Selection</span>
      </button>
      <h1 className="text-3xl font-bold mb-8 text-zinc-900 dark:text-white">Select Subject for {selectedClass.title}</h1>
      {renderContent()}
    </motion.div>
  );
};

export default SubjectSelectionScreen;