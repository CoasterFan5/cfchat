<script lang="ts">
	import type { UIMessage } from 'ai';
	import Markdown from './Markdown.svelte';
	import ToolInfo from './ToolInfo.svelte';

	const {
		message
	}: {
		message: UIMessage;
	} = $props();
</script>

<div class="message">
	<div class="aiMessage">
		{#each message.parts as part, partIndex (partIndex)}
			{#if part.type == 'text'}
				<Markdown markdown={part.text} />
			{:else if part.type == 'tool-invocation'}
				<ToolInfo toolName={part.toolInvocation.toolName} />
			{/if}
		{/each}
	</div>
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
</style>
