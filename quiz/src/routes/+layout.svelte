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

<style>
	:global(h1) {
		@apply text-h1 font-display mb-6;
	}
	:global(h2) {
		@apply text-h2 font-display mb-4;
	}
	:global(h3) {
		@apply text-h3 font-display mb-3;
	}
	:global(p) {
		@apply text-base text-text mb-4;
	}
</style>
