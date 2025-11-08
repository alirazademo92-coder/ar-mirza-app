

import React from 'react';
// Fix: PaperState is exported from types.ts, not usePaperBuilder.ts.
import { PaperState, SpacingSettings, QuestionType, PaperQuestion, MCQ } from '../../../types';
import { useMemo } from 'react';

interface TemplateProps {
  paper: PaperState;
  spacing: SpacingSettings;
}

const CompactTemplate: React.FC<TemplateProps> = ({ paper, spacing }) => {
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
    <div className="p-10 font-sans text-black text-sm" style={{ fontFamily: 'Lora, serif' }}>
      {/* Header */}
      <header style={{ marginBottom: `${spacing.afterHeader / 2}px` }}>
        <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">{settings.schoolName}</h1>
            <h2 className="text-lg">{settings.paperTitle}</h2>
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <span>Teacher: {settings.teacherName}</span>
          <span>Date: {settings.date}</span>
          <span>Duration: {settings.duration}</span>
        </div>
      </header>
      <hr className="my-2 border-black/50"/>

      {/* MCQs */}
      {groupedQuestions.mcq && (
        <section style={{ marginBottom: `${spacing.afterMcqs / 2}px` }}>
          <h3 className="text-base font-bold">Q1: Choose the correct option.</h3>
          <div className="grid grid-cols-2 gap-x-4 mt-1">
            {groupedQuestions.mcq.map((q, index) => (
              <div key={q.paperId} style={{ marginBottom: `${spacing.mcqItemSpacing / 2}px` }}>
                <span className="font-semibold">{index + 1}.</span> {q.originalQuestion.text} ({q.marks})
                 <div className="grid grid-cols-2 gap-x-2 ml-4 mt-1 text-xs">
                    {(q.originalQuestion as MCQ).options.map((opt, i) => (
                        <span key={i}>{String.fromCharCode(97 + i)}) {opt}</span>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Short Questions */}
      {groupedQuestions.short && (
        <section style={{ marginBottom: `${spacing.afterShortQuestions / 2}px` }}>
          <div className="flex justify-between items-baseline">
            <h3 className="text-base font-bold">Q2: Answer any {attemptRules.short?.attempt || 'All'} short questions.</h3>
          </div>
          <ol className="list-decimal list-inside mt-1 columns-2">
            {groupedQuestions.short.map((q) => (
              <li key={q.paperId} style={{ marginBottom: `${spacing.questionItemSpacing / 2}px` }} className="break-inside-avoid">
                {q.originalQuestion.text} <span className="font-bold">({q.marks})</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Long Questions */}
      {groupedQuestions.long && (
        <section style={{ marginBottom: `${spacing.afterLongQuestions / 2}px` }}>
          <div className="flex justify-between items-baseline">
            <h3 className="text-base font-bold">Q3: Answer any {attemptRules.long?.attempt || 'All'} long questions.</h3>
          </div>
          <ol className="list-decimal list-inside mt-1">
            {groupedQuestions.long.map((q) => (
              <li key={q.paperId} style={{ marginBottom: `${spacing.questionItemSpacing / 2}px` }}>
                {q.originalQuestion.text} <span className="font-bold">({q.marks})</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
};

export default CompactTemplate;