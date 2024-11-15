<script lang="ts">
  import { writable } from 'svelte/store';
  import { quizStore, type QuizResults } from '$lib/stores/quizStore';
  import { skillGroups } from '$lib/data/skillGroups';
  import { questions } from '$lib/data/questions';
  import { levelCriteria } from '$lib/data/levelCriteria';
  import { formatLevel, getLevelDescription, getSkillLevel, calculateProgress } from '$lib/utils/levelUtils';
  import { getStrengthsGroups, getDetailedGapsGroups } from '$lib/utils/skillUtils';
  import { goto } from '$app/navigation';
  import { 
    ArrowLeft, 
    ArrowRight, 
    Clock, 
    Award, 
    Brain 
  } from 'lucide-svelte';

  // Stores
  const showWelcome = writable(!$quizStore.inProgress);
  const currentStep = writable($quizStore.currentStep);
  const answers = writable($quizStore.answers);
  const showResults = writable($quizStore.lastResults !== null);
  const showConfirmation = writable(false);
  const activeTab = writable('react');
  const showQuiz = writable(false);
  const expandedGroups = writable(new Set<string>());

  // При инициализации раскрываем первую группу в правой колонке
  $: if ($quizStore.lastResults?.technology) {
    const gaps = getDetailedGapsGroups($quizStore.lastResults.technology, $quizStore.lastResults, questions);
    if (gaps.length > 0) {
      $expandedGroups = new Set([gaps[0].category]);
    }
  }

  function toggleGroup(groupId: string) {
    $expandedGroups = new Set($expandedGroups);
    if ($expandedGroups.has(groupId)) {
      $expandedGroups.delete(groupId);
    } else {
      $expandedGroups.add(groupId);
    }
  }

  function isGroupExpanded(groupId: string): boolean {
    return $expandedGroups.has(groupId);
  }

  function generateSkillPlan() {
    // TODO: Implement skill plan generation
    alert('Генерация персонализированного плана развития...');
  }

  function assessLevel(): 'junior' | 'middle' | 'below-junior' {
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

  function saveAnswers(answers: Record<string, number>) {
    quizStore.update(state => ({
      ...state,
      answers
    }));
  }

  function saveResults(level: string, answers: Record<string, number>, technology: string) {
    const results: QuizResults = {
      technology,
      skillScores: answers,
      level,
      timestamp: Date.now()
    };
    
    quizStore.finishQuiz(results);
  }
</script>

<div class="fade-in min-h-screen bg-gray-50">
  {#if $showWelcome}
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div class="max-w-4xl mx-auto p-8 text-center space-y-8">
        <!-- Main heading -->
        <div class="space-y-4">
          <h1 class="text-4xl font-bold text-gray-900">Определи свой уровень React разработчика</h1>
          <p class="text-xl text-gray-600">Пройди быстрый тест самооценки и получи персональные рекомендации для роста</p>
        </div>

        <!-- Features -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div class="p-6 bg-white rounded-lg shadow-sm">
            <Clock class="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 class="text-lg font-semibold">Быстрая оценка</h3>
            <p class="text-gray-600">5-минутный тест для определения уровня</p>
          </div>
          <div class="p-6 bg-white rounded-lg shadow-sm">
            <Brain class="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 class="text-lg font-semibold">Точный анализ</h3>
            <p class="text-gray-600">Оценка по ключевым концептам React</p>
          </div>
          <div class="p-6 bg-white rounded-lg shadow-sm">
            <Award class="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 class="text-lg font-semibold">План развития</h3>
            <p class="text-gray-600">Персональные рекомендации для роста</p>
          </div>
        </div>

        <!-- CTA Button -->
        <div class="mt-12">
          <button
            on:click={() => {
              $showWelcome = false;
              $showQuiz = true;
              $currentStep = 0;
            }}
            class="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Начать оценку
          </button>
        </div>
      </div>
    </div>
  {:else if $showResults}
    <!-- Dashboard -->
    <div class="max-w-7xl mx-auto p-8">
      <!-- Progress Overview -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-3xl font-bold mb-2">
              {formatLevel($quizStore.lastResults?.level || 'beginner')}
            </h1>
            <p class="text-gray-600 mb-4">{getLevelDescription($quizStore.lastResults?.level || 'beginner')}</p>
            
            <!-- Progress Bar -->
            <div class="w-full max-w-md">
              <div class="flex justify-between text-sm text-gray-600 mb-1">
                <span>Beginner</span>
                <span>Junior</span>
                <span>Middle</span>
                <span>Senior</span>
              </div>
              <div class="h-2 w-full bg-gray-200 rounded-full overflow-hidden relative">
                <!-- Level segments -->
                <div class="absolute inset-0 flex">
                  <div class="w-1/4 h-full bg-gray-300"></div>
                  <div class="w-1/4 h-full bg-gray-400"></div>
                  <div class="w-1/4 h-full bg-gray-500"></div>
                  <div class="w-1/4 h-full bg-gray-600"></div>
                </div>
                <!-- Progress fill -->
                <div class="relative h-full bg-blue-500 rounded-full" 
                     style="width: {calculateProgress($quizStore.lastResults?.skillScores)}%">
                </div>
              </div>
            </div>
          </div>
          
          <button
            on:click={generateSkillPlan}
            class="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>Получить план прокачки</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Skills Overview -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Current Level Skills -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center space-x-3 mb-6">
            <div class="flex items-center justify-center p-2 bg-green-100 rounded-lg w-10 h-10">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <h2 class="text-xl font-semibold leading-none">Освоенные навыки</h2>
          </div>
          
          {#each Object.entries(skillGroups) as [key, group]}
            {#if $activeTab === key && $quizStore.lastResults?.technology === key}
              {#each getStrengthsGroups(key, $quizStore.lastResults, questions) as strengthGroup}
                <div class="mb-6 bg-gray-50 rounded-lg p-4">
                  <div class="flex justify-between items-center">
                    <div>
                      <span class="font-medium">{strengthGroup.category}</span>
                      <div class="text-sm text-gray-500">
                        Освоено {strengthGroup.skills.filter(skill => skill.confirmed).length} из {strengthGroup.skills.length}
                      </div>
                    </div>
                  </div>
                  
                  <div class="mt-4 space-y-3 pl-4">
                    {#each strengthGroup.skills as skill}
                      <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                          {#if skill.confirmed}
                            <span class="text-green-500">✓</span>
                          {:else}
                            <span class="w-5 h-5"></span>
                          {/if}
                          <span>{skill.name}</span>
                        </div>
                        <span class="text-sm text-gray-500">
                          {getSkillLevel($quizStore.lastResults?.skillScores[skill.id] || 0)}
                        </span>
                      </div>
                    {/each}
                  </div>
                </div>
              {/each}
            {/if}
          {/each}
        </div>

        <!-- Next Level Skills -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center space-x-3 mb-6">
            <div class="flex items-center justify-center p-2 bg-blue-100 rounded-lg w-10 h-10">
              <span class="text-2xl leading-none">📈</span>
            </div>
            <h2 class="text-xl font-semibold leading-none">Навыки для повышения уровня</h2>
          </div>
          
          {#each Object.entries(skillGroups) as [key, group]}
            {#if $activeTab === key && $quizStore.lastResults?.technology === key}
              {#each getDetailedGapsGroups(key, $quizStore.lastResults, questions) as gapGroup}
                <div class="mb-6 bg-gray-50 rounded-lg p-4">
                  <div class="flex justify-between items-center cursor-pointer"
                       on:click={() => toggleGroup(gapGroup.category)}>
                    <div>
                      <span class="font-medium">{gapGroup.category}</span>
                      <div class="text-sm text-gray-500">
                        Требуется освоить {gapGroup.total - gapGroup.completed} из {gapGroup.total}
                      </div>
                    </div>
                    <span class="text-gray-400">{isGroupExpanded(gapGroup.category) ? '▼' : '▶'}</span>
                  </div>
                  
                  {#if isGroupExpanded(gapGroup.category)}
                    <div class="mt-4 space-y-4 pl-4 border-l-2 border-blue-200">
                      {#each gapGroup.skills as skill}
                        <div class="mb-6">
                          <div class="flex items-center space-x-3">
                            <span>🎯</span>
                            <span class="font-medium text-gray-700">{skill.name}</span>
                          </div>
                          <div class="mt-2 ml-8">
                            <div class="text-sm text-gray-600 mb-2">
                              Текущий уровень: {getSkillLevel(skill.currentLevel)}
                            </div>
                            <div class="space-y-2">
                              {#if skill.recommendations.length > 0}
                                <div class="text-sm font-medium text-gray-700 mb-1">
                                  Для повышения уровня:
                                </div>
                                {#each skill.recommendations as recommendation}
                                  <div class="flex items-start space-x-2">
                                    <span class="mt-0.5">☑️</span>
                                    <span class="text-sm text-gray-600">{recommendation}</span>
                                  </div>
                                {/each}
                              {/if}
                            </div>
                          </div>
                        </div>
                      {/each}
                    </div>
                  {/if}
                </div>
              {/each}
            {/if}
          {/each}
        </div>
      </div>
    </div>
  {:else if $showConfirmation}
    <!-- Confirmation section -->
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div class="max-w-2xl mx-auto p-8">
        <div class="bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 class="text-2xl font-semibold mb-4">Готовы увидеть результаты?</h2>
          <p class="text-gray-600 mb-8">
            Вы ответили на все вопросы. Нажмите "Показать результаты", чтобы увидеть свой уровень и получить рекомендации по развитию.
          </p>
          
          <div class="flex justify-center gap-4">
            <button
              on:click={() => {
                $showConfirmation = false;
                $showQuiz = true;
                $currentStep = questions.length - 1;
              }}
              class="px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Вернуться к вопросам
            </button>
            <button
              on:click={() => {
                $showConfirmation = false;
                $showResults = true;
                const level = assessLevel();
                saveResults(level, $answers, 'react');
              }}
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Показать результаты
            </button>
          </div>
        </div>
      </div>
    </div>
  {:else if $showQuiz}
    <!-- Quiz section -->
    <div class="max-w-3xl mx-auto p-8">
      <div class="bg-white rounded-lg shadow-sm p-8">
        <!-- Progress bar -->
        <div class="mb-8">
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              class="h-full bg-blue-500 transition-all duration-300"
              style="width: {($currentStep / questions.length) * 100}%"
            ></div>
          </div>
          <div class="flex justify-between items-center mt-2">
            <span class="text-sm text-gray-500">
              Вопрос {$currentStep + 1} из {questions.length}
            </span>
            <button 
              on:click={() => {
                if ($currentStep < questions.length - 1) {
                  $currentStep++;
                } else {
                  $showQuiz = false;
                  $showConfirmation = true;
                }
              }}
              class="text-sm text-gray-500 hover:text-gray-700"
            >
              Пропустить
            </button>
          </div>
        </div>

        <!-- Question -->
        <div class="space-y-6">
          <h2 class="text-xl font-semibold">
            {questions[$currentStep]?.question || ''}
          </h2>

          <!-- Options -->
          <div class="space-y-4">
            {#if questions[$currentStep]}
              {#each questions[$currentStep].options as option}
                <button
                  class="w-full p-4 text-left border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors
                    {$answers[questions[$currentStep].id] === option.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}"
                  on:click={() => {
                    const newAnswers = {
                      ...$answers,
                      [questions[$currentStep].id]: option.value
                    };
                    $answers = newAnswers;
                    saveAnswers(newAnswers);
                    
                    if ($currentStep < questions.length - 1) {
                      $currentStep++;
                    } else {
                      $showQuiz = false;
                      $showConfirmation = true;
                    }
                  }}
                >
                  {option.label}
                </button>
              {/each}
            {/if}
          </div>

          <!-- Navigation -->
          <div class="flex justify-between items-center mt-8">
            {#if $currentStep > 0}
              <button
                on:click={() => {
                  if ($currentStep > 0) {
                    $currentStep--;
                  }
                }}
                class="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft class="w-4 h-4" />
                Назад
              </button>
            {/if}
            
            <div class="flex items-center gap-2 text-gray-500">
              <Clock class="w-4 h-4" />
              <span>Примерное время: 2-3 минуты</span>
            </div>

            {#if $currentStep < questions.length - 1}
              <button
                on:click={() => {
                  if ($currentStep < questions.length - 1) {
                    $currentStep++;
                  } else {
                    $showQuiz = false;
                    $showConfirmation = true;
                  }
                }}
                class="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                Далее
                <ArrowRight class="w-4 h-4" />
              </button>
            {/if}
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
