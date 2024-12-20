export interface LevelCriteria {
  required: string[];
  minScore: Record<string, number>;
}

export const levelCriteria: Record<string, LevelCriteria> = {
  'below-junior': {  
    required: ['components'],
    minScore: {
      components: 1,
      hooks: 0,
      state: 0,
      lifecycle: 0,
      performance: 0
    }
  },
  junior: {
    required: ['components', 'hooks', 'state'],
    minScore: {
      components: 1,
      hooks: 1,
      state: 1,
      lifecycle: 1,
      performance: 1
    }
  },
  middle: {
    required: ['components', 'hooks', 'state', 'lifecycle', 'performance'],
    minScore: {
      components: 2,
      hooks: 2,
      state: 2,
      lifecycle: 2,
      performance: 2
    }
  },
  senior: {
    required: ['components', 'hooks', 'state', 'lifecycle', 'performance'],
    minScore: {
      components: 3,
      hooks: 3,
      state: 3,
      lifecycle: 3,
      performance: 3
    }
  }
};
