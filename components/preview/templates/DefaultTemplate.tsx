

import React from 'react';
// Fix: PaperState is exported from types.ts, not usePaperBuilder.ts.
import { PaperState, SpacingSettings, QuestionType, PaperQuestion, MCQ } from '../../../types';
import { useMemo } from 'react';

interface TemplateProps {
  paper: PaperState;
  spacing: SpacingSettings;
}

const DefaultTemplate: React.FC<TemplateProps> = ({ paper, spacing }) => {
  const { settings, questions, attemptRules } = paper;
  
  const groupedQuestions = useMemo(() => {
    return questions.reduce((acc, q) => {
        const type = q.type;
        if (!acc[type]) acc[type] = [];
        acc[type].push(q);
        return acc;
    }, {} as Record<QuestionType, PaperQuestion[]>);
  }, [questions]);
  
  return (
    <div className="p-12 font-sans text-black" style={{ fontFamily: 'Lora, serif' }}>
      {/* Header */}
      <header className="text-center" style={{ marginBottom: `${spacing.afterHeader}px` }}>
        <h1 className="text-2xl font-bold">{settings.schoolName}</h1>
        <h2 className="text-xl">{settings.paperTitle}</h2>
        <div className="flex justify-between mt-4 text-sm">
          <span>Teacher: {settings.teacherName}</span>
          <span>Date: {settings.date}</span>
          <span>Duration: {settings.duration}</span>
        </div>
      </header>
      <hr className="my-4 border-black"/>

      {/* MCQs */}
      {groupedQuestions.mcq && (
        <section style={{ marginBottom: `${spacing.afterMcqs}px` }}>
          <h3 className="text-lg font-bold">Q1: Choose the correct option.</h3>
          <ol className="list-decimal list-inside mt-2">
            {groupedQuestions.mcq.map((q, index) => (
              <li key={q.paperId} style={{ marginBottom: `${spacing.mcqItemSpacing}px` }}>
                <div className="flex justify-between">
                    <span>{q.originalQuestion.text}</span>
                    <span className="font-bold">({q.marks})</span>
                </div>
                <div className="grid grid-cols-4 gap-x-4 ml-4 mt-1 text-sm">
                    {(q.originalQuestion as MCQ).options.map((opt, i) => (
                        <span key={i}>{String.fromCharCode(97 + i)}) {opt}</span>
                    ))}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Short Questions */}
      {groupedQuestions.short && (
        <section style={{ marginBottom: `${spacing.afterShortQuestions}px` }}>
          <div className="flex justify-between items-baseline">
            <h3 className="text-lg font-bold">Q2: Answer the following short questions.</h3>
            <span className="font-semibold text-sm">Attempt any {attemptRules.short?.attempt || 'All'}</span>
          </div>
          <ol className="list-decimal list-inside mt-2">
            {groupedQuestions.short.map((q) => (
              <li key={q.paperId} style={{ marginBottom: `${spacing.questionItemSpacing}px` }} className="flex justify-between">
                <span>{q.originalQuestion.text}</span>
                <span className="font-bold">({q.marks})</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Long Questions */}
      {groupedQuestions.long && (
        <section style={{ marginBottom: `${spacing.afterLongQuestions}px` }}>
          <div className="flex justify-between items-baseline">
            <h3 className="text-lg font-bold">Q3: Answer the following long questions in detail.</h3>
            <span className="font-semibold text-sm">Attempt any {attemptRules.long?.attempt || 'All'}</span>
          </div>
          <ol className="list-decimal list-inside mt-2">
            {groupedQuestions.long.map((q) => (
              <li key={q.paperId} style={{ marginBottom: `${spacing.questionItemSpacing}px` }} className="flex justify-between">
                <span>{q.originalQuestion.text}</span>
                <span className="font-bold">({q.marks})</span>
              </li>
            ))}
          </ol>
        </section>
      )}
      
      {/* Urdu/Translation Questions */}
      {groupedQuestions.translation && (
        <section className="font-serif" dir="rtl">
          <h3 className="text-lg font-bold text-right">سوال: ترجمہ کریں</h3>
          <ol className="list-decimal list-inside mt-2 text-right">
             {groupedQuestions.translation.map((q) => (
              <li key={q.paperId} style={{ marginBottom: `${spacing.questionItemSpacing}px` }} className="flex justify-between">
                <span>{q.originalQuestion.text}</span>
                <span className="font-bold">({q.marks})</span>
              </li>
            ))}
          </ol>
        </section>
      )}

    </div>
  );
};

export default DefaultTemplate;