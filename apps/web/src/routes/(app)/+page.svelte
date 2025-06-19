<script>
	import ChatInput from '$lib/components/ChatInput.svelte';
	import { scale } from 'svelte/transition';

	import { Chat } from '@ai-sdk/svelte';
	import { z } from 'zod/v4-mini';
	import { goto } from '$app/navigation';
	import { getUserContext } from '$lib/context.svelte.js';
	import { page } from '$app/state';
	import { tick } from 'svelte';

	let { data } = $props();
	const ctx = getUserContext();

	ctx.currentThreadId = '';

	const chat = new Chat({
		api: `/chat`,
		fetch: async () => {
			return new Response(undefined);
		}
	});

	const systemPrompt = `
      You are an AI assistant designed to fulfill user requests comprehensively and accurately.
      Your primary goal is always to directly answer the user's question or complete their task.
      You have access to various tools that can assist you in this endeavor.
      **These tools are not the objective themselves, but rather a means to achieve the objective.**
      Only use a tool if it is absolutely necessary to gather information, perform a calculation, or execute an action that directly contributes to fulfilling the user's request.
      After using a tool, immediately process its output and use it to formulate your response to the user.
      Do not simply return tool outputs without interpretation or context.
      When writing code, keep the line width to 80 characters and use formatting that makes sense for the language.
      **CRITICAL INSTRUCTION**: Before responding to the users first request, make sure you rename the chat. Do not hesitate.
    `;

	const submitFirstChat = async () => {
		chat.messages = [
			{
				id: '0',
				role: 'system',
				content: systemPrompt,
				parts: [
					{
						type: 'text',
						text: systemPrompt
					}
				]
			},
			{
				id: '1',
				role: 'user',
				content: chat.input,
				parts: [
					{
						type: 'text',
						text: chat.input
					}
				]
			}
		];

		const pr = await fetch('/chat', {
			method: 'POST',
			body: JSON.stringify(chat.messages)
		});
		const res = z.safeParse(
			z.object({
				newThreadId: z.string()
			}),
			await pr.json()
		);

		if (res.error) {
			return;
		}
		ctx.threadList.unshift({
			id: res.data.newThreadId,
			name: 'New Thread'
		});
		goto(`/chat/${res.data.newThreadId}`);
	};

	let hasDoneSubmitFromSeach = false;
	$effect(() => {
		if (hasDoneSubmitFromSeach) {
			return;
		}
		tick().then(() => {
			const q = page.url.searchParams.get('q');
			if (q != null) {
				chat.input = q;
				submitFirstChat();
			}
			hasDoneSubmitFromSeach = true;
		});
	});
</script>

<div class="newChat">
	<div
		class="welcome"
		transition:scale|global={{
			delay: 0,
			duration: 25
		}}
	>
		<h2>Hello!</h2>
		<p>How can I help?</p>
	</div>
	<ChatInput
		bind:promptValue={chat.input}
		onPrompt={submitFirstChat}
		createMode={false}
		currentModel={data.user?.selectedModel || undefined}
		shadowUser={data.user.shadowUser}
		loading={false}
	/>
</div>

<style>
	.newChat {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	.welcome {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		flex-grow: 1;

		h2 {
			margin: 0;
		}
	}
</style>
