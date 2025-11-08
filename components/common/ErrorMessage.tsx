import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

interface ErrorMessageProps {
  message: string;
  details?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, details }) => {
  return (
    <div className="text-center py-16 px-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-lg">
      <ExclamationTriangleIcon className="w-12 h-12 mx-auto text-red-400" />
      <h3 className="mt-2 text-lg font-semibold text-red-800 dark:text-red-300">{message}</h3>
      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
        {details || 'Please check your connection or try again later.'}
      </p>
    </div>
  );
};

export default ErrorMessage;
