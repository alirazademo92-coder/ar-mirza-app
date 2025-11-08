import React, { useState, useEffect, useCallback } from 'react';
import { Chapter, Question, QuestionType } from '../../types';
import QuestionCard from './QuestionCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

interface QuestionBankProps {
  classId: string;
  subjectId: string;
  onAddQuestion: (question: Question) => void;
  addedQuestionIds: string[];
}

const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

const QuestionBank: React.FC<QuestionBankProps> = ({ classId, subjectId, onAddQuestion, addedQuestionIds }) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Record<string, Question[]>>({});
  const [loadingChapters, setLoadingChapters] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  useEffect(() => {
    setChapters([]);
    setSelectedChapterId(null);
    setQuestions({});
    setLoadingChapters(true);
    setError(null);

    fetch(`/data/${classId}/${subjectId}/manifest.json`)
      .then(res => {
        if (res.status === 404) return [];
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data: Chapter[]) => {
        setChapters(data);
        if (data.length > 0) {
          setSelectedChapterId(data[0].id);
        }
      })
      .catch(error => {
        console.error(`Could not fetch chapter manifest for ${classId}/${subjectId}:`, error);
        setError("Could not load chapters for this subject.");
      })
      .finally(() => setLoadingChapters(false));
  }, [classId, subjectId]);

  useEffect(() => {
    if (!selectedChapterId) return;

    setLoadingQuestions(true);
    setError(null);
    fetch(`/data/${classId}/${subjectId}/${selectedChapterId}.json`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load questions for chapter ${selectedChapterId}`);
        return res.json();
      })
      .then(data => {
        setQuestions(data);
      })
      .catch(err => {
        console.error("Failed to load questions", err);
        setError(`Could not load questions for the selected chapter.`);
        setQuestions({});
      })
      .finally(() => setLoadingQuestions(false));
  }, [selectedChapterId, classId, subjectId]);

  const filteredQuestions = useCallback(() => {
    if (!questions) return {};
    if (difficultyFilter === 'All') return questions;
    
    const filtered: Record<string, Question[]> = {};
    for (const type in questions) {
      filtered[type] = questions[type].filter(q => q.difficulty === difficultyFilter);
    }
    return filtered;
  }, [questions, difficultyFilter]);
  
  const allQuestionTypesEmpty = (qs: Record<string, Question[]>) => {
    return Object.values(qs).every(arr => arr.length === 0);
  }

  return (
    <div>
      {/* Chapter Selection */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 text-zinc-700 dark:text-zinc-300">Chapters</h3>
        {loadingChapters ? <p className="text-sm text-zinc-500">Loading chapters...</p> : (
            <div className="flex space-x-2 overflow-x-auto pb-2">
            {chapters.length > 0 ? chapters.map(chapter => (
                <button
                key={chapter.id}
                onClick={() => setSelectedChapterId(chapter.id)}
                className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedChapterId === chapter.id
                    ? 'bg-sky-600 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
                >
                {chapter.title}
                </button>
            )) : <p className="text-sm text-zinc-500">No chapters found for this subject.</p>}
            </div>
        )}
      </div>
      
      {/* Difficulty Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-zinc-700 dark:text-zinc-300">Difficulty</h3>
        <div className="flex space-x-2">
            {difficulties.map(diff => (
                <button 
                    key={diff}
                    onClick={() => setDifficultyFilter(diff)}
                    className={`py-1 px-3 rounded-full text-xs font-medium transition-colors ${
                        difficultyFilter === diff 
                        ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300' 
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                >{diff}</button>
            ))}
        </div>
      </div>


      {/* Questions List */}
      <div className="space-y-6">
        {loadingQuestions ? (
          <LoadingSpinner />
        ) : error ? (
            <ErrorMessage message="Error" details={error} />
        ) : allQuestionTypesEmpty(filteredQuestions()) ? (
             <p className="text-zinc-500 text-center pt-10">No questions found for the selected chapter and difficulty.</p>
        ) : (
          (Object.entries(filteredQuestions()) as [string, Question[]][]).map(([type, qs]) => (
            qs.length > 0 && (
              <div key={type}>
                <h4 className="font-bold text-xl mb-3 capitalize text-zinc-800 dark:text-zinc-200">{type.replace(/s$/, '')} Questions</h4>
                <div className="space-y-4">
                  {qs.map(q => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      onAdd={() => onAddQuestion(q)}
                      isAdded={addedQuestionIds.includes(q.id)}
                      type={type.slice(0, -1) as QuestionType}
                    />
                  ))}
                </div>
              </div>
            )
          ))
        )}
      </div>
    </div>
  );
};

export default QuestionBank;