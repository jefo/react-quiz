export function formatLevel(level: string): string {
  const levelMap = {
    'below-junior': 'Beginner',
    'junior': 'Junior Developer',
    'middle': 'Middle Developer',
    'senior': 'Senior Developer',
    'self-assessed': 'Self-Assessed'
  };
  return levelMap[level as keyof typeof levelMap] || level;
}

export function getLevelDescription(level: string): string {
  const descriptions = {
    'below-junior': 'You are at the beginning of your journey. Focus on learning the fundamentals.',
    'junior': 'You have a good foundation. Keep practicing and learning new concepts.',
    'middle': 'You have solid experience. Focus on advanced patterns and best practices.',
    'senior': 'You have extensive knowledge. Consider mentoring others and diving into architecture.',
    'self-assessed': 'Based on your self-assessment, you can now view your learning path.'
  };
  return descriptions[level as keyof typeof descriptions] || 'Keep learning and improving your skills.';
}

export function getSkillLevel(score: number): string {
  switch(score) {
    case 3: return "Продвинутый";
    case 2: return "Средний";
    case 1: return "Начальный";
    default: return "Не освоен";
  }
}

export function calculateProgress(skillScores: Record<string, number> | undefined): number {
  if (!skillScores) return 0;
  
  const scores = Object.values(skillScores);
  if (scores.length === 0) return 0;
  
  const totalScore = scores.reduce((sum, score) => sum + score, 0);
  const maxPossibleScore = scores.length * 3; // Maximum score is 3 to match the questions scale
  
  return Math.round((totalScore / maxPossibleScore) * 100);
}
