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

<div class="max-w-4xl mx-auto p-8">
  <div class="mb-8">
    <button 
      on:click={() => goto('/')} 
      class="inline-flex items-center text-gray-600 hover:text-gray-800"
    >
      <ArrowLeft class="w-5 h-5 mr-2" />
      {$quizStore.lastResults ? 'Вернуться к результатам' : 'На главную'}
    </button>
  </div>

  <div class="card p-8">
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
              <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <span class="text-primary">1</span>
              </div>
              <div>
                <h3 class="font-medium">Базовые типы</h3>
                <p class="text-gray-600">Работа с примитивными и составными типами</p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <span class="text-primary">2</span>
              </div>
              <div>
                <h3 class="font-medium">Интерфейсы и типы</h3>
                <p class="text-gray-600">Создание и использование пользовательских типов</p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                <span class="text-primary">3</span>
              </div>
              <div>
                <h3 class="font-medium">Продвинутые концепции</h3>
                <p class="text-gray-600">Дженерики, условные типы и утилиты</p>
              </div>
            </li>
          </ul>
        </div>

        <div class="card bg-primary/5 p-6">
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
      <div class="mb-6">
        <!-- Progress bar -->
        <div class="progress-bar">
          <div 
            class="progress-bar-fill"
            style="width: {($quizStore.currentStep / questions.length) * 100}%"
          ></div>
        </div>
        <div class="flex justify-between items-center mt-2">
          <span class="text-sm text-gray-500">
            Вопрос {$quizStore.currentStep + 1} из {questions.length}
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
        {currentQuestion.question}
      </h3>
      
      <div class="space-y-3">
        {#each currentQuestion.options as option}
          <button
            on:click={() => handleAnswer(option.value)}
            class="quiz-option w-full text-left rounded-lg border hover:border-primary {selectedAnswer === option.value ? 'selected' : ''}"
          >
            {option.label}
          </button>
        {/each}
      </div>

      {#if $quizStore.currentStep > 0}
        <button
          on:click={goBack}
          class="flex items-center gap-2 text-gray-600 hover:text-gray-800 mt-4"
        >
          <ArrowLeft class="w-4 h-4" />
          Назад
        </button>
      {/if}
    {/if}
  </div>
</div>
