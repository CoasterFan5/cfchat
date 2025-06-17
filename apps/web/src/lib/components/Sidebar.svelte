<script lang="ts">
	import Noise from './Noise.svelte';
	import TrashIcon from '~icons/ph/trash-simple';
	import { getUserContext } from '$lib/contex.svelte';
	import { enhance } from '$app/forms';

	const {
		username = 'Anonymous'
	}: {
		username?: string | null;
	} = $props();

	const ctx = getUserContext();
</script>

<nav class="sidebar">
	<h3 class="logo">CF CHAT</h3>
	<a href="/" class="createChat">
		<div class="createChatInnerWrap">
			<div class="createChatInner">Create Chat</div>
		</div>
	</a>
	<div class="threads">
		{#each ctx.threadList as thread (thread.id)}
			{@const active = ctx.currentThreadId == thread.id}
			<div class="threadLinkWrap">
				<a class:active href="/chat/{thread.id}" class="threadLink">
					{#if active}
						{ctx.currentThreadName}
					{:else}
						{thread.name}
					{/if}
				</a>
				<form class="buttons" method="post" action="/chat/{thread.id}?/deleteThread">
					<input hidden />
					<button type="submit">
						<TrashIcon />
					</button>
				</form>
			</div>
		{/each}
	</div>
	<div class="accountInfoWrap">
		<div class="accountInfoInnerBorderBackground">
			<div class="accountInfoInnerBorder">
				<div class="accountInfoInner">
					<Noise color="var(--secondary)" />
					<span class="username">{username}</span>
					<span class="usage">{ctx.messageLimit - ctx.messagesSent} Messages Remain</span>
				</div>
			</div>
		</div>
	</div>
</nav>

<style lang="scss">
	.sidebar {
		width: 15rem;
		background: var(--secondary);
		height: 100vh;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.logo {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		margin: 0px;
		margin-bottom: 0.5rem;
		font-weight: 200;
	}

	.createChat {
		background: var(--background);
		opacity: 0.95;
		color: var(--text);
		text-align: center;
		width: 100%;
		text-decoration: none;
		border-radius: 0.5rem;
		font-size: 0.8rem;

		&:hover {
			opacity: 1;
			color: var(--primary);

			.createChatInnerWrap {
				background-image: linear-gradient(75deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4));
			}
		}

		.createChatInnerWrap {
			background-image: linear-gradient(75deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3));
			padding: 1px;
			border-radius: 0.5rem;
			cursor: pointer;
			transition: all cubic-bezier(0.455, 0.03, 0.515, 0.955) 0.1s;

			.createChatInner {
				padding: 0.5rem;
				border-radius: calc(0.5rem - 1px);
				background: var(--background);
			}
		}
	}

	.threadLinkWrap {
		position: relative;
		width: 100%;

		.buttons {
			position: absolute;
			display: none;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			right: 0.25rem;
			top: 0px;
			height: 100%;
			border-radius: 0.25rem;
			z-index: 100;

			button {
				background: var(--primary);
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
			}
		}

		&:hover {
			.buttons {
				display: flex;
			}

			.threadLink {
				opacity: 1;
				background: var(--background);
			}
		}
	}

	.threadLink {
		text-decoration: none;
		color: var(--text);
		width: 100%;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		opacity: 0.8;
		transition: all cubic-bezier(0.455, 0.03, 0.515, 0.955) 0.1s;
		overflow-x: hidden;
		text-overflow: ellipsis;
		text-wrap-mode: nowrap;
		min-height: 2rem;
		display: flex;
		align-items: center;
		justify-content: start;

		&.active {
			background: var(--background);
		}
	}

	.threads {
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: start;
		height: 100%;
		flex-grow: 1;
		gap: 0.25rem;
		margin-top: 1rem;
		overflow-y: auto;
	}

	.accountInfoWrap {
		position: absolute;
		bottom: 0px;
		left: 0px;
		width: 100%;
		padding: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;

		.accountInfoInnerBorderBackground {
			width: 100%;
			height: 100%;
			background: var(--background);
			display: flex;
			border-radius: 0.25rem;
		}

		.accountInfoInnerBorder {
			background-image: linear-gradient(75deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3));
			border-radius: 0.25rem;
			width: 100%;
			height: 100%;
			padding: 1px;
		}

		.accountInfoInner {
			background: var(--background);
			border-radius: calc(0.25rem - 1px);
			padding: 0.5rem;
			display: flex;
			flex-direction: column;
			gap: 0.25rem;
			position: relative;

			.username {
				z-index: 1;
			}
			.usage {
				opacity: 0.7;
				z-index: 1;
				font-size: 0.75rem;
			}
		}
	}
</style>
