import type { Question } from '../data/questions';
import { skillDetails, recommendations } from '../data/skillDetails';
import type { QuizResults } from '../stores/quizStore';

export interface SkillGroup {
  category: string;
  skills: Array<{ id: string; name: string; confirmed: boolean }>;
}

export function getStrengthsForTechnology(technology: string, results: QuizResults | null): string[] {
  if (!results || results.technology !== technology) return [];
  
  return Object.entries(results.skillScores)
    .filter(([_, score]) => score >= 2)
    .map(([skill]) => skill);
}

export function getStrengthsGroups(technology: string, results: QuizResults | null, questions: Question[]): SkillGroup[] {
  if (!results || results.technology !== technology) return [];
  
  const groups: SkillGroup[] = [];
  const skillsByCategory = new Map<string, Array<{ id: string; name: string; confirmed: boolean }>>();

  questions.forEach(question => {
    if (!skillsByCategory.has(question.category)) {
      skillsByCategory.set(question.category, []);
    }
    
    const score = results.skillScores[question.id] || 0;
    skillsByCategory.get(question.category)?.push({
      id: question.id,
      name: question.question,
      confirmed: score >= 2
    });
  });

  skillsByCategory.forEach((skills, category) => {
    // Добавляем группу только если в ней есть хотя бы один навык
    if (skills.length > 0) {
      groups.push({ category, skills });
    }
  });

  return groups;
}

export function getDetailedGapsGroups(technology: string, results: QuizResults | null, questions: Question[]): Array<{
  category: string;
  skills: Array<{
    name: string;
    recommendations: string[];
    currentLevel: number;
  }>;
  completed: number;
  total: number;
}> {
  if (!results || results.technology !== technology) return [];

  // Группируем вопросы по категориям
  const questionsByCategory = new Map<string, Question[]>();
  questions.forEach(question => {
    if (!questionsByCategory.has(question.category)) {
      questionsByCategory.set(question.category, []);
    }
    questionsByCategory.get(question.category)?.push(question);
  });

  const groups: Array<{
    category: string;
    skills: Array<{
      name: string;
      recommendations: string[];
      currentLevel: number;
    }>;
    completed: number;
    total: number;
  }> = [];

  // Обрабатываем каждую категорию
  questionsByCategory.forEach((categoryQuestions, category) => {
    const skills: Array<{
      name: string;
      recommendations: string[];
      currentLevel: number;
    }> = [];
    let completed = 0;
    const total = categoryQuestions.length;

    categoryQuestions.forEach(question => {
      const score = results.skillScores[question.id] || 0;
      // Show recommendations for skills that need improvement to reach the next level
      const nextLevelScore = score < 2 ? 2 : 4; // If current score < 2, aim for 2, otherwise aim for 4 (senior level)
      if (score < nextLevelScore) {
        const recs = recommendations[question.id]?.[score] || [];
        skills.push({
          name: question.question,
          recommendations: recs,
          currentLevel: score
        });
      }
      if (score > 0) {
        completed++;
      }
    });

    // Добавляем группу только если есть неосвоенные навыки
    if (skills.length > 0) {
      groups.push({
        category,
        skills,
        completed,
        total
      });
    }
  });

  return groups;
}

export function getSkillRecommendations(skillId: string, level: number): string[] {
  return recommendations[skillId]?.[level] || [];
}

export function getSkillDetails(skillId: string, level: number) {
  return skillDetails[skillId]?.[level];
}
