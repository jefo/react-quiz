import { writable } from 'svelte/store';

interface Answers {
    [key: string]: number;
}

interface QuizState {
    answers: Answers;
    lastResults: {
        level: string;
        skillScores: {
            [key: string]: number;
        };
        technology: string;
    } | null;
    inProgress: boolean;
    currentStep: number;
}

// Load initial state from localStorage
const loadState = (): QuizState => {
    if (typeof window === 'undefined') return { 
        answers: {}, 
        lastResults: null,
        inProgress: false,
        currentStep: 0
    };
    
    const saved = localStorage.getItem('quizState');
    if (saved) {
        return JSON.parse(saved);
    }
    return { 
        answers: {}, 
        lastResults: null,
        inProgress: false,
        currentStep: 0
    };
};

// Create the store with initial state
const quizStore = writable<QuizState>(loadState());

// Subscribe to changes and save to localStorage
if (typeof window !== 'undefined') {
    quizStore.subscribe(state => {
        localStorage.setItem('quizState', JSON.stringify(state));
    });
}

// Store actions
export const saveAnswers = (answers: Answers) => {
    quizStore.update(state => ({
        ...state,
        answers
    }));
};

export const saveResults = (level: string, skillScores: { [key: string]: number }, technology: string = 'react') => {
    quizStore.update(state => ({
        ...state,
        lastResults: {
            level,
            skillScores,
            technology
        },
        inProgress: false,
        currentStep: 0
    }));
};

export const updateProgress = (step: number) => {
    quizStore.update(state => ({
        ...state,
        currentStep: step,
        inProgress: true
    }));
};

export const startQuiz = () => {
    quizStore.update(state => ({
        ...state,
        inProgress: true,
        currentStep: 0
    }));
};

export const clearQuizState = () => {
    quizStore.set({ 
        answers: {}, 
        lastResults: null,
        inProgress: false,
        currentStep: 0
    });
};

export default quizStore;
