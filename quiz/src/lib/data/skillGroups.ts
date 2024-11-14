export interface SkillGroup {
  title: string;
  skills: string[];
  description: string;
  assessmentUrl: string;
  modes: ('self-assessment' | 'test')[];
}

export const skillGroups: Record<string, SkillGroup> = {
  react: {
    title: 'React Core',
    skills: ['components', 'lifecycle'],
    description: 'Component development, lifecycle, and core concepts',
    assessmentUrl: '/assess/react',
    modes: ['self-assessment', 'test']
  },
  typescript: {
    title: 'TypeScript',
    skills: [],
    description: 'Types, interfaces, and TypeScript best practices',
    assessmentUrl: '/assess/typescript',
    modes: ['self-assessment', 'test']
  },
  stateAndEffects: {
    title: 'State Management & Side Effects',
    skills: ['state', 'hooks', 'performance'],
    description: 'State management, hooks, and application architecture',
    assessmentUrl: '/assess/state-effects',
    modes: ['self-assessment', 'test']
  }
};
