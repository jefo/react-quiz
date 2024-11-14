<script lang="ts">
  import { ArrowLeft } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import quizStore from '$lib/stores/quiz';
</script>

<div class="max-w-4xl mx-auto p-8">
  <div class="mb-8">
    {#if $quizStore.lastResults}
      <button 
        on:click={() => goto('/')} 
        class="inline-flex items-center text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft class="w-5 h-5 mr-2" />
        Вернуться к результатам
      </button>
    {:else}
      <button 
        on:click={() => goto('/')} 
        class="inline-flex items-center text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft class="w-5 h-5 mr-2" />
        На главную
      </button>
    {/if}
  </div>

  <div class="card p-8">
    <h1>State Management & Side Effects</h1>
    <p class="text-xl text-gray-600 mb-8">
      Оценка навыков управления состоянием и побочными эффектами
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
              <h3 class="font-medium">Управление состоянием</h3>
              <p class="text-gray-600">Локальное и глобальное состояние, Context API</p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
              <span class="text-primary">2</span>
            </div>
            <div>
              <h3 class="font-medium">Хуки и эффекты</h3>
              <p class="text-gray-600">Использование хуков, управление побочными эффектами</p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
              <span class="text-primary">3</span>
            </div>
            <div>
              <h3 class="font-medium">Оптимизация</h3>
              <p class="text-gray-600">Мемоизация, предотвращение лишних рендеров</p>
            </div>
          </li>
        </ul>
      </div>

      <div class="card bg-primary/5 p-6">
        <h3 class="font-semibold mb-2">Начать оценку</h3>
        <p class="text-gray-600 mb-4">
          Ответьте на вопросы, чтобы получить детальную оценку ваших навыков управления состоянием
        </p>
        <button class="btn btn-primary w-full">
          Начать тестирование
        </button>
      </div>
    </div>
  </div>
</div>
