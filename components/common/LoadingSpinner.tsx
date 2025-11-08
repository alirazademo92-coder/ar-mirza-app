import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-sky-600 dark:border-sky-400"></div>
    </div>
  );
};

export default LoadingSpinner;
