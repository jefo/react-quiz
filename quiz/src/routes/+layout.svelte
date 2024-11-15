<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="min-h-full bg-gradient-to-b from-white to-blue-50">
	<main class="min-h-full mx-auto max-w-content px-container-mobile sm:px-container-tablet lg:px-container-desktop">
		<div class="py-8 sm:py-12 lg:py-16">
			{@render children()}
		</div>
	</main>
</div>

<style lang="postcss">
	:global {
		h1 {
			@apply text-4xl font-bold font-sans mb-6;
		}
		h2 {
			@apply text-2xl font-semibold font-sans mb-4;
		}
		h3 {
			@apply text-xl font-semibold font-sans mb-3;
		}
		p {
			@apply text-base text-gray-800 mb-4;
		}
	}
</style>
