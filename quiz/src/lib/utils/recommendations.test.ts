import { test, expect, describe } from "bun:test";
import { getSkillRecommendations } from './recommendations';

describe('Skill Recommendations', () => {
  describe('Core React recommendations', () => {
    test('should recommend junior level skills for below-junior developer', () => {
      const recommendations = getSkillRecommendations('below-junior');
      const coreReactSkills = recommendations.find(category => category.title === 'Core React')?.skills;
      
      const expectedSkills = [
        'Компоненты и JSX',
        'Базовые хуки',
        'Жизненный цикл компонентов',
        'Основы стилизации'
      ];

      expect(coreReactSkills).toEqual(expectedSkills);
    });

    test('should recommend middle level skills for junior developer', () => {
      const recommendations = getSkillRecommendations('junior');
      const coreReactSkills = recommendations.find(category => category.title === 'Core React')?.skills;
      
      const expectedSkills = [
        'Продвинутые хуки',
        'Паттерны композиции',
        'Работа с DOM',
        'Обработка ошибок'
      ];

      expect(coreReactSkills).toEqual(expectedSkills);
    });

    test('should recommend senior level skills for middle developer', () => {
      const recommendations = getSkillRecommendations('middle');
      const coreReactSkills = recommendations.find(category => category.title === 'Core React')?.skills;
      
      const expectedSkills = [
        'Собственные хуки',
        'Архитектура компонентов',
        'Интеграция с DOM',
        'Concurrent Mode и Suspense'
      ];

      expect(coreReactSkills).toEqual(expectedSkills);
    });
  });

  describe('Forms recommendations', () => {
    test('should recommend junior level form skills for below-junior developer', () => {
      const recommendations = getSkillRecommendations('below-junior');
      const formSkills = recommendations.find(category => category.title === 'Forms')?.skills;
      
      const expectedSkills = [
        'Controlled Components',
        'Базовая валидация',
        'Обработка форм'
      ];

      expect(formSkills).toEqual(expectedSkills);
    });

    test('should recommend middle level form skills for junior developer', () => {
      const recommendations = getSkillRecommendations('junior');
      const formSkills = recommendations.find(category => category.title === 'Forms')?.skills;
      
      const expectedSkills = [
        'Продвинутые формы',
        'Продвинутая валидация',
        'Динамические формы'
      ];

      expect(formSkills).toEqual(expectedSkills);
    });

    test('should recommend senior level form skills for middle developer', () => {
      const recommendations = getSkillRecommendations('middle');
      const formSkills = recommendations.find(category => category.title === 'Forms')?.skills;
      
      const expectedSkills = [
        'Архитектура форм',
        'Оптимизация',
        'Продвинутые библиотеки'
      ];

      expect(formSkills).toEqual(expectedSkills);
    });
  });

  describe('State Management recommendations', () => {
    test('should recommend junior level state management skills for below-junior developer', () => {
      const recommendations = getSkillRecommendations('below-junior');
      const stateSkills = recommendations.find(category => category.title === 'State Management')?.skills;
      
      const expectedSkills = [
        'Локальное состояние (useState)',
        'useReducer',
        'Поднятие состояния',
        'Context API'
      ];

      expect(stateSkills).toEqual(expectedSkills);
    });

    test('should recommend middle level state management skills for junior developer', () => {
      const recommendations = getSkillRecommendations('junior');
      const stateSkills = recommendations.find(category => category.title === 'State Management')?.skills;
      
      const expectedSkills = [
        'Продвинутая работа с Context',
        'Redux Основы',
        'Альтернативные решения',
        'Работа с формами'
      ];

      expect(stateSkills).toEqual(expectedSkills);
    });

    test('should recommend senior level state management skills for middle developer', () => {
      const recommendations = getSkillRecommendations('middle');
      const stateSkills = recommendations.find(category => category.title === 'State Management')?.skills;
      
      const expectedSkills = [
        'Архитектура состояния',
        'Продвинутый Redux',
        'State Machines',
        'Синхронизация состояния'
      ];

      expect(stateSkills).toEqual(expectedSkills);
    });
  });

  describe('Routing recommendations', () => {
    test('should recommend junior level routing skills for below-junior developer', () => {
      const recommendations = getSkillRecommendations('below-junior');
      const routingSkills = recommendations.find(category => category.title === 'Routing')?.skills;
      
      const expectedSkills = [
        'Основы React Router',
        'Навигация',
        'Базовая защита маршрутов',
        'Работа с History API'
      ];

      expect(routingSkills).toEqual(expectedSkills);
    });

    test('should recommend middle level routing skills for junior developer', () => {
      const recommendations = getSkillRecommendations('junior');
      const routingSkills = recommendations.find(category => category.title === 'Routing')?.skills;
      
      const expectedSkills = [
        'Продвинутая маршрутизация',
        'Оптимизация',
        'Guards и Middleware',
        'Интеграция с состоянием'
      ];

      expect(routingSkills).toEqual(expectedSkills);
    });

    test('should recommend senior level routing skills for middle developer', () => {
      const recommendations = getSkillRecommendations('middle');
      const routingSkills = recommendations.find(category => category.title === 'Routing')?.skills;
      
      const expectedSkills = [
        'Server-Side Routing',
        'Сложные сценарии',
        'Кастомные решения',
        'Интернационализация'
      ];

      expect(routingSkills).toEqual(expectedSkills);
    });
  });

  describe('Data Fetching recommendations', () => {
    test('should recommend junior level data fetching skills for below-junior developer', () => {
      const recommendations = getSkillRecommendations('below-junior');
      const dataSkills = recommendations.find(category => category.title === 'Data Fetching')?.skills;
      
      const expectedSkills = [
        'Основы HTTP запросов',
        'Управление состоянием загрузки',
        'useEffect для запросов',
        'Базовая обработка форм'
      ];

      expect(dataSkills).toEqual(expectedSkills);
    });

    test('should recommend middle level data fetching skills for junior developer', () => {
      const recommendations = getSkillRecommendations('junior');
      const dataSkills = recommendations.find(category => category.title === 'Data Fetching')?.skills;
      
      const expectedSkills = [
        'Продвинутая работа с React Query/SWR',
        'GraphQL основы',
        'Продвинутая обработка ошибок',
        'Кеширование и оптимизация'
      ];

      expect(dataSkills).toEqual(expectedSkills);
    });

    test('should recommend senior level data fetching skills for middle developer', () => {
      const recommendations = getSkillRecommendations('middle');
      const dataSkills = recommendations.find(category => category.title === 'Data Fetching')?.skills;
      
      const expectedSkills = [
        'Архитектура данных',
        'Продвинутый GraphQL',
        'Real-time интеграции',
        'Производительность и масштабирование'
      ];

      expect(dataSkills).toEqual(expectedSkills);
    });
  });

  describe('Architecture recommendations', () => {
    test('should recommend junior level architecture skills for below-junior developer', () => {
      const recommendations = getSkillRecommendations('below-junior');
      const archSkills = recommendations.find(category => category.title === 'Architecture')?.skills;
      
      const expectedSkills = [
        'Компонентная архитектура',
        'Структура проекта',
        'Clean Code',
        'Базовые архитектурные решения'
      ];

      expect(archSkills).toEqual(expectedSkills);
    });

    test('should recommend middle level architecture skills for junior developer', () => {
      const recommendations = getSkillRecommendations('junior');
      const archSkills = recommendations.find(category => category.title === 'Architecture')?.skills;
      
      const expectedSkills = [
        'SOLID Принципы',
        'Архитектурные паттерны',
        'Модульная архитектура',
        'Design System'
      ];

      expect(archSkills).toEqual(expectedSkills);
    });

    test('should recommend senior level architecture skills for middle developer', () => {
      const recommendations = getSkillRecommendations('middle');
      const archSkills = recommendations.find(category => category.title === 'Architecture')?.skills;
      
      const expectedSkills = [
        'Enterprise Architecture',
        'Performance Patterns',
        'Advanced Patterns',
        'Quality Architecture'
      ];

      expect(archSkills).toEqual(expectedSkills);
    });
  });
});
