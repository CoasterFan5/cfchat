<script lang="ts">
	import UpArrow from '~icons/ph/arrow-up';
	import type { EventHandler } from 'svelte/elements';
	import ModelPicker from './ModelPicker.svelte';

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

	let submitButton: HTMLButtonElement | undefined = $state();
	const keyboardHelper = (e: KeyboardEvent) => {
		if (e.key == 'Enter' && !e.shiftKey) {
			submitButton?.click();
		}
	};
</script>

<div class="wrap">
	<div class="innerWrap">
		<div class="borderDiv">
			<form class="inner" method="post" action="/chat?/createChat" {onsubmit}>
				<textarea
					name="prompt"
					class="textInput"
					bind:value={promptValue}
					placeholder="Ask Anything..."
					onkeypress={keyboardHelper}
				></textarea>
				<div class="bottomBar">
					<div class="optionHolder">
						<ModelPicker currentModel="gem2.5flash" />
					</div>
					<div class="submit">
						<button
							class="iconButton"
							type={createMode ? 'submit' : 'button'}
							onclick={dispatchPrompt}
							bind:this={submitButton}
						>
							<UpArrow />
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>

<style lang="scss">
	.wrap {
		padding: 0.25rem 5rem 0rem 5rem;
		border-radius: 0.5rem 0.5rem 0 0;
		width: 100%;
		max-width: 90ch;
		height: 8rem;
	}

	.innerWrap {
		border-radius: 1rem 1rem 0 0;
		height: 100%;
		background: var(--secondary);
	}

	.borderDiv {
		height: 100%;
		border-radius: 1rem 1rem 0 0;
		padding: 1px;
		background-image: linear-gradient(-15deg, transparent, rgba(255, 255, 255, 0.2));
	}

	.inner {
		padding: 0.75rem;
		height: 6.75rem;
		border-radius: calc(1rem - 1px) calc(1rem - 1px) 0 0;
		height: 100%;
		display: flex;
		flex-direction: column;
		background: var(--secondary);
	}

	.textInput {
		all: unset;
		width: 100%;
		flex-grow: 1;
		box-sizing: border-box;
	}

	.optionHolder {
		position: relative;
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
		background: var(--primary);
		color: var(--text);
		border: 0px;
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

	.modelOptionWrap {
		position: absolute;
		left: 0px;
		bottom: calc(100% + 0.25rem);
		z-index: 100000;
	}
</style>
