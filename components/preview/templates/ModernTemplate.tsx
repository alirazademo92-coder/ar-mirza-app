

import React from 'react';
// Fix: PaperState is exported from types.ts, not usePaperBuilder.ts.
import { PaperState, SpacingSettings, QuestionType, PaperQuestion, MCQ } from '../../../types';
import { useMemo } from 'react';

interface TemplateProps {
  paper: PaperState;
  spacing: SpacingSettings;
}

const ModernTemplate: React.FC<TemplateProps> = ({ paper, spacing }) => {
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
    <div className="p-10 font-sans text-black flex" style={{ fontFamily: 'Lora, serif' }}>
      {/* Left Sidebar */}
      <aside className="w-1/4 pr-6 border-r-2 border-gray-800">
        <h1 className="text-3xl font-extrabold text-gray-800">{settings.schoolName.split(' ')[0]}</h1>
        <h2 className="text-lg text-gray-600">{settings.schoolName.split(' ').slice(1).join(' ')}</h2>
        <div className="mt-12 space-y-4 text-sm">
          <div>
            <p className="font-bold text-gray-800">Subject</p>
            <p className="text-gray-600">{settings.paperTitle}</p>
          </div>
          <div>
            <p className="font-bold text-gray-800">Instructor</p>
            <p className="text-gray-600">{settings.teacherName}</p>
          </div>
           <div>
            <p className="font-bold text-gray-800">Date</p>
            <p className="text-gray-600">{settings.date}</p>
          </div>
           <div>
            <p className="font-bold text-gray-800">Duration</p>
            <p className="text-gray-600">{settings.duration}</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-3/4 pl-8">
        {/* MCQs */}
        {groupedQuestions.mcq && (
          <section style={{ marginBottom: `${spacing.afterMcqs}px` }}>
            <h3 className="text-xl font-bold border-b-2 border-gray-800 pb-1 mb-3">Section A: Multiple Choice</h3>
            {groupedQuestions.mcq.map((q, index) => (
              <div key={q.paperId} className="flex gap-2" style={{ marginBottom: `${spacing.mcqItemSpacing}px` }}>
                <span className="font-bold">{index+1}.</span>
                <div>
                  <p>{q.originalQuestion.text} <span className="text-gray-500">({q.marks})</span></p>
                  <div className="flex gap-x-6 mt-1 text-sm">
                      {(q.originalQuestion as MCQ).options.map((opt, i) => (
                          <span key={i}>({String.fromCharCode(97 + i)}) {opt}</span>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Short Questions */}
        {groupedQuestions.short && (
          <section style={{ marginBottom: `${spacing.afterShortQuestions}px` }}>
            <h3 className="text-xl font-bold border-b-2 border-gray-800 pb-1 mb-3">Section B: Short Questions <span className="text-base font-medium text-gray-600">(Attempt any {attemptRules.short?.attempt || 'All'})</span></h3>
            <ol className="list-decimal list-outside ml-5 space-y-2">
                {groupedQuestions.short.map((q) => (
                    <li key={q.paperId} style={{ marginBottom: `${spacing.questionItemSpacing}px` }} className="pl-2">
                        {q.originalQuestion.text} <span className="text-gray-500">({q.marks})</span>
                    </li>
                ))}
            </ol>
          </section>
        )}
        
        {/* Long Questions */}
        {groupedQuestions.long && (
          <section style={{ marginBottom: `${spacing.afterLongQuestions}px` }}>
            <h3 className="text-xl font-bold border-b-2 border-gray-800 pb-1 mb-3">Section C: Long Questions <span className="text-base font-medium text-gray-600">(Attempt any {attemptRules.long?.attempt || 'All'})</span></h3>
            <ol className="list-decimal list-outside ml-5 space-y-2">
                {groupedQuestions.long.map((q) => (
                    <li key={q.paperId} style={{ marginBottom: `${spacing.questionItemSpacing}px` }} className="pl-2">
                        {q.originalQuestion.text} <span className="text-gray-500">({q.marks})</span>
                    </li>
                ))}
            </ol>
          </section>
        )}
      </main>
    </div>
  );
};

export default ModernTemplate;