<script lang="ts">
  import { writable } from 'svelte/store';
  import { quizStore, type QuizResults } from '$lib/stores/quizStore';
  import { skillGroups } from '$lib/data/skillGroups';
  import { questions } from '$lib/data/questions';
  import { levelCriteria } from '$lib/data/levelCriteria';
  import { formatLevel, getLevelDescription, getSkillLevel, calculateProgress, getNextLevelRequirements } from '$lib/utils/levelUtils';
  import { getStrengthsGroups, getDetailedGapsGroups } from '$lib/utils/skillUtils';
  import { goto } from '$app/navigation';
  import { checklists } from '$lib/data/checklists';
  import ChecklistModal from '$lib/components/ChecklistModal.svelte';
  import { 
    ArrowLeft, 
    ArrowRight, 
    Clock, 
    Award, 
    Brain 
  } from 'lucide-svelte';
  import { getSkillRecommendations } from '$lib/utils/recommendations';

  // Stores
  const showWelcome = writable(!$quizStore.inProgress);
  const currentStep = writable($quizStore.currentStep);
  const answers = writable($quizStore.answers);
  const showResults = writable($quizStore.lastResults !== null);
  const showConfirmation = writable(false);
  const activeTab = writable('react');
  const showQuiz = writable(false);
  const expandedGroups = writable(new Set<string>());
  const showChecklistModal = writable(false);
  const currentChecklist = writable(checklists['react-performance']);
  const showLevelDetails = writable(false);

  // При инициализации раскрываем первую группу в правой колонке
  $: if ($quizStore.lastResults?.technology) {
    const gaps = getDetailedGapsGroups($quizStore.lastResults.technology, $quizStore.lastResults, questions);
    if (gaps.length > 0) {
      $expandedGroups = new Set([gaps[0].category]);
    }
  }

  function toggleGroup(groupId: string) {
    expandedGroups.update(groups => {
      const newGroups = new Set(groups);
      if (newGroups.has(groupId)) {
        newGroups.delete(groupId);
      } else {
        newGroups.add(groupId);
      }
      return newGroups;
    });
  }

  function isGroupExpanded(groupId: string): boolean {
    return $expandedGroups.has(groupId);
  }

  function generateSkillPlan() {
    // TODO: Implement skill plan generation
    alert('Генерация персонализированного плана развития...');
  }

  function assessLevel(): 'below-junior' | 'junior' | 'middle' | 'senior' {
    // Check requirements in descending order (senior -> middle -> junior)
    const seniorCheck = Object.entries(levelCriteria.senior.minScore).every(
      ([skill, requiredScore]) => ($answers[skill] || 0) >= requiredScore
    );
    
    if (seniorCheck) return 'senior';

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

  function getDocLink(recommendation: string): string {
    const docLinks: Record<string, string> = {
      // React
      'Основы компонентов': 'https://react.dev/learn/your-first-component',
      'Пропсы и композиция': 'https://react.dev/learn/passing-props-to-a-component',
      'Состояние и хуки': 'https://react.dev/learn/state-a-components-memory',
      'Жизненный цикл': 'https://react.dev/learn/lifecycle-of-reactive-effects',
      'Оптимизация': 'https://react.dev/learn/render-and-commit',
      // TypeScript
      'Основы TypeScript': 'https://www.typescriptlang.org/docs/handbook/2/basic-types.html',
      'Интерфейсы и типы': 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html',
      'Дженерики': 'https://www.typescriptlang.org/docs/handbook/2/generics.html',
      'Продвинутые типы': 'https://www.typescriptlang.org/docs/handbook/2/types-from-types.html',
      // State Management
      'Управление состоянием': 'https://react.dev/learn/managing-state',
      'Контекст': 'https://react.dev/learn/passing-data-deeply-with-context',
      'Redux': 'https://redux.js.org/introduction/getting-started',
      'Эффекты': 'https://react.dev/learn/synchronizing-with-effects',
    };
    
    return docLinks[recommendation] || '#';
  }

  function getProgressColor(score: number): string {
    if (score >= 4) return 'bg-green-100 text-green-700';
    if (score >= 3) return 'bg-blue-100 text-blue-700';
    if (score >= 2) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  }

  function getProgressLabel(score: number): string {
    if (score >= 4) return 'Отлично';
    if (score >= 3) return 'Хорошо';
    if (score >= 2) return 'Удовлетворительно';
    return 'Требует внимания';
  }

  function getTopRecommendations(results: QuizResults) {
    const gaps = getDetailedGapsGroups(results.technology, results, questions);
    const allSkills = gaps.flatMap(group => group.skills)
      .sort((a, b) => {
        // Приоритет обязательным навыкам с большим разрывом
        const aGap = a.requiredLevel - a.currentLevel;
        const bGap = b.requiredLevel - b.currentLevel;
        return bGap - aGap;
      })
      .slice(0, 3);

    return allSkills.map(skill => ({
      title: skill.name,
      description: skill.description,
      checklistId: `${results.technology}-${skill.id}`
    }));
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
    <div class="max-w-7xl mx-auto p-8">
      <!-- Quick Navigation -->
      <nav class="bg-white rounded-lg shadow-sm p-4 mb-8" aria-label="Навигация по результатам">
        <ul class="flex space-x-6">
          <li>
            <a href="#overview" class="text-gray-600 hover:text-blue-600">Обзор</a>
          </li>
          <li>
            <a href="#recommendations" class="text-gray-600 hover:text-blue-600">Рекомендации</a>
          </li>
          <li>
            <a href="#next-steps" class="text-gray-600 hover:text-blue-600">Следующие шаги</a>
          </li>
        </ul>
      </nav>

      <!-- Progress Overview -->
      <div id="overview" class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-3xl font-bold">
                {formatLevel($quizStore.lastResults?.level || 'beginner')}
              </h1>
              <button 
                class="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
                on:click={() => showLevelDetails.update(value => !value)}
              >
                Подробнее о уровне
              </button>
            </div>
            <p class="text-gray-600 mb-6">{getLevelDescription($quizStore.lastResults?.level || 'beginner')}</p>
            
            <!-- Progress Bar -->
            <div class="w-full max-w-md">
              <div class="flex justify-between text-sm text-gray-600 mb-1">
                <span>Beginner</span>
                <span>Junior</span>
                <span>Middle</span>
                <span>Senior</span>
              </div>
              <div class="h-2 bg-gray-200 rounded-full overflow-hidden relative">
                <div class="absolute inset-0 flex">
                  <div class="w-1/4 h-full bg-gray-300"></div>
                  <div class="w-1/4 h-full bg-gray-400"></div>
                  <div class="w-1/4 h-full bg-gray-500"></div>
                  <div class="w-1/4 h-full bg-gray-600"></div>
                </div>
                <div class="relative h-full bg-blue-500 rounded-full transition-all duration-500" 
                     style="width: {calculateProgress($quizStore.lastResults?.skillScores)}%">
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="flex gap-4">
            <button 
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              on:click={generateSkillPlan}
            >
              Создать план развития
            </button>
            <button 
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              on:click={() => goto('/assess/typescript')}
            >
              Пройти тест снова
            </button>
          </div>
        </div>

        {#if $showLevelDetails}
          <div class="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 class="font-medium mb-2">Что означает ваш уровень</h3>
            <p class="text-gray-600">{getLevelDescription($quizStore.lastResults?.level || 'beginner')}</p>
            <div class="mt-4">
              <h4 class="font-medium mb-2">Следующий уровень</h4>
              <p class="text-gray-600">{getNextLevelRequirements($quizStore.lastResults?.level || 'beginner')}</p>
              
              <h4 class="font-medium mb-2">Рекомендуемые навыки</h4>
              {#each getSkillRecommendations($quizStore.lastResults?.level || 'beginner' as 'below-junior' | 'junior' | 'middle' | 'senior') as category}
                <div class="mb-4">
                  <h5 class="font-medium flex items-center gap-2">
                    <span>{category.icon}</span>
                    {category.title}
                  </h5>
                  <ul class="list-disc list-inside ml-4 text-gray-600">
                    {#each category.skills as skill}
                      <li>{skill}</li>
                    {/each}
                  </ul>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <!-- Skills Recommendations -->
      <div id="recommendations" class="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-4">
            <div class="flex items-center justify-center w-12 h-12 bg-primary-50 text-primary rounded-xl">
              <span class="text-2xl">🎯</span>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">
                Стать {$quizStore.lastResults?.level === 'below-junior' ? 'Junior' : 
                       $quizStore.lastResults?.level === 'junior' ? 'Middle' : 
                       $quizStore.lastResults?.level === 'middle' ? 'Senior' : 'Lead'} разработчиком
              </h2>
              <p class="text-gray-600 mt-1">Следуйте этим шагам для достижения следующего уровня</p>
            </div>
          </div>
        </div>

        <div class="space-y-8">
          <!-- Step 1: Competencies -->
          <div class="relative pl-8 pb-8 border-l-2 border-primary-100 last:border-l-0">
            <div class="absolute -left-3 top-0 w-6 h-6 rounded-full bg-primary-100 text-primary flex items-center justify-center font-semibold">
              1
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              Ознакомьтесь со списком тем для изучения
            </h3>
            {#if $quizStore.lastResults?.level}
              <div class="space-y-6">
                {#each getSkillRecommendations($quizStore.lastResults.level) as category}
                  <div class="bg-gray-50 rounded-xl p-6">
                    <h4 class="text-lg font-medium flex items-center gap-2 mb-4">
                      <span class="text-2xl">{category.icon}</span>
                      {category.title}
                    </h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {#each category.skills as skill}
                        <div class="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-100 hover:border-primary/30 hover:shadow-sm transition-all group cursor-pointer">
                          <div class="w-6 h-6 rounded-full border-2 border-primary-200 flex items-center justify-center shrink-0 group-hover:bg-primary-50">
                            <span class="text-primary">✓</span>
                          </div>
                          <span class="text-gray-700 group-hover:text-gray-900">{skill}</span>
                        </div>
                      {/each}
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>

          <!-- Step 2: Learning Plan -->
          <div class="relative pl-8 pb-8 border-l-2 border-primary-100 last:border-l-0">
            <div class="absolute -left-3 top-0 w-6 h-6 rounded-full bg-primary-100 text-primary flex items-center justify-center font-semibold">
              2
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              Постройте план и расписание обучения
            </h3>
            <div class="bg-gray-50 rounded-xl p-6">
              <p class="text-gray-700 mb-4">
                Создайте структурированный план обучения:
              </p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100">
                  <div class="w-6 h-6 rounded-full bg-primary-50 flex items-center justify-center shrink-0 mt-0.5">
                    <span class="text-primary text-sm">1</span>
                  </div>
                  <div>
                    <h5 class="font-medium text-gray-900 mb-1">Приоритизация</h5>
                    <p class="text-sm text-gray-600">Определите приоритетность тем для изучения</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100">
                  <div class="w-6 h-6 rounded-full bg-primary-50 flex items-center justify-center shrink-0 mt-0.5">
                    <span class="text-primary text-sm">2</span>
                  </div>
                  <div>
                    <h5 class="font-medium text-gray-900 mb-1">Тайм-менеджмент</h5>
                    <p class="text-sm text-gray-600">Выделите время на изучение каждой темы</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100">
                  <div class="w-6 h-6 rounded-full bg-primary-50 flex items-center justify-center shrink-0 mt-0.5">
                    <span class="text-primary text-sm">3</span>
                  </div>
                  <div>
                    <h5 class="font-medium text-gray-900 mb-1">Дедлайны</h5>
                    <p class="text-sm text-gray-600">Установите реалистичные сроки для каждой цели</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100">
                  <div class="w-6 h-6 rounded-full bg-primary-50 flex items-center justify-center shrink-0 mt-0.5">
                    <span class="text-primary text-sm">4</span>
                  </div>
                  <div>
                    <h5 class="font-medium text-gray-900 mb-1">Отслеживание</h5>
                    <p class="text-sm text-gray-600">Регулярно проверяйте свой прогресс</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Mock Interview -->
          <div class="relative pl-8 pb-8 border-l-2 border-primary-100 last:border-l-0">
            <div class="absolute -left-3 top-0 w-6 h-6 rounded-full bg-primary-100 text-primary flex items-center justify-center font-semibold">
              3
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-4">
              Проверьте свои знания на МОК-интервью
            </h3>
            <div class="bg-gray-50 rounded-xl p-6">
              <p class="text-gray-700 mb-4">
                Закрепите полученные знания:
              </p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100">
                  <div class="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                    <span class="text-xl">👥</span>
                  </div>
                  <div>
                    <h5 class="font-medium text-gray-900 mb-1">Найдите ментора</h5>
                    <p class="text-sm text-gray-600">Договоритесь о проведении интервью с опытным разработчиком</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100">
                  <div class="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                    <span class="text-xl">📝</span>
                  </div>
                  <div>
                    <h5 class="font-medium text-gray-900 mb-1">Подготовьтесь</h5>
                    <p class="text-sm text-gray-600">Изучите типичные вопросы и подготовьте ответы</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100">
                  <div class="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                    <span class="text-xl">💻</span>
                  </div>
                  <div>
                    <h5 class="font-medium text-gray-900 mb-1">Практика</h5>
                    <p class="text-sm text-gray-600">Выполните тестовые задания и код-ревью</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-100">
                  <div class="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                    <span class="text-xl">📊</span>
                  </div>
                  <div>
                    <h5 class="font-medium text-gray-900 mb-1">Анализ</h5>
                    <p class="text-sm text-gray-600">Получите обратную связь и определите области для улучшения</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Next Steps -->
      <div id="next-steps" class="bg-white rounded-lg shadow-sm p-6 mt-8">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center space-x-3">
            <div class="flex items-center justify-center p-2 bg-blue-100 rounded-lg w-10 h-10">
              <span class="text-2xl">📚</span>
            </div>
            <h2 class="text-xl font-semibold">Следующие шаги</h2>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-4 border rounded-lg">
            <h3 class="font-medium mb-2">Создайте план развития</h3>
            <p class="text-gray-600 mb-4">Получите персонализированный план обучения на основе ваших результатов</p>
            <button 
              class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              on:click={generateSkillPlan}
            >
              Создать план
            </button>
          </div>
          <div class="p-4 border rounded-lg">
            <h3 class="font-medium mb-2">Поделитесь результатами</h3>
            <p class="text-gray-600 mb-4">Отправьте результаты своему ментору или сохраните для себя</p>
            <button 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              on:click={() => {/* TODO: Implement share functionality */}}
            >
              Поделиться
            </button>
          </div>
        </div>
      </div>
    </div>
  {:else if $showConfirmation}
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <!-- Confirmation content -->
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
    <div class="max-w-3xl mx-auto p-8">
      <!-- Quiz content -->
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

  <ChecklistModal 
    checklist={$currentChecklist}
    isOpen={$showChecklistModal}
    on:close={() => $showChecklistModal = false}
  />
</div>
