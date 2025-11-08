import React, { useState, useEffect } from 'react';
import { AppClass } from '../../types';
import ClassCard from '../ClassCard';
import { 
  AcademicCapIcon, 
  BookOpenIcon, 
  BeakerIcon, 
  GlobeAltIcon, 
  DocumentChartBarIcon, 
  SparklesIcon 
} from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

interface ClassSelectionScreenProps {
  onClassSelect: (appClass: AppClass) => void;
}

const iconMap: { [key: string]: React.ElementType } = {
  "academic-cap": AcademicCapIcon,
  "book-open": BookOpenIcon,
  "beaker": BeakerIcon,
  "bookmark": GlobeAltIcon,
};

const ClassSelectionScreen: React.FC<ClassSelectionScreenProps> = ({ onClassSelect }) => {
  const [classes, setClasses] = useState<AppClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/manifest.json')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch class manifest. The file might be missing or malformed.');
        }
        return res.json();
      })
      .then((data: AppClass[]) => {
        setClasses(data);
      })
      .catch(error => {
        console.error("Error loading class data:", error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <ErrorMessage message="Could Not Load Classes" details={error} />;
    }
    if (classes.length > 0) {
      return (
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {classes.map((appClass, index) => (
            <motion.div
              key={appClass.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ClassCard 
                appClass={appClass} 
                Icon={iconMap[appClass.icon] || AcademicCapIcon}
                onClick={() => onClassSelect(appClass)}
              />
            </motion.div>
          ))}
        </div>
      );
    }
    return <ErrorMessage message="No Classes Found" details="The main manifest file seems to be empty." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="animate-scale-in"
    >
      {/* Class Selection Section */}
      <div className="text-center pt-8 pb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white mb-4">
          Exam Paper Generator
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-zinc-600 dark:text-zinc-400">
          Create board-standard exam papers in minutes. Select a class to get started.
        </p>
      </div>

      {renderContent()}

      {/* Features & Stats Section */}
      <div className="text-center pt-16 pb-12">
        <h2 className="text-4xl font-extrabold text-zinc-900 dark:text-white mb-4">
          Powerful Features, Simple Interface
        </h2>
        <p className="max-w-3xl mx-auto text-lg text-zinc-600 dark:text-zinc-400">
          Everything you need to streamline your paper generation process.
        </p>
      </div>

      {/* Features Section */}
      <div className="max-w-5xl mx-auto bg-white dark:bg-zinc-800/50 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700/50 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-700">
          <div className="p-8 text-center flex flex-col items-center">
            <DocumentChartBarIcon className="w-10 h-10 mb-4 text-indigo-500" />
            <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-2">Board Format</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">Papers generated in exact Gujranwala Board format</p>
          </div>
          <div className="p-8 text-center flex flex-col items-center">
            <BookOpenIcon className="w-10 h-10 mb-4 text-indigo-500" />
            <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-2">Complete Syllabus</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">Access all textbook content and questions</p>
          </div>
          <div className="p-8 text-center flex flex-col items-center">
            <SparklesIcon className="w-10 h-10 mb-4 text-indigo-500" />
            <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-2">Easy to Use</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm">Simple interface for quick paper generation</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
        <div className="bg-white dark:bg-zinc-800/50 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700/50 p-6 text-center">
          <p className="text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-white">4</p>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Classes</p>
        </div>
        <div className="bg-white dark:bg-zinc-800/50 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700/50 p-6 text-center">
          <p className="text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-white">50+</p>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Subjects</p>
        </div>
        <div className="bg-white dark:bg-zinc-800/50 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700/50 p-6 text-center">
          <p className="text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-white">5000+</p>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Questions</p>
        </div>
        <div className="bg-white dark:bg-zinc-800/50 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-700/50 p-6 text-center">
          <p className="text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-white">100%</p>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Board Format</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ClassSelectionScreen;