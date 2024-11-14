export interface LevelCriteria {
  required: string[];
  minScore: Record<string, number>;
}

export const levelCriteria: Record<string, LevelCriteria> = {
  junior: {
    required: ['components', 'hooks', 'state'],
    minScore: {
      components: 2,
      hooks: 2,
      state: 2,
      lifecycle: 1,
      performance: 1
    }
  },
  middle: {
    required: ['components', 'hooks', 'state', 'lifecycle', 'performance'],
    minScore: {
      components: 3,
      hooks: 3,
      state: 3,
      lifecycle: 2,
      performance: 2
    }
  }
};
