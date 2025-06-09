<script lang="ts">
	import { enhance } from '$app/forms';
	import type { EventHandler } from 'svelte/elements';

	let {
		onPrompt,
		createMode = false,
		onsubmit,
		promptValue = $bindable('')
	}: {
		onPrompt?: (args: { prompt: string; model: string }) => void;
		createMode?: boolean;
		onsubmit?: EventHandler<SubmitEvent, HTMLFormElement>;
		promptValue?: string;
	} = $props();

	const dispatchPrompt = () => {
		if (onPrompt) {
			onPrompt({
				prompt: promptValue,
				model: 'gem-0.5.1'
			});
		}
	};
</script>

<div class="wrap">
	<form class="inner" method="post" action="/chat?/createChat" {onsubmit}>
		<textarea name="prompt" class="textInput" bind:value={promptValue} placeholder="Ask Anything..."
		></textarea>
		<div class="bottomBar">
			<div class="optionHolder">
				<button type="button"> Search </button>
				<button type="button"> Files </button>
			</div>
			<div class="submit">
				<button type={createMode ? 'submit' : 'button'} onclick={dispatchPrompt}> Go </button>
			</div>
		</div>
	</form>
</div>

<style lang="scss">
	.wrap {
		padding: 0.25rem 0.25rem 0 0.25rem;
		border-radius: 0.5rem 0.5rem 0 0;
		background: var(--secondary);
		width: 50ch;
		max-width: 100%;
	}

	.inner {
		background: var(--background);
		border-radius: 0.25rem 0.25rem 0 0;
		padding: 0.5rem;
	}

	.textInput {
		all: unset;
		width: 100%;
	}

	.optionHolder {
		flex-grow: 1;
	}

	.bottomBar {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-betweenpace;
	}
</style>
