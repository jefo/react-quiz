<script lang="ts">
  import { goto } from '$app/navigation';
  import { writable, type Writable } from 'svelte/store';
  import { AlertCircle, CheckCircle2, XCircle, AlertTriangle, ArrowRight, ArrowLeft, Clock, Award, Brain } from 'lucide-svelte';
  import quizStore, { saveAnswers, saveResults, updateProgress } from '$lib/stores/quiz';
  import { onMount } from 'svelte';

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
  const showWelcome = writable(!$quizStore.inProgress);
  const currentStep = writable($quizStore.currentStep);
  const answers: Writable<Answers> = writable($quizStore.answers);
  const showResults = writable($quizStore.lastResults !== null);
  const showConfirmation = writable(false);

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
      const newAnswers = {
        ...$answers,
        [currentQuestion.id]: value
      };
      $answers = newAnswers;
      saveAnswers(newAnswers);
      
      if ($currentStep < questionsValue.length - 1) {
        $currentStep++;
        updateProgress($currentStep);
      } else {
        $showConfirmation = true;
      }
    }
  }

  function skipQuestion() {
    if ($currentStep < questionsValue.length - 1) {
      $currentStep++;
      updateProgress($currentStep);
    } else {
      $showConfirmation = true;
    }
  }

  function goBack() {
    if ($currentStep > 0) {
      $currentStep--;
      updateProgress($currentStep);
    }
  }

  function startAssessment() {
    $showWelcome = false;
  }

  function confirmSubmission() {
    $showResults = true;
    $showConfirmation = false;
    const level = assessLevel();
    saveResults(level, $answers);
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

  // Subscribe to store changes to keep local state in sync
  quizStore.subscribe(state => {
    $currentStep = state.currentStep;
    $answers = state.answers;
    if (state.lastResults) {
      $showResults = true;
      $showWelcome = false;
    }
  });
</script>

<div class="fade-in">
  {#if $showWelcome}
    <div class="text-center space-y-8">
      <!-- Main heading -->
      <div class="space-y-4">
        <h1>Оцените свой уровень React разработчика</h1>
        <p class="text-xl text-gray-600">5 минут для анализа навыков и получения плана развития</p>
      </div>

      <!-- Process steps -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div class="card p-6 text-center">
          <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock class="w-6 h-6 text-primary" />
          </div>
          <h3>Быстрая оценка</h3>
          <p class="text-gray-600">5 минут на прохождение ключевых вопросов</p>
        </div>

        <div class="card p-6 text-center">
          <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain class="w-6 h-6 text-primary" />
          </div>
          <h3>Точный анализ</h3>
          <p class="text-gray-600">Оценка по 5 ключевым областям React</p>
        </div>

        <div class="card p-6 text-center">
          <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award class="w-6 h-6 text-primary" />
          </div>
          <h3>План развития</h3>
          <p class="text-gray-600">Персональные рекомендации для роста</p>
        </div>
      </div>

      <!-- Info block -->
      <div class="card max-w-2xl mx-auto p-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3>Что вы получите</h3>
            <ul class="space-y-3 text-left">
              <li class="flex items-center gap-2">
                <CheckCircle2 class="w-5 h-5 text-green-500 shrink-0" />
                <span>Оценку текущего уровня</span>
              </li>
              <li class="flex items-center gap-2">
                <CheckCircle2 class="w-5 h-5 text-green-500 shrink-0" />
                <span>Анализ сильных сторон</span>
              </li>
              <li class="flex items-center gap-2">
                <CheckCircle2 class="w-5 h-5 text-green-500 shrink-0" />
                <span>План развития навыков</span>
              </li>
            </ul>
          </div>
          <div>
            <h3>Детали оценки</h3>
            <ul class="space-y-3 text-left">
              <li class="flex items-center gap-2">
                <Clock class="w-5 h-5 text-primary shrink-0" />
                <span>5 минут на прохождение</span>
              </li>
              <li class="flex items-center gap-2">
                <AlertCircle class="w-5 h-5 text-primary shrink-0" />
                <span>5 ключевых вопросов</span>
              </li>
              <li class="flex items-center gap-2">
                <Brain class="w-5 h-5 text-primary shrink-0" />
                <span>Мгновенный результат</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- CTA Button -->
      <button
        on:click={startAssessment}
        class="btn btn-primary text-lg shadow-lg"
      >
        Начать оценку
        <ArrowRight class="w-5 h-5 ml-2" />
      </button>

      <!-- Social proof -->
      <div class="text-center text-gray-600">
        <p class="font-medium">Уже прошли оценку: 1,234 разработчика</p>
        <div class="flex justify-center gap-2 mt-2">
          <div class="w-8 h-8 rounded-full bg-gray-200"></div>
          <div class="w-8 h-8 rounded-full bg-gray-300"></div>
          <div class="w-8 h-8 rounded-full bg-gray-400"></div>
          <span class="text-sm leading-8">и другие</span>
        </div>
      </div>
    </div>

  {:else if !$showResults && !$showConfirmation}
    <!-- Quiz questions section -->
    <div class="card max-w-2xl mx-auto">
      <div class="p-6 space-y-6">
        <div class="mb-6">
          <!-- Progress bar -->
          <div class="progress-bar">
            <div 
              class="progress-bar-fill"
              style="width: {($currentStep / questionsValue.length) * 100}%"
            ></div>
          </div>
          <div class="flex justify-between items-center mt-2">
            <span class="text-sm text-gray-500">
              Вопрос {$currentStep + 1} из {questionsValue.length}
            </span>
            <button 
              on:click={skipQuestion}
              class="text-sm text-gray-500 hover:text-gray-700"
            >
              Пропустить
            </button>
          </div>
        </div>
        
        <h3 class="text-lg font-semibold mb-4">
          {questionsValue[$currentStep].question}
        </h3>
        
        <div class="space-y-3">
          {#each questionsValue[$currentStep].options as option}
            <button
              on:click={() => handleAnswer(option.value)}
              class="quiz-option w-full text-left rounded-lg border hover:border-primary"
            >
              {option.label}
            </button>
          {/each}
        </div>

        {#if $currentStep > 0}
          <button
            on:click={goBack}
            class="flex items-center gap-2 text-gray-600 hover:text-gray-800 mt-4"
          >
            <ArrowLeft class="w-4 h-4" />
            Назад
          </button>
        {/if}
      </div>
    </div>

  {:else if $showConfirmation}
    <!-- Confirmation section -->
    <div class="card max-w-2xl mx-auto">
      <div class="p-6 text-center space-y-6">
        <h3 class="text-xl font-semibold mb-4">Готовы увидеть результаты?</h3>
        <p class="text-gray-600 mb-6">
          Вы ответили на все вопросы. Нажмите "Подтвердить", чтобы увидеть свой уровень и получить план развития.
        </p>
        <div class="flex justify-center gap-4">
          <button
            on:click={goBack}
            class="btn border border-gray-200 hover:bg-gray-50"
          >
            Вернуться к вопросам
          </button>
          <button
            on:click={confirmSubmission}
            class="btn btn-primary"
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>

  {:else}
    <!-- Results section -->
    {@const level = $quizStore.lastResults?.level || assessLevel()}
    {@const nextLevel = level === 'below-junior' ? 'junior' : 'middle'}
    {@const gaps = getGaps(nextLevel)}

    <div class="card max-w-4xl mx-auto">
      <div class="p-8 space-y-8">
        <div>
          <h2>Результаты оценки</h2>
          <div class="flex items-center gap-2 text-lg">
            Текущий уровень: 
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
          <h3>
            Что нужно для уровня {nextLevel === 'junior' ? 'Junior' : 'Middle'}:
          </h3>
          
          {#each Object.entries(skillGroups) as [groupId, group]}
            {@const groupGaps = gaps.filter(gap => {
              const skillId = questionsValue.find(q => q.category === gap.skill)?.id;
              return group.skills.includes(skillId || '');
            })}

            <div class="card">
              <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h4 class="font-semibold text-lg mb-1">{group.title}</h4>
                    <p class="text-sm text-gray-600">{group.description}</p>
                  </div>
                  <a
                    href={group.assessmentUrl}
                    class="btn btn-primary text-sm"
                  >
                    Оценить навыки
                    <ArrowRight class="w-4 h-4 ml-2" />
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
                          Требуется: {gap.criteria}
                        </p>
                      </div>
                    {/each}
                  </div>
                {:else}
                  <div class="text-sm text-gray-600">
                    Пройдите оценку, чтобы определить уровень навыков в этой области
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        </div>

        <div class="space-y-4">
          <h3>Детальный анализ навыков:</h3>
          <div class="grid gap-3">
            {#each questionsValue as question}
              {@const score = $answers[question.id] || 0}
              {@const targetScore = levelCriteria[nextLevel].minScore[question.id as keyof typeof levelCriteria.junior.minScore]}
              
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span>{question.category}</span>
                <div class="flex items-center gap-2">
                  {#if score >= targetScore}
                    <CheckCircle2 class="w-5 h-5 text-green-500" />
                  {:else}
                    <XCircle class="w-5 h-5 text-red-500" />
                  {/if}
                  <span>
                    Уровень {score} / {targetScore}
                  </span>
                </div>
              </div>
            {/each}
          </div>
        </div>

        <div class="card bg-primary/5 p-6">
          <h3>Хотите быстрее повысить уровень?</h3>
          <p class="text-gray-600 mb-4">
            Получите персональные рекомендации и практикуйтесь с реальными интервью-вопросами.
            Наши менторы помогут вам эффективно закрыть пробелы в знаниях.
          </p>
          <button 
            class="btn btn-primary"
            on:click={() => goto('/mentoring')}
          >
            Получить детальный план развития
            <ArrowRight class="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
