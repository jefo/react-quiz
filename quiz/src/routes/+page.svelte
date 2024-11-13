<script lang="ts">
  import { goto } from '$app/navigation';
  import { writable, type Writable } from 'svelte/store';
  import { AlertCircle, CheckCircle2, XCircle, AlertTriangle, ArrowRight } from 'lucide-svelte';

  interface Option {
    label: string;
    value: number;
    criteria: string;
  }

  interface Question {
    id: string;
    category: string;
    question: string;
    options: Option[];
  }

  interface SkillGroup {
    title: string;
    skills: string[];
    description: string;
    assessmentUrl: string;
  }

  interface Answers {
    [key: string]: number;
  }

  // Stores
  const currentStep = writable(0);
  const answers: Writable<Answers> = writable({});
  const showResults = writable(false);

  // Skill groups definition
  const skillGroups: Record<string, SkillGroup> = {
    react: {
      title: 'React Core',
      skills: ['components', 'lifecycle'],
      description: 'Component development, lifecycle, and core concepts',
      assessmentUrl: '/assess/react'
    },
    typescript: {
      title: 'TypeScript',
      skills: [],
      description: 'Types, interfaces, and TypeScript best practices',
      assessmentUrl: '/assess/typescript'
    },
    stateAndEffects: {
      title: 'State Management & Side Effects',
      skills: ['state', 'hooks', 'performance'],
      description: 'State management, hooks, and application architecture',
      assessmentUrl: '/assess/state-effects'
    }
  };

  const questions: Writable<Question[]> = writable([
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
    }
  ]);

  const levelCriteria = {
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
  } as const;

  let questionsValue: Question[] = [];
  questions.subscribe(value => {
    questionsValue = value;
  });

  function handleAnswer(value: number) {
    const currentQuestion = questionsValue[$currentStep];
    if (currentQuestion) {
      $answers = {
        ...$answers,
        [currentQuestion.id]: value
      };
      
      if ($currentStep < questionsValue.length - 1) {
        $currentStep++;
      } else {
        $showResults = true;
      }
    }
  }

  type Level = 'junior' | 'middle' | 'below-junior';

  function assessLevel(): Level {
    const middleCheck = Object.entries(levelCriteria.middle.minScore).every(
      ([skill, requiredScore]) => ($answers[skill] || 0) >= requiredScore
    );
    
    if (middleCheck) return 'middle';

    const juniorCheck = Object.entries(levelCriteria.junior.minScore).every(
      ([skill, requiredScore]) => ($answers[skill] || 0) >= requiredScore
    );
    
    if (juniorCheck) return 'junior';

    return 'below-junior';
  }

  interface Gap {
    skill: string;
    current: number;
    required: number;
    criteria: string;
  }

  function getGaps(targetLevel: 'junior' | 'middle'): Gap[] {
    const criteria = levelCriteria[targetLevel];
    const gaps: Gap[] = [];

    Object.entries(criteria.minScore).forEach(([skillId, requiredScore]) => {
      const currentScore = $answers[skillId] || 0;
      if (currentScore < requiredScore) {
        const question = questionsValue.find(q => q.id === skillId);
        if (question) {
          gaps.push({
            skill: question.category,
            current: currentScore,
            required: requiredScore,
            criteria: question.options[requiredScore - 1]?.criteria || 'Improve skill level'
          });
        }
      }
    });

    return gaps;
  }
</script>

<div class="max-w-2xl mx-auto p-4">
  <div class="card p-6">
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">React Developer Level Assessment</h2>
      
      {#if !$showResults}
        <div class="space-y-6">
          <div class="mb-4">
            <span class="text-sm text-gray-500">
              Question {$currentStep + 1} of {questionsValue.length}
            </span>
          </div>
          
          <h3 class="text-lg font-semibold mb-4">
            {questionsValue[$currentStep].question}
          </h3>
          
          <div class="space-y-3">
            {#each questionsValue[$currentStep].options as option}
              <button
                on:click={() => handleAnswer(option.value)}
                class="w-full text-left p-4 border rounded hover:bg-gray-50 transition-colors"
              >
                {option.label}
              </button>
            {/each}
          </div>
        </div>

      {:else}
        {@const level = assessLevel()}
        {@const nextLevel = level === 'below-junior' ? 'junior' : 'middle'}
        {@const gaps = getGaps(nextLevel)}

        <div class="space-y-6">
          <div class="mb-8">
            <h3 class="text-xl font-semibold mb-2">Your Assessment Results</h3>
            <div class="flex items-center gap-2 text-lg">
              Current level: 
              <span class="font-semibold">
                {#if level === 'middle'}
                  Middle Developer
                {:else if level === 'junior'}
                  Junior Developer
                {:else}
                  Beginner
                {/if}
              </span>
            </div>
          </div>

          <div class="space-y-6">
            <h4 class="font-semibold">
              Gaps to reach {nextLevel === 'junior' ? 'Junior' : 'Middle'} level:
            </h4>
            
            {#each Object.entries(skillGroups) as [groupId, group]}
              {@const groupGaps = gaps.filter(gap => {
                const skillId = questionsValue.find(q => q.category === gap.skill)?.id;
                return group.skills.includes(skillId || '');
              })}

              <div class="card">
                <div class="p-6">
                  <div class="flex justify-between items-start mb-4">
                    <div>
                      <h3 class="font-semibold text-lg mb-1">{group.title}</h3>
                      <p class="text-sm text-gray-600">{group.description}</p>
                    </div>
                    <a
                      href={group.assessmentUrl}
                      class="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                    >
                      Assess Skills
                      <ArrowRight class="w-4 h-4" />
                    </a>
                  </div>

                  {#if groupGaps.length > 0}
                    <div class="space-y-3">
                      {#each groupGaps as gap}
                        <div class="border-l-4 border-yellow-500 pl-4 py-2">
                          <div class="flex items-center gap-2">
                            <AlertTriangle class="w-5 h-5 text-yellow-500" />
                            <span class="font-semibold">{gap.skill}</span>
                          </div>
                          <p class="text-sm text-gray-600 mt-1">
                            Required: {gap.criteria}
                          </p>
                        </div>
                      {/each}
                    </div>
                  {:else}
                    <div class="text-sm text-gray-600">
                      Take an assessment to evaluate your skills in this area
                    </div>
                  {/if}
                </div>
              </div>
            {/each}
          </div>

          <div class="mt-8 space-y-4">
            <h4 class="font-semibold">Overall Skill Breakdown:</h4>
            {#each questionsValue as question}
              {@const score = $answers[question.id] || 0}
              {@const targetScore = levelCriteria[nextLevel].minScore[question.id as keyof typeof levelCriteria.junior.minScore]}
              
              <div class="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span>{question.category}</span>
                <div class="flex items-center gap-2">
                  {#if score >= targetScore}
                    <CheckCircle2 class="w-5 h-5 text-green-500" />
                  {:else}
                    <XCircle class="w-5 h-5 text-red-500" />
                  {/if}
                  <span>
                    Level {score} / {targetScore}
                  </span>
                </div>
              </div>
            {/each}
          </div>

          <div class="bg-blue-50 p-4 rounded-lg mt-6">
            <h3 class="font-semibold mb-2">Want to improve faster?</h3>
            <p class="text-sm text-blue-800 mb-4">
              Get personalized guidance and practice with real interview questions. 
              Our mentors will help you close these gaps effectively.
            </p>
            <button 
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              on:click={() => goto('/mentoring')}
            >
              Schedule Mentoring Session
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
