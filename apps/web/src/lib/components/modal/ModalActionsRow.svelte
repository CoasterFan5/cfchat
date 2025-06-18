<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		children
	}: {
		children: Snippet;
	} = $props();
</script>

<div>
	{@render children()}
</div>

<style lang="scss">
	div {
		display: flex;
		width: 100%;
		flex-direction: row;
		align-items: center;
		justify-content: end;
		gap: 0.5rem;
	}
</style>
