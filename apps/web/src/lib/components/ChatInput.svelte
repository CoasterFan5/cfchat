<script lang="ts">
	import UpArrow from '~icons/ph/arrow-up';
	import type { ChangeEventHandler, EventHandler } from 'svelte/elements';
	import ModelPicker from './ModelPicker.svelte';

	let {
		onPrompt,
		createMode = false,
		onsubmit,
		threadId,
		currentModel = 'gemini-2.5-flash',
		promptValue = $bindable(''),
		shadowUser
	}: {
		onPrompt?: (args: { prompt: string; model: string }) => void;
		createMode?: boolean;
		onsubmit?: EventHandler<SubmitEvent, HTMLFormElement>;
		threadId?: string;
		currentModel?: string;
		promptValue?: string;
		shadowUser: boolean;
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
	let textAreaSize = $state(30);
	const keyboardHelper = (e: KeyboardEvent) => {
		if (e.key == 'Enter' && !e.shiftKey) {
			e.preventDefault();
			submitButton?.click();
		}
	};

	const resizeTextArea: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
		e.currentTarget.style.height = '0px';
		textAreaSize = e.currentTarget.scrollHeight;
		textAreaSize = Math.max(30, Math.min(textAreaSize, 250));
		e.currentTarget.style.height = `${textAreaSize}px`;
	};
</script>

<div class="wrap">
	{#if shadowUser}
		<div class="shadowUserWarning">
			<div class="shadowUserWarningInner">
				<span class="warn">Warning!&nbsp;</span><span>
					You are currently a shadow user. <a href="/auth">Login to sync and save history</a></span
				>
			</div>
		</div>
	{/if}
	<div class="innerWrap">
		<div class="borderDiv">
			<form class="inner" method="post" action="/chat?/createChat" {onsubmit}>
				<textarea
					name="prompt"
					class="textInput"
					bind:value={promptValue}
					placeholder="Ask Anything..."
					onkeypress={keyboardHelper}
					oninput={resizeTextArea}
					rows="1"
					style="height: {textAreaSize}px"
				></textarea>
				<div class="bottomBar">
					<div class="optionHolder">
						<ModelPicker {currentModel} {threadId} />
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
		position: absolute;
		left: 50%;
		bottom: 0px;
		transform: translate(-50%);
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
		border-radius: calc(1rem - 1px) calc(1rem - 1px) 0 0;
		height: 100%;
		display: flex;
		flex-direction: column;
		background: var(--secondary);
	}

	.textInput {
		all: unset;
		height: 100%;
		line-height: 1.25rem;
		width: 100%;
		flex-grow: 1;
		overflow-y: auto;
		box-sizing: border-box;
		padding: 0 0.25rem;
		transition: height linear 0.05s;
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

	.shadowUserWarning {
		position: absolute;
		top: -2rem;
		z-index: -1;
		left: 50%;
		background: var(--secondary);
		background-image: linear-gradient(-15deg, transparent, rgba(255, 255, 255, 0.2));
		transform: translateX(-50%);
		text-wrap-mode: nowrap;
		border-radius: 0.5rem 0.5rem 0 0;
		padding: 1px;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 2.5rem;

		.shadowUserWarningInner {
			background: var(--secondary);
			border-radius: calc(0.5rem - 1px) calc(0.5rem - 1px) 0 0;
			padding: calc(0.5rem - 1px);
			height: 100%;

			.warn {
				color: var(--primary);
			}

			a {
				color: var(--text);

				&:hover {
					color: var(--primary);
				}
			}
		}
	}
</style>
