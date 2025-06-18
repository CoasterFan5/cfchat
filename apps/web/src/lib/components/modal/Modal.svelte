<script lang="ts">
	import type { Snippet } from 'svelte';
	import ModalBackground from './ModalBackground.svelte';
	import { fly } from 'svelte/transition';

	let {
		children,
		showing = $bindable(false)
	}: {
		children: Snippet;
		showing: boolean;
	} = $props();
</script>

{#if showing}
	<ModalBackground bind:showing>
		<div
			class="modal"
			transition:fly|global={{
				delay: 0,
				duration: 150,
				y: 50
			}}
		>
			<div class="modalInner">
				{@render children()}
			</div>
		</div>
	</ModalBackground>
{/if}

<style lang="scss">
	.modal {
		background: var(--secondary);
		background-image: linear-gradient(-15deg, transparent, rgba(255, 255, 255, 0.1));
		color: var(--text);
		max-width: 20rem;
		width: 100%;
		border-radius: 0.25rem;
		padding: 1px;
	}

	.modalInner {
		padding: 1px;
		border-radius: calc(0.25rem - 1px);
		width: 100%;
		background: var(--secondary);
		height: 100%;
		text-align: left;
		padding: 0.5rem 1rem;
	}
</style>
