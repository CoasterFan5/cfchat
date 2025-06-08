<script lang="ts">
	import '$lib/global.scss';
	const { children } = $props();
</script>

{@render children?.()}

<style lang="scss">
	// A very creative color palette
	:global(body) {
		--background: #1e1f20;
		--text: #f1f1f1;
		--primary: #e91517;
		--secondary: #131315;

		background: var(--background);
		color: var(--text);
	}
</style>
