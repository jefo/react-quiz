<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="h-full">
	<div class="h-full" data-theme="skeleton">
		{@render children()}
	</div>
</div>
