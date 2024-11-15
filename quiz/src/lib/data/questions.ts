export interface Option {
  label: string;
  value: number;
  criteria: string;
}

export interface Question {
  id: string;
  category: string;
  question: string;
  options: Option[];
}

export const questions: Question[] = [
  {
    id: 'components',
    category: 'Component Development',
    question: 'How do you work with React components?',
    options: [
      {
        label: "I can create basic functional components",
        value: 1,
        criteria: "Basic component creation"
      },
      {
        label: "I understand props and component composition",
        value: 2,
        criteria: "Props and composition"
      },
      {
        label: "I implement complex components with proper patterns",
        value: 3,
        criteria: "Advanced patterns"
      }
    ]
  },
  {
    id: 'hooks',
    category: 'Hooks Usage',
    question: 'How comfortable are you with React Hooks?',
    options: [
      {
        label: "I can use basic hooks like useState and useEffect",
        value: 1,
        criteria: "Basic hooks usage"
      },
      {
        label: "I understand and use most built-in hooks effectively",
        value: 2,
        criteria: "Intermediate hooks knowledge"
      },
      {
        label: "I create custom hooks and optimize hook usage",
        value: 3,
        criteria: "Advanced hooks mastery"
      }
    ]
  },
  {
    id: 'state',
    category: 'State Management',
    question: 'How do you handle state management?',
    options: [
      {
        label: "I can manage component-level state",
        value: 1,
        criteria: "Local state management"
      },
      {
        label: "I use context and can manage app-wide state",
        value: 2,
        criteria: "Global state handling"
      },
      {
        label: "I implement complex state management solutions",
        value: 3,
        criteria: "Advanced state patterns"
      }
    ]
  },
  {
    id: 'lifecycle',
    category: 'Component Lifecycle',
    question: 'How well do you understand component lifecycle?',
    options: [
      {
        label: "I understand basic mounting and unmounting",
        value: 1,
        criteria: "Basic lifecycle knowledge"
      },
      {
        label: "I can handle complex lifecycle scenarios",
        value: 2,
        criteria: "Advanced lifecycle management"
      },
      {
        label: "I optimize lifecycle for performance",
        value: 3,
        criteria: "Lifecycle optimization"
      }
    ]
  },
  {
    id: 'performance',
    category: 'Performance Optimization',
    question: 'How do you handle React performance?',
    options: [
      {
        label: "I understand basic optimization techniques",
        value: 1,
        criteria: "Basic optimization"
      },
      {
        label: "I implement common optimization patterns",
        value: 2,
        criteria: "Intermediate optimization"
      },
      {
        label: "I use advanced optimization strategies",
        value: 3,
        criteria: "Advanced optimization"
      }
    ]
  },
  {
    id: 'routing',
    category: 'Routing & Navigation',
    question: 'How do you handle routing in React applications?',
    options: [
      {
        label: "I can implement basic routes and navigation",
        value: 1,
        criteria: "Basic routing"
      },
      {
        label: "I work with nested routes and route parameters",
        value: 2,
        criteria: "Advanced routing"
      },
      {
        label: "I implement complex routing patterns and optimizations",
        value: 3,
        criteria: "Expert routing"
      }
    ]
  },
  {
    id: 'data-fetching',
    category: 'Data Fetching',
    question: 'How do you handle data fetching and API integration?',
    options: [
      {
        label: "I can make basic API calls and handle responses",
        value: 1,
        criteria: "Basic data fetching"
      },
      {
        label: "I implement data caching and error handling",
        value: 2,
        criteria: "Intermediate data management"
      },
      {
        label: "I build robust data fetching architectures",
        value: 3,
        criteria: "Advanced data patterns"
      }
    ]
  },
  {
    id: 'performance',
    category: 'Performance',
    question: 'How do you optimize React application performance?',
    options: [
      {
        label: "I understand basic React performance concepts",
        value: 1,
        criteria: "Basic optimization"
      },
      {
        label: "I implement common optimization techniques",
        value: 2,
        criteria: "Performance tools usage"
      },
      {
        label: "I conduct advanced performance optimization",
        value: 3,
        criteria: "Expert optimization"
      }
    ]
  },
  {
    id: 'testing',
    category: 'Testing',
    question: 'How do you approach testing React applications?',
    options: [
      {
        label: "I can write basic component tests",
        value: 1,
        criteria: "Basic testing"
      },
      {
        label: "I implement integration tests and testing patterns",
        value: 2,
        criteria: "Advanced testing"
      },
      {
        label: "I create comprehensive test strategies",
        value: 3,
        criteria: "Testing architecture"
      }
    ]
  }
];
