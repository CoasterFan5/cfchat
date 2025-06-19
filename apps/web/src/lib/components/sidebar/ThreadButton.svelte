<script lang="ts">
	import TrashIcon from '~icons/ph/trash-simple';
	import Modal from '../modal/Modal.svelte';
	import Button from '../Button.svelte';
	import ModalActionsRow from '../modal/ModalActionsRow.svelte';
	import { getUserContext } from '$lib/context.svelte';
	import { goto } from '$app/navigation';
	import { toast } from '../toaster/Toast.svelte';
	const ctx = getUserContext();

	let {
		id,
		name,
		currentThreadId
	}: {
		id: string;
		name: string;
		currentThreadId: string;
	} = $props();

	let active = $derived(currentThreadId == id);

	let showingModal = $state(false);

	const deleteThread = async () => {
		const rq = await fetch(`/chat/${id}/delete`, {
			method: 'DELETE'
		});
		if (rq.status != 200) {
			toast.error("Couldn't delete thread");
			return;
		}
		ctx.threadList = ctx.threadList.filter((i) => i.id != id);
		showingModal = false;
		toast.toast('Thread deleted');
		if (currentThreadId == id) {
			goto('/');
		}
	};
</script>

<Modal bind:showing={showingModal}>
	<h2>Are you sure?</h2>
	<p>Are you sure you want to delete {name}? This action can not be undone.</p>
	<ModalActionsRow>
		<Button
			onclick={() => {
				showingModal = false;
			}}>Cancel</Button
		>
		<Button onclick={deleteThread} variation="primary" type="submit">Confirm</Button>
	</ModalActionsRow>
</Modal>

<div class="threadLinkWrap">
	<a class:active href="/chat/{id}" class="threadLink">
		<div class="threadLinkText">
			{name}
		</div>
	</a>
	<div class="buttons">
		<button
			type="button"
			onclick={(e) => {
				if (e.shiftKey) {
					deleteThread();
				} else {
					showingModal = true;
				}
			}}
		>
			<TrashIcon />
		</button>
	</div>
</div>

<style lang="scss">
	.threadLink {
		text-decoration: none;
		color: var(--text);
		width: 100%;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		opacity: 0.8;
		min-width: 0;
		transition: all cubic-bezier(0.455, 0.03, 0.515, 0.955) 0.1s;

		white-space: nowrap;
		overflow: hidden;
		text-wrap-mode: nowrap;
		min-height: 2rem;
		display: flex;
		align-items: center;
		justify-content: start;

		&.active {
			background: var(--background);
		}
	}

	.threadLinkText {
		width: 100%;
		overflow-x: hidden;
		text-overflow: ellipsis;
	}

	.threadLinkWrap {
		display: inline-block;
		position: relative;
		width: 100%;

		.buttons {
			display: flex;
			position: absolute;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			right: -5rem;
			padding-right: 0.25rem;
			top: 0px;
			height: 100%;
			border-radius: 0.25rem;
			z-index: 100;
			background: var(--background);
			transition: cubic-bezier(0.455, 0.03, 0.515, 0.955) 0.1s;

			button {
				background: transparent;
				color: var(--text);
				outline: 0px;
				border: 0px;
				backdrop-filter: blur(10px);
				aspect-ratio: 1/1;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 0.8rem;
				border-radius: 0.25rem;
				cursor: pointer;

				&:hover {
					color: var(--primary);
				}
			}
		}

		&:hover {
			.buttons {
				display: flex;
				right: 0rem;
			}

			.threadLink {
				opacity: 1;
				background: var(--background);
			}
		}
	}
</style>
