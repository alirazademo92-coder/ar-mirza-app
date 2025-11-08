import React, { useState } from 'react';
import ThemeToggle from '../ThemeToggle';
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid';

interface HeaderProps {
    onLogoClick: () => void;
    onDownloadTextbook?: (() => Promise<void>) | null;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick, onDownloadTextbook }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadClick = async () => {
    if (!onDownloadTextbook) return;
    setIsDownloading(true);
    try {
        await onDownloadTextbook();
    } catch (error) {
        console.error("PDF download failed", error);
        alert("Sorry, the PDF could not be generated.");
    } finally {
        setIsDownloading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sky-200/60 dark:border-sky-500/20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={onLogoClick}
            title="AR MirZA - Exam Paper Generator"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-sky-600 dark:text-sky-400"
              viewBox="0 0 24 24"
              fill="none"
            >
              <title>AR MirZA Logo</title>
              {/* Abstract 'AR' Shape */}
              <path 
                d="M6 19V7C6 5.34315 7.34315 4 9 4H9C10.6569 4 12 5.34315 12 7V19M12 19V7C12 5.34315 13.3431 4 15 4H15C16.6569 4 18 5.34315 18 7V19" 
                stroke="currentColor" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              {/* Red Heart */}
              <path 
                fill="#ef4444" 
                stroke="#ef4444" 
                strokeWidth="0.5" 
                d="M12 15.5C11.1667 15.1667 9 13.8 9 12C9 10.8954 9.89543 10 11 10C11.6934 10 12.2885 10.3704 12.6 10.8C12.9115 10.3704 13.5066 10 14.2 10C15.3046 10 16.2 10.8954 16.2 12C16.2 13.8 14.0333 15.1667 13.2 15.5L12.6 15.8L12 15.5Z" 
              />
            </svg>
            <h1 className="text-3xl font-semibold tracking-wide text-zinc-800 dark:text-zinc-200 leading-8">
              <span className="font-bold text-sky-600 dark:text-sky-400">AR</span> MirZA
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {onDownloadTextbook && (
              <button
                onClick={handleDownloadClick}
                disabled={isDownloading}
                className="p-2 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-zinc-900 transition-colors disabled:opacity-50 disabled:cursor-wait"
                aria-label="Download Textbook PDF"
                title="Download Textbook PDF"
              >
                {isDownloading ? (
                    <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <ArrowDownTrayIcon className="w-6 h-6" />
                )}
              </button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;