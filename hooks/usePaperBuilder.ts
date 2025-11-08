import { useState, useReducer, useCallback, useMemo } from 'react';
// Fix: Import PaperState from types.ts as it has been moved there.
import { PaperQuestion, Question, PaperSettings, AttemptRule, QuestionType, PaperState } from '../types';

type PaperAction =
    | { type: 'ADD_QUESTION'; payload: Question }
    | { type: 'REMOVE_QUESTION'; payload: string } // paperId
    | { type: 'UPDATE_MARKS'; payload: { paperId: string; marks: number } }
    | { type: 'UPDATE_SETTINGS'; payload: Partial<PaperSettings> }
    | { type: 'UPDATE_ATTEMPT_RULE'; payload: { section: string; attempt: number } }
    | { type: 'ADD_CUSTOM_QUESTION'; payload: { text: string; type: QuestionType; marks: number; options?: string[] } };

const initialPaperState: PaperState = {
    questions: [],
    settings: {
        schoolName: 'Your School Name',
        paperTitle: 'Mid-Term Examination',
        teacherName: 'Teacher Name',
        date: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD
        duration: '3 Hours',
    },
    attemptRules: {},
};

const getQuestionType = (question: Question): QuestionType => {
    if ('options' in question) return 'mcq';
    if (question.text.toLowerCase().includes('translate')) return 'translation';
    if (question.marks > 4) return 'long';
    return 'short';
};


const paperReducer = (state: PaperState, action: PaperAction): PaperState => {
    switch (action.type) {
        case 'ADD_QUESTION': {
            const newPaperQuestion: PaperQuestion = {
                paperId: `pq-${Date.now()}-${Math.random()}`,
                originalQuestion: action.payload,
                type: getQuestionType(action.payload),
                marks: action.payload.marks,
            };
            return {
                ...state,
                questions: [...state.questions, newPaperQuestion],
            };
        }
        case 'REMOVE_QUESTION':
            return {
                ...state,
                questions: state.questions.filter(q => q.paperId !== action.payload),
            };
        case 'UPDATE_MARKS':
            return {
                ...state,
                questions: state.questions.map(q =>
                    q.paperId === action.payload.paperId ? { ...q, marks: action.payload.marks } : q
                ),
            };
        case 'UPDATE_SETTINGS':
            return {
                ...state,
                settings: { ...state.settings, ...action.payload },
            };
        case 'UPDATE_ATTEMPT_RULE': {
            const sectionQuestions = state.questions.filter(q => q.type === action.payload.section);
            return {
                ...state,
                attemptRules: {
                    ...state.attemptRules,
                    [action.payload.section]: {
                        total: sectionQuestions.length,
                        attempt: action.payload.attempt,
                    }
                }
            };
        }
        case 'ADD_CUSTOM_QUESTION': {
            const customQuestion: Question = {
                id: `custom-${Date.now()}`,
                text: action.payload.text,
                marks: action.payload.marks,
                page: 0,
                difficulty: 'Medium',
                ...(action.payload.type === 'mcq' && { options: action.payload.options || [], answer: '' }),
            };
            const newPaperQuestion: PaperQuestion = {
                paperId: `pq-${Date.now()}-${Math.random()}`,
                originalQuestion: customQuestion,
                type: action.payload.type,
                marks: action.payload.marks,
            };
             return {
                ...state,
                questions: [...state.questions, newPaperQuestion],
            };
        }
        default:
            return state;
    }
};


const usePaperBuilder = () => {
    const [paper, dispatch] = useReducer(paperReducer, initialPaperState);

    const addQuestion = useCallback((question: Question) => {
        dispatch({ type: 'ADD_QUESTION', payload: question });
    }, []);

    const removeQuestion = useCallback((paperId: string) => {
        dispatch({ type: 'REMOVE_QUESTION', payload: paperId });
    }, []);

    const updateQuestionMarks = useCallback((paperId: string, marks: number) => {
        dispatch({ type: 'UPDATE_MARKS', payload: { paperId, marks } });
    }, []);

    const updateSettings = useCallback((settings: Partial<PaperSettings>) => {
        dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
    }, []);
    
    const updateAttemptRule = useCallback((section: string, attempt: number) => {
        dispatch({ type: 'UPDATE_ATTEMPT_RULE', payload: { section, attempt }});
    }, []);

    const addCustomQuestion = useCallback((payload: { text: string; type: QuestionType; marks: number; options?: string[] }) => {
        dispatch({ type: 'ADD_CUSTOM_QUESTION', payload });
    }, []);
    
    const totalMarks = useMemo(() => {
        const groupedBySection = paper.questions.reduce((acc, q) => {
            const section = q.type;
            if (!acc[section]) {
                acc[section] = [];
            }
            acc[section].push(q);
            return acc;
        }, {} as Record<string, PaperQuestion[]>);

        return (Object.values(groupedBySection) as PaperQuestion[][]).reduce((total, sectionQuestions) => {
            if (!sectionQuestions || sectionQuestions.length === 0) {
                return total;
            }
            const sectionType = sectionQuestions[0].type;
            const rule = paper.attemptRules[sectionType];
            
            if (rule && rule.attempt > 0 && rule.attempt <= sectionQuestions.length) {
                // Sort questions by marks descending and sum the top 'attempt' questions
                const marksToSum = sectionQuestions
                    .map(q => q.marks)
                    .sort((a, b) => b - a)
                    .slice(0, rule.attempt);
                return total + marksToSum.reduce((sum, mark) => sum + mark, 0);
            } else {
                // Sum all questions if no valid rule or rule is not applicable
                return total + sectionQuestions.reduce((sectionTotal, q) => sectionTotal + q.marks, 0);
            }
        }, 0);
    }, [paper.questions, paper.attemptRules]);


    return {
        paper,
        addQuestion,
        removeQuestion,
        updateQuestionMarks,
        updateSettings,
        updateAttemptRule,
        addCustomQuestion,
        totalMarks,
    };
};

export default usePaperBuilder;