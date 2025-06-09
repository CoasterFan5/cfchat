<script lang="ts">
	import { Chat } from '@ai-sdk/svelte';
	import ChatInput from '$lib/components/ChatInput.svelte';
	import AssistantMessage from './AssistantMessage.svelte';
	import type { PageData } from './$types';

	const {
		data
	}: {
		data: PageData;
	} = $props();

	let chat = $state(
		new Chat({
			api: `/chat/${data.thread.id}`,
			maxSteps: 25
		})
	);

	$effect(() => {
		chat = new Chat({
			api: `/chat/${data.thread.id}`,
			maxSteps: 25
		});
		chat.messages = JSON.parse(data.thread.messages);
	});

	let submitPromptButton: HTMLButtonElement | undefined = $state();
</script>

<div class="chatWrap">
	<div class="chatLog">
		{#each chat.messages as message, index (index)}
			{#if message.role == 'user'}
				<div class="messageWrap userMessage">
					<div class="message">
						{message.content}
					</div>
				</div>
			{:else if message.role == 'assistant'}
				<AssistantMessage {message} />
			{/if}
			{JSON.stringify(message.annotations)}
		{/each}
	</div>

	<ChatInput
		onPrompt={() => {
			submitPromptButton?.click();
		}}
		bind:promptValue={chat.input}
		onsubmit={chat.handleSubmit}
		createMode={true}
	/>
</div>

<style>
	.chatWrap {
		display: flex;
		align-items: center;
		justify-content: start;
		flex-direction: column;
		width: 100%;
		height: 100%;
		overflow-y: auto;
		overflow-x: hidden;
	}

	.chatLog {
		display: flex;
		align-items: center;
		justify-content: start;
		flex-direction: column;
		flex-grow: 1;
		width: 100%;
		max-width: 90ch;
		padding: 5rem 5rem 0 5rem;

		h2 {
			margin: 0;
		}
	}

	.chatForm {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.messageWrap {
		display: flex;
		align-items: center;
		width: 100%;
	}

	.userMessage {
		justify-content: end;
		.message {
			background: var(--secondary);
		}
	}

	.aiMessage {
		justify-content: start;
	}

	.message {
		max-width: 70ch;
		padding: 0.5rem;
		border-radius: 0.5rem;
		text-wrap-mode: wrap;
	}
</style>
