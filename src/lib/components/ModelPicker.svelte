<script lang="ts">
	import type { Component } from 'svelte';
	import type { SVGAttributes } from 'svelte/elements';
	import { fly } from 'svelte/transition';
	import GoogleLogo from '~icons/logos/google-icon';
	import OpenAILogo from '~icons/streamline-logos/openai-logo';
	import DropDownArrow from '~icons/ph/caret-down';

	const {
		currentModel = 'gem2.5flash'
	}: {
		currentModel: string;
	} = $props();

	type providerType = 'google' | 'openai';
	const iconMap: Record<providerType, Component<SVGAttributes<SVGElement>, object>> = {
		google: GoogleLogo,
		openai: OpenAILogo
	};

	type ModelDetails = {
		humanName: string;
		modelName: string;
		provider: providerType;
	};

	const models: Record<string, ModelDetails> = {
		'gem2.0flash': {
			humanName: 'Gemini 2.0 Flash',
			modelName: 'gemini-2.0-flash',
			provider: 'google'
		},
		'gem2.5flash': {
			humanName: 'Gemini 2.5 Flash',
			modelName: 'gemini-2.5-flash-preview-04-17',
			provider: 'google'
		},
		'gem2.5pro': {
			humanName: 'Gemini 2.5 Pro',
			modelName: 'gemini-2.5-pro',
			provider: 'google'
		},
		gpt04Mini: {
			humanName: 'o4 Mini',
			modelName: 'gemini-2.5-flash-preview-04-17',
			provider: 'openai'
		}
	};

	let CurrentIcon = $derived(iconMap[models[currentModel].provider]);
	let showingDropDown = $state(false);
</script>

<div class="wrap">
	<button
		class="modelButton currentModelButton"
		onclick={() => (showingDropDown = !showingDropDown)}
	>
		<div class="icon">
			<CurrentIcon />
		</div>
		{models[currentModel].humanName}
		<DropDownArrow />
	</button>
	{#if showingDropDown}
		<div
			class="floatingPicker"
			in:fly={{
				delay: 0,
				duration: 100,
				x: 0,
				y: 50
			}}
		>
			<div class="floatingPickerInnerWrap">
				<div class="floatingPickerInner">
					{#each Object.entries(models) as model, index (index)}
						{@const Icon = iconMap[model[1].provider]}
						<button type="button" class="modelButton modelDropDownButton">
							<div class="icon">
								<Icon />
							</div>
							{model[1].humanName}
						</button>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.wrap {
		position: relative;
	}

	.floatingPicker {
		background: var(--secondary);
		position: absolute;
		bottom: calc(100% + 0.25rem);
		z-index: 100;
		border-radius: 0.25rem;
	}

	.floatingPickerInnerWrap {
		padding: 1px;
		border-radius: 0.25rem;
		background-image: linear-gradient(-15deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.3));
	}

	.floatingPickerInner {
		border-radius: calc(0.25rem - 1px);
		background: var(--secondary);
		padding: 0.25rem;
	}

	.modelButton {
		height: 2rem;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: start;
		gap: 0.5rem;
		background: transparent;
		color: var(--text);
		padding: 0 0.5rem;
		border-radius: 0.25rem;
		outline: 0px;
		border: 0px;
		cursor: pointer;
		transition: all cubic-bezier(0.455, 0.03, 0.515, 0.955) 0.1s;

		&:hover {
			background: rgba(0, 0, 0, 0.2);
		}
	}

	.modelDropDownButton {
		width: 100%;
	}

	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text);
	}

	.currentModelButton {
		background: transparent;
		border: 0px;
		outline: 0px;
		color: var(--text);
	}
</style>
