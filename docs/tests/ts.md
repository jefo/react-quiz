```ts
interface TypeScriptAssessment {
  id: 'typescript-core';
  questions: [
    {
      id: 'basic-types',
      category: 'Basic Types & Syntax',
      question: 'How well do you understand TypeScript basic types and syntax?',
      options: [
        {
          label: "I can use basic types (string, number, boolean)",
          value: 1,
          criteria: "Basic type declarations"
        },
        {
          label: "I understand type inference and unions/intersections",
          value: 2,
          criteria: "Type inference and combinations"
        },
        {
          label: "I effectively use advanced type features and type guards",
          value: 3,
          criteria: "Advanced type manipulation"
        }
      ]
    },
    {
      id: 'interfaces-types',
      category: 'Interfaces & Custom Types',
      question: 'How do you work with interfaces and custom types?',
      options: [
        {
          label: "I can create basic interfaces for objects",
          value: 1,
          criteria: "Basic interfaces"
        },
        {
          label: "I use extends, implements, and type aliases",
          value: 2,
          criteria: "Interface inheritance and implementation"
        },
        {
          label: "I create complex type systems with advanced features",
          value: 3,
          criteria: "Advanced type architecture"
        }
      ]
    },
    {
      id: 'generics',
      category: 'Generics',
      question: 'Assess your experience with TypeScript generics:',
      options: [
        {
          label: "I understand basic generic syntax <T>",
          value: 1,
          criteria: "Basic generics usage"
        },
        {
          label: "I use constraints and multiple type parameters",
          value: 2,
          criteria: "Generic constraints and combinations"
        },
        {
          label: "I implement complex generic patterns and utilities",
          value: 3,
          criteria: "Advanced generic patterns"
        }
      ]
    },
    {
      id: 'type-manipulation',
      category: 'Advanced Type Manipulation',
      question: 'How do you handle advanced type manipulations?',
      options: [
        {
          label: "I use basic utility types (Partial, Pick, etc.)",
          value: 1,
          criteria: "Basic utility types"
        },
        {
          label: "I create mapped types and conditional types",
          value: 2,
          criteria: "Custom type transformations"
        },
        {
          label: "I implement complex type inference and manipulation",
          value: 3,
          criteria: "Advanced type system features"
        }
      ]
    },
    {
      id: 'declarations',
      category: 'Type Declarations',
      question: 'How do you work with type declarations and modules?',
      options: [
        {
          label: "I can use existing type declarations",
          value: 1,
          criteria: "Using type definitions"
        },
        {
          label: "I create declaration files for my code",
          value: 2,
          criteria: "Writing declarations"
        },
        {
          label: "I maintain complex declaration files and module types",
          value: 3,
          criteria: "Advanced declaration management"
        }
      ]
    }
  ];

  levelCriteria: {
    junior: {
      required: ['basic-types', 'interfaces-types'],
      minScore: {
        'basic-types': 2,
        'interfaces-types': 2,
        'generics': 1,
        'type-manipulation': 1,
        'declarations': 1
      }
    },
    middle: {
      required: ['basic-types', 'interfaces-types', 'generics', 'type-manipulation'],
      minScore: {
        'basic-types': 3,
        'interfaces-types': 3,
        'generics': 2,
        'type-manipulation': 2,
        'declarations': 2
      }
    }
  };

  skillGroups: {
    fundamentals: {
      title: 'TypeScript Fundamentals',
      skills: ['basic-types', 'interfaces-types'],
      description: 'Basic types, interfaces, and core concepts',
      assessmentUrl: '/assess/typescript/fundamentals'
    },
    advanced: {
      title: 'Advanced TypeScript',
      skills: ['generics', 'type-manipulation'],
      description: 'Generic types, type manipulation, and advanced patterns',
      assessmentUrl: '/assess/typescript/advanced'
    },
    practical: {
      title: 'Practical TypeScript',
      skills: ['declarations'],
      description: 'Working with declarations, modules, and real-world patterns',
      assessmentUrl: '/assess/typescript/practical'
    }
  };
}

```