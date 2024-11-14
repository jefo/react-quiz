import { writable, get } from 'svelte/store';

export interface QuizResults {
  technology: string;
  skillScores: Record<string, number>;
  level: string;
  timestamp: number;
}

export interface QuizState {
  inProgress: boolean;
  currentStep: number;
  answers: Record<string, number>;
  lastResults: QuizResults | null;
}

const initialState: QuizState = {
  inProgress: false,
  currentStep: 0,
  answers: {},
  lastResults: null
};

function createQuizStore() {
  const { subscribe, set, update } = writable<QuizState>(initialState);

  return {
    subscribe,
    update,
    set,
    startQuiz: () => update(state => ({ ...state, inProgress: true, currentStep: 0, answers: {} })),
    nextStep: () => update(state => ({ ...state, currentStep: state.currentStep + 1 })),
    prevStep: () => update(state => ({ ...state, currentStep: Math.max(0, state.currentStep - 1) })),
    setAnswer: (questionId: string, value: number) => 
      update(state => ({ 
        ...state, 
        answers: { ...state.answers, [questionId]: value }
      })),
    finishQuiz: (results: QuizResults) => 
      update(state => ({
        ...state,
        inProgress: false,
        currentStep: 0,
        lastResults: results
      })),
    reset: () => set(initialState)
  };
}

export const quizStore = createQuizStore();
