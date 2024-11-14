export interface Question {
    id: string;
    category: string;
    question: string;
    options: {
        label: string;
        value: number;
    }[];
}

export const questions: Question[] = [
    {
        id: 'basic-types',
        category: 'Базовые типы',
        question: 'Как в TypeScript определить тип переменной, которая может быть строкой или числом?',
        options: [
            { label: 'string | number', value: 3 },
            { label: 'string && number', value: 0 },
            { label: 'string + number', value: 0 },
            { label: 'any', value: 1 }
        ]
    },
    {
        id: 'interfaces',
        category: 'Интерфейсы',
        question: 'Какое ключевое слово используется для определения интерфейса в TypeScript?',
        options: [
            { label: 'type', value: 1 },
            { label: 'interface', value: 3 },
            { label: 'class', value: 0 },
            { label: 'struct', value: 0 }
        ]
    },
    {
        id: 'generics',
        category: 'Дженерики',
        question: 'Как правильно объявить дженерик-функцию в TypeScript?',
        options: [
            { label: 'function example<T>(arg: T): T', value: 3 },
            { label: 'function example[T](arg: T): T', value: 0 },
            { label: 'function example(T)(arg: T): T', value: 0 },
            { label: 'function example(arg: any): any', value: 1 }
        ]
    },
    {
        id: 'type-inference',
        category: 'Вывод типов',
        question: 'Что такое type inference в TypeScript?',
        options: [
            { label: 'Автоматическое определение типов на основе значений', value: 3 },
            { label: 'Ручное указание типов', value: 0 },
            { label: 'Преобразование типов', value: 1 },
            { label: 'Проверка типов во время выполнения', value: 0 }
        ]
    },
    {
        id: 'advanced-types',
        category: 'Продвинутые типы',
        question: 'Что такое mapped types в TypeScript?',
        options: [
            { label: 'Преобразование одного типа в другой', value: 1 },
            { label: 'Создание нового типа на основе существующего', value: 3 },
            { label: 'Объединение типов', value: 0 },
            { label: 'Пересечение типов', value: 0 }
        ]
    }
];

export const levelCriteria = {
    junior: {
        minScore: {
            'basic-types': 2,
            'interfaces': 2,
            'generics': 1,
            'type-inference': 1,
            'advanced-types': 0
        }
    },
    middle: {
        minScore: {
            'basic-types': 3,
            'interfaces': 3,
            'generics': 2,
            'type-inference': 2,
            'advanced-types': 1
        }
    },
    senior: {
        minScore: {
            'basic-types': 3,
            'interfaces': 3,
            'generics': 3,
            'type-inference': 3,
            'advanced-types': 2
        }
    }
};
