<script lang="ts">
  import { ArrowLeft, Clock, AlertCircle, Brain, CheckCircle2, XCircle } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import quizStore, { startQuiz, updateProgress, saveAnswers, saveResults } from '$lib/stores/quiz';
  import { questions, levelCriteria } from '$lib/data/typescript';

  const mode = $page.url.searchParams.get('mode') || 'test';
  let currentQuestion = questions[$quizStore.currentStep];
  let selectedAnswer: number | null = null;

  $: {
    currentQuestion = questions[$quizStore.currentStep];
    selectedAnswer = $quizStore.answers[currentQuestion?.id] ?? null;
  }

  const handleAnswer = (value: number) => {
    const newAnswers = { ...$quizStore.answers, [currentQuestion.id]: value };
    saveAnswers(newAnswers);

    if ($quizStore.currentStep < questions.length - 1) {
      updateProgress($quizStore.currentStep + 1);
    } else {
      // Calculate level based on answers
      const skillScores = Object.entries(newAnswers).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, number>);

      let level = mode === 'self-assessment' ? 'self-assessed' : calculateLevel(skillScores);
      
      saveResults({
        level,
        scores: skillScores,
        mode,
        technology: 'typescript'
      });

      goto('/');
    }
  };

  function calculateLevel(scores: Record<string, number>) {
    let level = 'below-junior';  // Changed from 'beginner' to 'below-junior' to match levelMap keys
    
    const juniorRequirements = Object.entries(levelCriteria.junior.minScore)
      .every(([key, required]) => (scores[key] || 0) >= required);
    const middleRequirements = Object.entries(levelCriteria.middle.minScore)
      .every(([key, required]) => (scores[key] || 0) >= required);
    const seniorRequirements = Object.entries(levelCriteria.senior.minScore)
      .every(([key, required]) => (scores[key] || 0) >= required);

    if (seniorRequirements) level = 'senior';
    else if (middleRequirements) level = 'middle';
    else if (juniorRequirements) level = 'junior';
    
    return level;
  }

  const skipQuestion = () => {
    if ($quizStore.currentStep < questions.length - 1) {
      updateProgress($quizStore.currentStep + 1);
    }
  };

  const goBack = () => {
    if ($quizStore.currentStep > 0) {
      updateProgress($quizStore.currentStep - 1);
    }
  };
</script>

<style lang="postcss">
  .progress-bar {
    @apply w-full h-2.5 bg-primary-100 rounded-full overflow-hidden;
  }
  
  .progress-bar-fill {
    @apply h-full bg-primary transition-all duration-300 ease-out;
    animation: pulse 2s infinite;
  }

  .quiz-option {
    @apply p-4 transition-all duration-200 bg-white border border-gray-200;
    @apply hover:bg-primary-50 hover:border-primary-200 hover:shadow-sm;
    @apply active:scale-[0.99] active:bg-primary-100;
  }

  .quiz-option.selected {
    @apply border-primary-400 bg-primary-50 shadow-sm;
    @apply hover:bg-primary-100;
  }

  @keyframes pulse {
    0% { opacity: 0.8; }
    50% { opacity: 1; }
    100% { opacity: 0.8; }
  }
</style>

<div class="max-w-4xl mx-auto p-4 md:p-8">
  <div class="mb-8">
    <button 
      on:click={() => goto('/')} 
      class="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
    >
      <ArrowLeft class="w-5 h-5 mr-2" />
      {$quizStore.lastResults ? 'Вернуться к результатам' : 'На главную'}
    </button>
  </div>

  <div class="card bg-white shadow-sm rounded-lg p-6 md:p-8">
    {#if !$quizStore.inProgress}
      <h1>{mode === 'self-assessment' ? 'TypeScript Self Assessment' : 'TypeScript Knowledge Test'}</h1>
      <p class="text-xl text-gray-600 mb-8">
        {mode === 'self-assessment' ? 'Оценка навыков типизации и работы с TypeScript' : 'Оценка знаний TypeScript'}
      </p>

      <div class="space-y-8">
        <div>
          <h2 class="text-lg font-semibold mb-4">Области оценки:</h2>
          <ul class="space-y-4">
            <li class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center shrink-0 mt-1">
                <span class="text-primary">1</span>
              </div>
              <div>
                <h3 class="font-medium">Базовые типы</h3>
                <p class="text-gray-600">Работа с примитивными и составными типами</p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center shrink-0 mt-1">
                <span class="text-primary">2</span>
              </div>
              <div>
                <h3 class="font-medium">Интерфейсы и типы</h3>
                <p class="text-gray-600">Создание и использование пользовательских типов</p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center shrink-0 mt-1">
                <span class="text-primary">3</span>
              </div>
              <div>
                <h3 class="font-medium">Продвинутые концепции</h3>
                <p class="text-gray-600">Дженерики, условные типы и утилиты</p>
              </div>
            </li>
          </ul>
        </div>

        <div class="card bg-primary-50 p-6">
          <h3 class="font-semibold mb-2">Начать оценку</h3>
          <p class="text-gray-600 mb-4">
            {mode === 'self-assessment' ? 'Ответьте на вопросы, чтобы получить детальную оценку ваших навыков TypeScript' : 'Ответьте на вопросы, чтобы пройти тестирование'}
          </p>
          <button 
            class="btn btn-primary w-full"
            on:click={startQuiz}
          >
            {mode === 'self-assessment' ? 'Начать самооценку' : 'Начать тестирование'}
          </button>
        </div>
      </div>
    {:else}
      <div class="mb-8">
        <!-- Progress bar with percentage -->
        <div class="flex items-center gap-4 mb-3">
          <div class="progress-bar flex-1">
            <div 
              class="progress-bar-fill"
              style="width: {($quizStore.currentStep / questions.length) * 100}%"
            ></div>
          </div>
          <span class="text-sm font-medium text-gray-700">
            {Math.round(($quizStore.currentStep / questions.length) * 100)}%
          </span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-600">
            Вопрос {$quizStore.currentStep + 1} из {questions.length}
          </span>
          <button 
            on:click={skipQuestion}
            class="text-sm text-gray-600 hover:text-primary transition-colors duration-200 flex items-center gap-1"
          >
            Пропустить
            <ArrowLeft class="w-4 h-4 rotate-180" />
          </button>
        </div>
      </div>
      
      <div class="space-y-6">
        <h3 class="text-xl font-semibold text-gray-800">
          {currentQuestion.question}
        </h3>
        
        <div class="space-y-3">
          {#each currentQuestion.options as option}
            <button
              on:click={() => handleAnswer(option.value)}
              class="quiz-option w-full text-left rounded-lg flex items-center gap-3 group"
              class:selected={selectedAnswer === option.value}
            >
              <div class="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-primary flex items-center justify-center shrink-0
                {selectedAnswer === option.value ? 'border-primary bg-primary-50' : ''}">
                {#if selectedAnswer === option.value}
                  <CheckCircle2 class="w-4 h-4 text-primary" />
                {/if}
              </div>
              <span class="flex-1 text-gray-800">{option.label}</span>
            </button>
          {/each}
        </div>

        {#if $quizStore.currentStep > 0}
          <button
            on:click={goBack}
            class="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors duration-200 mt-8"
          >
            <ArrowLeft class="w-4 h-4" />
            Назад
          </button>
        {/if}
      </div>
    {/if}
  </div>
</div>
