<script lang="ts">
	import { Chat } from '@ai-sdk/svelte';
	import ChatInput from '$lib/components/ChatInput.svelte';
	import AssistantMessage from './AssistantMessage.svelte';
	import type { PageData } from './$types';
	import { tick } from 'svelte';
	import { getUserContext } from '$lib/contex.svelte';

	const {
		data
	}: {
		data: PageData;
	} = $props();

	const ctx = getUserContext();

	const chat = new Chat({
		api: `/chat/${data.thread.id}`,
		maxSteps: 25,
		onResponse: () => {
			ctx.messagesSent += 1;
		},
		onFinish: (f) => {
			const toolParts = f.parts?.filter(
				(t) => t.type == 'tool-invocation' && t.toolInvocation.toolName == 'nameChat'
			);
			if (toolParts && toolParts[0]) {
				if (toolParts[0].type == 'tool-invocation') {
					ctx.currentThreadName = toolParts[0].toolInvocation.args.newName || 'New Thread';
				}
			}
		}
	});
	$effect(() => {
		chat.messages = JSON.parse(data.thread.messages);
		ctx.currentThreadId = data.thread.id;
		ctx.currentThreadName = data.thread.name;
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

	const scrollToBottom = () => {
		tick().then(() => {
			if (chatWrap) {
				chatWrap.scrollTop = chatWrap.scrollHeight;
			}
		});
	};

	let chatWrap: HTMLDivElement | undefined = $state();
</script>

<div class="wrap">
	<div class="chatWrap" bind:this={chatWrap}>
		<div class="chatLog">
			{#each chat.messages as message, index (index)}
				{#if message.role == 'user'}
					<div class="messageWrap userMessage">
						<div class="message">
							{message.content}
						</div>
					</div>
				{:else if message.role == 'assistant'}
					<AssistantMessage {message} mountCallback={scrollToBottom} />
				{/if}
			{/each}
		</div>
	</div>
	<ChatInput
		bind:promptValue={chat.input}
		onsubmit={chat.handleSubmit}
		createMode={true}
		currentModel={data.thread.selectedModel}
		threadId={data.thread.id}
	/>
</div>

<style>
	.wrap {
		width: 100%;
		height: 100vh;
		position: relative;
	}
	.chatWrap {
		position: absolute;
		left: 0px;
		bottom: 0px;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: start;
		flex-direction: column;
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
		padding: 5rem 5rem 6rem 5rem;
		line-height: 1.5rem;
		gap: 0.5rem;
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
