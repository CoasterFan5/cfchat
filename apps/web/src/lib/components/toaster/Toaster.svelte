<script>
	import { fly, slide } from 'svelte/transition';
	import { toasts } from './Toast.svelte';

	import CheckIcon from '~icons/ph/check';
	import XIcon from '~icons/ph/x';
</script>

<div class="toaster">
	{#each toasts as toast, index (toast.id)}
		<div
			class="toast"
			style="--index: {index}"
			in:fly={{
				delay: 0,
				duration: 250,
				y: -100
			}}
			out:slide={{
				delay: 0,
				duration: 250,
				axis: 'x'
			}}
		>
			<div class="toastInner">
				<div class="icon">
					{#if toast.type == 'success'}
						<CheckIcon />
					{:else if toast.type == 'error'}
						<XIcon />
					{/if}
				</div>
				<span>{toast.content}</span>
			</div>
		</div>
	{/each}
</div>

<style lang="scss">
	.toaster {
		z-index: 101;
		right: 0.5rem;
		top: 0.5rem;
		position: fixed;
	}

	.toast {
		position: absolute;
		top: calc(0.5rem * var(--index));
		right: 0;
		z-index: calc(0 - var(--index));
		background: var(--secondary);
		background-image: linear-gradient(-15deg, transparent, rgba(255, 255, 255, 0.1));
		padding: 1px;
		border-radius: 0.5rem;
		transition: all cubic-bezier(0.455, 0.03, 0.515, 0.955) 0.1s;
	}

	.toastInner {
		background: var(--secondary);
		padding: calc(0.5rem);
		border-radius: calc(0.5rem - 1px);
		width: 20rem;
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
		align-items: center;
		justify-content: start;

		.icon {
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 100%;
			background: var(--primary-10);
			color: var(--primary);
			padding: 0.25rem;
		}
	}
</style>
