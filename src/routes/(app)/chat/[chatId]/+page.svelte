<script lang="ts">
	import { Chat } from '@ai-sdk/svelte';

	const chat = new Chat({
		api: '/api/gemini',
		maxSteps: 25
	});

	chat.append({
		content: `You are CF Chat. Deliver brief, precise, and educational information. Always assess whether using tools can improve the quality or relevance of your response. The user's request is paramount and must always be met.`,
		role: 'system'
	});
	chat.append({
		content: 'Hello!',
		role: 'user'
	});
	chat.reload();

	import ChatInput from '$lib/components/ChatInput.svelte';
	import AssistantMessage from './AssistantMessage.svelte';
</script>

<div class="chatWrap">
	<div class="chatLog">
		{#each chat.messages as message (message.id)}
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
	<ChatInput onsubmit={chat.handleSubmit} bind:promptValue={chat.input} createMode={true} />
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
