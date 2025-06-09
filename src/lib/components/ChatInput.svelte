<script lang="ts">
	import UpArrow from '~icons/ph/arrow-up';
	import DropDownArrow from '~icons/ph/caret-down';
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
				<button type="button" class="selectModel"> Gemini-2.5-flash <DropDownArrow /></button>
			</div>
			<div class="submit">
				<button class="iconButton" type={createMode ? 'submit' : 'button'} onclick={dispatchPrompt}>
					<UpArrow />
				</button>
			</div>
		</div>
	</form>
</div>

<style lang="scss">
	.wrap {
		padding: 0.25rem 5rem 1rem 5rem;
		border-radius: 0.5rem 0.5rem 0 0;
		width: 100%;
		max-width: 90ch;
		height: 8rem;
	}

	.inner {
		border-radius: 1rem;
		height: 6.75rem;
		border: 1px solid var(--primary);
		backdrop-filter: blur(3px);
		padding: 0.75rem;
		height: 100%;
		background: var(--primary-10);
		display: flex;
		flex-direction: column;
	}

	.textInput {
		all: unset;
		width: 100%;
		flex-grow: 1;
		box-sizing: border-box;
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

	.iconButton {
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 1/1;
		border: 1px solid var(--primary);
		background: var(--primary-10);
		color: var(--text);
		outline: 0px;
		border-radius: 0.25rem;
		cursor: pointer;
		font-size: 1rem;
	}

	.selectModel {
		border: 1px solid var(--primary);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: row;
		gap: 0.5rem;
		background: var(--primary-10);
		color: var(--text);
		font-size: 0.8rem;
		padding: 0.4rem;
		border-radius: 0.25rem;
		cursor: pointer;
	}
</style>
