
export interface AppClass {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface AppSubject {
  id: string;
  name: string;
  icon: string;
}

export interface Chapter {
  id: string;
  title: string;
}

export type QuestionType = 'mcq' | 'short' | 'long' | 'translation' | 'custom';
export type QuestionDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface BaseQuestion {
  id: string;
  text: string;
  marks: number;
  page: number;
  difficulty: QuestionDifficulty;
}

export interface MCQ extends BaseQuestion {
  options: string[];
  answer: string;
}

export interface ShortQuestion extends BaseQuestion {}
export interface LongQuestion extends BaseQuestion {}

export type Question = MCQ | ShortQuestion | LongQuestion;

export interface PaperQuestion {
  // Unique ID for the item in the paper, different from original question ID
  paperId: string; 
  originalQuestion: Question;
  type: QuestionType;
  marks: number; // Marks can be overridden
}

export interface PaperSettings {
  schoolName: string;
  paperTitle: string;
  teacherName: string;
  date: string;
  duration: string;
}

export interface AttemptRule {
  [section: string]: {
    total: number;
    attempt: number;
  };
}

// Fix: Moved PaperState here from hooks/usePaperBuilder.ts to resolve import error.
export interface PaperState {
    questions: PaperQuestion[];
    settings: PaperSettings;
    attemptRules: AttemptRule;
}

export type Template = 'Default' | 'Compact' | 'Modern';

export interface SpacingSettings {
  afterHeader: number;
  afterMcqs: number;
  afterShortQuestions: number;
  afterLongQuestions: number;
  mcqItemSpacing: number;
  questionItemSpacing: number;
}