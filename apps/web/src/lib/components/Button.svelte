<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	const {
		type = 'button',
		children,
		onclick = () => {},
		variation = 'secondary'
	}: {
		type?: HTMLButtonElement['type'];
		children?: Snippet;
		onclick?: MouseEventHandler<HTMLButtonElement>;
		variation?: 'primary' | 'secondary';
	} = $props();
</script>

<button {type} {onclick} class:p={variation == 'primary'}>
	{#if children}
		{@render children()}
	{/if}
</button>

<style lang="scss">
	button {
		padding: 0.5rem;
		border-radius: 0.25rem;
		outline: 0px;
		border: 0px;
		background: transparent;
		color: var(--text);
		cursor: pointer;

		&:hover {
			background: rgba(0, 0, 0, 0.25);
			opacity: 1;
		}
	}

	.p {
		background: var(--primary);

		&:hover {
			background: var(--primary);
		}
	}
</style>
