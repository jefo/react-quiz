<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Checklist, Level } from '$lib/data/checklists';
  import { fade, fly } from 'svelte/transition';

  export let checklist: Checklist;
  export let isOpen: boolean = false;

  const dispatch = createEventDispatcher();
  let selectedLevel: Level = 'junior';
  let levels: Array<{ value: Level; label: string }> = [
    { value: 'junior', label: 'Junior' },
    { value: 'middle', label: 'Middle' },
    { value: 'senior', label: 'Senior' },
    { value: 'lead', label: 'Lead' }
  ];

  function close() {
    dispatch('close');
  }

  $: filteredSections = selectedLevel === 'all' 
    ? checklist.sections 
    : checklist.sections.filter(section => section.level === selectedLevel);
</script>

{#if isOpen}
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    transition:fade
    on:click|self={close}
  >
    <div 
      class="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      transition:fly="{{ y: 20, duration: 300 }}"
    >
      <!-- Header -->
      <div class="p-6 border-b">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h2 class="text-2xl font-bold">{checklist.title}</h2>
            <p class="text-gray-600">{checklist.description}</p>
          </div>
          <button 
            class="text-gray-400 hover:text-gray-600"
            on:click={close}
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Level selector -->
        <div class="flex gap-2">
          {#each levels as level}
            <button
              class="px-4 py-2 rounded-lg text-sm font-medium transition-colors
                {selectedLevel === level.value 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}"
              on:click={() => selectedLevel = level.value}
            >
              {level.label}
            </button>
          {/each}
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        {#each filteredSections as section}
          <div class="mb-8 last:mb-0">
            <h3 class="text-xl font-semibold mb-4">{section.title}</h3>
            
            {#each section.sections as subsection}
              <div class="mb-6 last:mb-0">
                <h4 class="text-lg font-medium mb-3">{subsection.title}</h4>
                <div class="space-y-2">
                  {#each subsection.items as item}
                    <div class="flex items-start gap-2">
                      <input 
                        type="checkbox" 
                        class="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span class="text-gray-700">{item}</span>
                    </div>
                  {/each}
                </div>
              </div>
            {/each}
          </div>
        {/each}
      </div>

      <!-- Footer -->
      <div class="p-6 border-t">
        <button
          class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          on:click={close}
        >
          Закрыть
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Убираем стандартный скроллбар */
  .overflow-y-auto {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
  }

  .overflow-y-auto::-webkit-scrollbar {
    width: 6px;
  }

  .overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
  }

  .overflow-y-auto::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 3px;
  }
</style>
