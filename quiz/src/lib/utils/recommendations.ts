type SkillLevel = 'below-junior' | 'junior' | 'middle' | 'senior';

interface SkillCategory {
  icon: string;
  title: string;
  skills: string[];
}

// Матрица навыков соответствует структуре из чеклиста
const skillMatrix: Record<SkillLevel, SkillCategory[]> = {
  'junior': [
    {
      icon: '🎯',
      title: 'Core React',
      skills: [
        'Компоненты и JSX',
        'Базовые хуки',
        'Жизненный цикл компонентов',
        'Основы стилизации'
      ]
    },
    {
      icon: '📝',
      title: 'Forms',
      skills: [
        'Controlled Components',
        'Базовая валидация',
        'Обработка форм'
      ]
    },
    {
      icon: '🔄',
      title: 'State Management',
      skills: [
        'Локальное состояние (useState)',
        'useReducer',
        'Поднятие состояния',
        'Context API'
      ]
    },
    {
      icon: '🛣️',
      title: 'Routing',
      skills: [
        'Основы React Router',
        'Навигация',
        'Базовая защита маршрутов',
        'Работа с History API'
      ]
    },
    {
      icon: '🌐',
      title: 'Data Fetching',
      skills: [
        'Основы HTTP запросов',
        'Управление состоянием загрузки',
        'useEffect для запросов',
        'Базовая обработка форм'
      ]
    },
    {
      icon: '🏗️',
      title: 'Architecture',
      skills: [
        'Компонентная архитектура',
        'Структура проекта',
        'Clean Code',
        'Базовые архитектурные решения'
      ]
    }
  ],
  'middle': [
    {
      icon: '🎯',
      title: 'Core React',
      skills: [
        'Продвинутые хуки',
        'Паттерны композиции',
        'Работа с DOM',
        'Обработка ошибок'
      ]
    },
    {
      icon: '📝',
      title: 'Forms',
      skills: [
        'Продвинутые формы',
        'Продвинутая валидация',
        'Динамические формы'
      ]
    },
    {
      icon: '🔄',
      title: 'State Management',
      skills: [
        'Продвинутая работа с Context',
        'Redux Основы',
        'Альтернативные решения',
        'Работа с формами'
      ]
    },
    {
      icon: '🛣️',
      title: 'Routing',
      skills: [
        'Продвинутая маршрутизация',
        'Оптимизация',
        'Guards и Middleware',
        'Интеграция с состоянием'
      ]
    },
    {
      icon: '🌐',
      title: 'Data Fetching',
      skills: [
        'Продвинутая работа с React Query/SWR',
        'GraphQL основы',
        'Продвинутая обработка ошибок',
        'Кеширование и оптимизация'
      ]
    },
    {
      icon: '🏗️',
      title: 'Architecture',
      skills: [
        'SOLID Принципы',
        'Архитектурные паттерны',
        'Модульная архитектура',
        'Design System'
      ]
    }
  ],
  'senior': [
    {
      icon: '🎯',
      title: 'Core React',
      skills: [
        'Собственные хуки',
        'Архитектура компонентов',
        'Интеграция с DOM',
        'Concurrent Mode и Suspense'
      ]
    },
    {
      icon: '📝',
      title: 'Forms',
      skills: [
        'Архитектура форм',
        'Оптимизация',
        'Продвинутые библиотеки'
      ]
    },
    {
      icon: '🔄',
      title: 'State Management',
      skills: [
        'Архитектура состояния',
        'Продвинутый Redux',
        'State Machines',
        'Синхронизация состояния'
      ]
    },
    {
      icon: '🛣️',
      title: 'Routing',
      skills: [
        'Server-Side Routing',
        'Сложные сценарии',
        'Кастомные решения',
        'Интернационализация'
      ]
    },
    {
      icon: '🌐',
      title: 'Data Fetching',
      skills: [
        'Архитектура данных',
        'Продвинутый GraphQL',
        'Real-time интеграции',
        'Производительность и масштабирование'
      ]
    },
    {
      icon: '🏗️',
      title: 'Architecture',
      skills: [
        'Enterprise Architecture',
        'Performance Patterns',
        'Advanced Patterns',
        'Quality Architecture'
      ]
    }
  ],
  'below-junior': [] // Этот уровень не содержит рекомендаций, так как для него показываются навыки junior уровня
};

const nextLevelMap: Record<SkillLevel, SkillLevel> = {
  'below-junior': 'junior',
  'junior': 'middle',
  'middle': 'senior',
  'senior': 'senior'
};

export function getSkillRecommendations(currentLevel: SkillLevel): SkillCategory[] {
  const targetLevel = nextLevelMap[currentLevel];
  return skillMatrix[targetLevel];
}
