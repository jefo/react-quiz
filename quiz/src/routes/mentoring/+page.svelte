<script lang="ts">
  import { ArrowLeft } from 'lucide-svelte';
</script>

<div class="max-w-4xl mx-auto p-8">
  <div class="mb-8">
    <a href="/" class="inline-flex items-center text-gray-600 hover:text-gray-800">
      <ArrowLeft class="w-5 h-5 mr-2" />
      Вернуться к результатам
    </a>
  </div>

  <div class="card p-8 space-y-8">
    <div>
      <h1>Персональный план развития</h1>
      <p class="text-xl text-gray-600">
        Получите детальные рекомендации и поддержку для быстрого роста
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-8">
      <div class="space-y-4">
        <h2>Что включено</h2>
        <ul class="space-y-3">
          <li class="flex items-start gap-3">
            <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span class="text-primary">1</span>
            </div>
            <div>
              <h3 class="font-medium">Детальный анализ навыков</h3>
              <p class="text-gray-600">Глубокая оценка ваших знаний и выявление областей для роста</p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span class="text-primary">2</span>
            </div>
            <div>
              <h3 class="font-medium">Персональный план обучения</h3>
              <p class="text-gray-600">Структурированная программа развития с учетом ваших целей</p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span class="text-primary">3</span>
            </div>
            <div>
              <h3 class="font-medium">Поддержка ментора</h3>
              <p class="text-gray-600">Регулярные сессии с опытным разработчиком</p>
            </div>
          </li>
        </ul>
      </div>

      <div class="space-y-4">
        <h2>Как это работает</h2>
        <ul class="space-y-3">
          <li class="flex items-start gap-3">
            <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span class="text-primary">1</span>
            </div>
            <div>
              <h3 class="font-medium">Заполните анкету</h3>
              <p class="text-gray-600">Расскажите о своих целях и текущем опыте</p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span class="text-primary">2</span>
            </div>
            <div>
              <h3 class="font-medium">Получите план</h3>
              <p class="text-gray-600">Мы составим персональную программу развития</p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <div class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span class="text-primary">3</span>
            </div>
            <div>
              <h3 class="font-medium">Начните обучение</h3>
              <p class="text-gray-600">Развивайтесь с поддержкой опытного ментора</p>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="card bg-primary/5 p-6">
      <h3>Готовы начать?</h3>
      <p class="text-gray-600 mb-4">
        Заполните короткую анкету, и мы подберем для вас подходящую программу развития
      </p>
      <form class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            id="email"
            class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label for="experience" class="block text-sm font-medium text-gray-700 mb-1">Опыт работы</label>
          <select
            id="experience"
            class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">Выберите...</option>
            <option value="0-1">Менее 1 года</option>
            <option value="1-3">1-3 года</option>
            <option value="3+">Более 3 лет</option>
          </select>
        </div>
        <div>
          <label for="goals" class="block text-sm font-medium text-gray-700 mb-1">Цели развития</label>
          <textarea
            id="goals"
            rows="3"
            class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="Расскажите, чего хотите достичь..."
          ></textarea>
        </div>
        <button type="submit" class="btn btn-primary w-full">
          Получить программу развития
        </button>
      </form>
    </div>
  </div>
</div>
