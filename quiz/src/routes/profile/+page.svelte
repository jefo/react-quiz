<script lang="ts">
    let currentLevel = "Middle Developer";
    
    // Mock data structure for skills
    let completedSkills = [
        {
            name: "Frontend Development",
            progress: "3/5",
            topics: [
                { name: "HTML/CSS", completed: true },
                { name: "JavaScript", completed: true },
                { name: "React/Svelte", completed: true },
                { name: "Responsive Design", completed: false },
                { name: "Web Performance", completed: false }
            ],
            expanded: false
        },
        {
            name: "Backend Development",
            progress: "2/4",
            topics: [
                { name: "Node.js", completed: true },
                { name: "Databases", completed: true },
                { name: "API Design", completed: false },
                { name: "Security", completed: false }
            ],
            expanded: false
        }
    ];

    let nextLevelSkills = [
        {
            name: "System Design",
            progress: "0/3",
            topics: [
                { name: "Architecture Patterns", completed: false },
                { name: "Scalability", completed: false },
                { name: "Microservices", completed: false }
            ],
            expanded: false
        },
        {
            name: "DevOps",
            progress: "0/4",
            topics: [
                { name: "CI/CD", completed: false },
                { name: "Docker", completed: false },
                { name: "Kubernetes", completed: false },
                { name: "Cloud Services", completed: false }
            ],
            expanded: false
        }
    ];

    function toggleGroup(group: any) {
        group.expanded = !group.expanded;
    }

    function getSkillsUpgradePlan() {
        // TODO: Implement plan generation logic
        alert("Generating your personalized skill upgrade plan...");
    }
</script>

<div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Ваш текущий уровень: {currentLevel}</h1>
        <button 
            on:click={getSkillsUpgradePlan}
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
            Получить план прокачки навыков
        </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Left Column: Current Skills -->
        <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4">Освоенные навыки</h2>
            {#each completedSkills as group}
                <div class="mb-4">
                    <div 
                        class="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                        on:click={() => toggleGroup(group)}
                    >
                        <span class="font-medium">{group.name} ({group.progress})</span>
                        <span class="text-sm">{group.expanded ? '▼' : '▶'}</span>
                    </div>
                    {#if group.expanded}
                        <div class="ml-4 mt-2 space-y-2">
                            {#each group.topics as topic}
                                <div class="flex items-center space-x-2">
                                    <span>{topic.completed ? '✅' : '⚪'}</span>
                                    <span>{topic.name}</span>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
            {/each}
        </div>

        <!-- Right Column: Next Level Skills -->
        <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4">Навыки для следующего уровня</h2>
            {#each nextLevelSkills as group}
                <div class="mb-4">
                    <div 
                        class="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                        on:click={() => toggleGroup(group)}
                    >
                        <span class="font-medium">{group.name} ({group.progress})</span>
                        <span class="text-sm">{group.expanded ? '▼' : '▶'}</span>
                    </div>
                    {#if group.expanded}
                        <div class="ml-4 mt-2 space-y-2">
                            {#each group.topics as topic}
                                <div class="flex items-center space-x-2">
                                    <span>⚪</span>
                                    <span class="text-gray-600">{topic.name}</span>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    .container {
        max-width: 1200px;
    }
</style>
