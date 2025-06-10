<script lang="ts">
	import type { UIMessage } from 'ai';
	import Markdown from './Markdown.svelte';

	const {
		message
	}: {
		message: UIMessage;
	} = $props();

	let toolList = $derived(message.parts.filter((mp) => mp.type == 'tool-invocation'));
</script>

<div class="message">
	<div class="aiMessage">
		{#each message.parts as part, partIndex (partIndex)}
			{#if part.type == 'text'}
				<Markdown markdown={part.text} />
			{/if}
		{/each}
	</div>
	{#if toolList.length > 0}
		<div class="tools">
			Tools:
			{#each toolList as tu (tu.toolInvocation.toolCallId)}
				<div class="toolUse">
					{tu.toolInvocation.toolName}
				</div>
			{:else}
				<span>None</span>
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	.message {
		width: 100%;
		text-wrap-mode: wrap;
	}
	.aiMessage {
		max-width: 70ch;
		padding: 0.5rem;
		border-radius: 0.5rem;
		text-wrap-mode: wrap;
	}

	.toolUse {
		display: flex;
		background: var(--secondary);
		padding: 0.25rem;
		font-size: 0.8rem;
		border-radius: 0.25rem;
	}

	.tools {
		display: flex;
		gap: 0.5rem;
		flex-direction: row;
		align-items: center;
	}
</style>
