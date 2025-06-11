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

	chat = new Chat({
		api: `/chat/${data.thread.id}`,
		maxSteps: 25,
		initialMessages: JSON.parse(data.thread.messages)
	});

	let reloaded = false;
	$effect(() => {
		if (!reloaded) {
			if (chat.messages[chat.messages.length - 1].role == 'user') {
				console.log('Last message is from a user');
				chat.reload();
				console.log(`reloaded the chat`);
				reloaded = true;
			}
		}
	});
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

	<ChatInput bind:promptValue={chat.input} onsubmit={chat.handleSubmit} createMode={true} />
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

	.message {
		max-width: 70ch;
		padding: 0.5rem;
		border-radius: 0.5rem;
		text-wrap-mode: wrap;
	}
</style>
