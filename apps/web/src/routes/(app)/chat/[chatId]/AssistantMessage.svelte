<script lang="ts">
	import type { UIMessage } from 'ai';
	import Markdown from './Markdown.svelte';

	const {
		message,
		mountCallback
	}: {
		message: UIMessage;
		mountCallback: () => void;
	} = $props();
</script>

<div class="message">
	<div class="aiMessage">
		{#each message.parts as part, partIndex (partIndex)}
			{#if part.type == 'text'}
				<Markdown markdown={part.text} {mountCallback} />
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
