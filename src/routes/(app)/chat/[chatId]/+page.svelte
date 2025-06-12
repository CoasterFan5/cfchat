<script lang="ts">
	import { Chat } from '@ai-sdk/svelte';
	import ChatInput from '$lib/components/ChatInput.svelte';
	import AssistantMessage from './AssistantMessage.svelte';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import type { Attachment } from 'svelte/attachments';

	const {
		data
	}: {
		data: PageData;
	} = $props();

	const chat = new Chat({
		api: `/chat/${data.thread.id}`,
		maxSteps: 25,
		onResponse: () => {
			console.log('res');
		}
	});

	$effect(() => {
		window.scrollTo(0, 1000000);
	});

	$effect(() => {
		chat.messages = JSON.parse(data.thread.messages);
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

	onMount(() => {
		console.log('scrolling');
		bottomAnchor?.scrollIntoView();
	});

	const scrollToElement: Attachment = (node) => {
		node.scrollIntoView();
	};

	let bottomAnchor: HTMLSpanElement | undefined = $state();
</script>

<div class="wrap">
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
				<span class="b" {@attach scrollToElement}></span>
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
		padding: 5rem 5rem 5rem 5rem;
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
