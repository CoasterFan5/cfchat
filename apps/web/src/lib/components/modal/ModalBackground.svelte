<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';
	import { fade } from 'svelte/transition';

	let {
		children,
		showing = $bindable(false)
	}: {
		children: Snippet;
		showing: boolean;
	} = $props();

	const bgClickEventHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
		if (e.currentTarget != e.target) {
			return;
		}
		showing = false;
	};
</script>

{#if showing}
	<button
		class="bg"
		onclick={bgClickEventHandler}
		transition:fade|global={{
			delay: 0,
			duration: 100
		}}
	>
		{@render children()}
	</button>
{/if}

<style lang="scss">
	.bg {
		background: rgba(0, 0, 0, 0.25);
		backdrop-filter: blur(5px);
		position: fixed;
		left: 0px;
		top: 0px;
		height: 100vh;
		width: 100%;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		outline: 0x;
		border: 0px;
	}
</style>
