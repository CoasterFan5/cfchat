<script>
	import { goto } from '$app/navigation';
	import ChatInput from '$lib/components/ChatInput.svelte';
	import { scale } from 'svelte/transition';
	import { z } from 'zod/v4';
</script>

<div class="newChat">
	<div
		class="welcome"
		transition:scale|global={{
			delay: 0,
			duration: 25
		}}
	>
		<h2>Hello</h2>
		<p>Let me know how I can help!</p>
	</div>
	<ChatInput
		onPrompt={async () => {
			const newChatReq = await fetch('/chat', {
				method: 'post'
			});
			const res = await newChatReq.json();
			const parsed = z
				.object({
					threadId: z.string()
				})
				.safeParse(res);

			if (parsed.error) {
				return;
			}

			goto(`/chat/${parsed.data.threadId}`);
		}}
		createMode={false}
	/>
</div>

<style>
	.newChat {
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
