<script lang="ts">
	import type { Component } from 'svelte';
	import type { SVGAttributes } from 'svelte/elements';
	import { fly } from 'svelte/transition';
	import GoogleLogo from '~icons/logos/google-icon';
	import OpenAILogo from '~icons/streamline-logos/openai-logo';
	import DropDownArrow from '~icons/ph/caret-down';
	import LoadingSpinner from '~icons/svg-spinners/ring-resize';

	let {
		currentModel = $bindable('gemini-2.5-flash'),
		threadId
	}: {
		currentModel: string;
		threadId?: string;
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
		'gemini-2.0-flash': {
			humanName: 'Gemini 2.0 Flash',
			modelName: 'gemini-2.0-flash',
			provider: 'google'
		},
		'gemini-2.5-flash': {
			humanName: 'Gemini 2.5 Flash',
			modelName: 'gemini-2.5-flash',
			provider: 'google'
		},
		'gpt-4.1-nano': {
			humanName: 'GPT 4.1 Nano',
			modelName: 'gpt-4.1-nano',
			provider: 'openai'
		},
		'gpt-4.1-mini': {
			humanName: 'GPT 4.1 Mini',
			modelName: 'gpt-4.1-mini',
			provider: 'openai'
		},
		'gpt-4o-mini': {
			humanName: 'GPT 4o Mini',
			modelName: 'gpt-4o-mini',
			provider: 'openai'
		}
	};

	let currentSelectionObject = $derived(models[currentModel] || models['gemini-2.5-flash']);

	let showingDropDown = $state(false);
	let loadingModel = $state(false);
	let CurrentIcon = $derived(iconMap[currentSelectionObject.provider]);

	const changeModel = async (name: string) => {
		const restorable = currentModel;
		currentModel = name;
		loadingModel = true;
		showingDropDown = false;

		const fr = await fetch('/api/setModel', {
			method: 'POST',
			body: JSON.stringify({
				modelName: name,
				threadId: threadId
			})
		});

		if (fr.status == 200) {
			loadingModel = false;
		} else {
			console.error(fr);
			loadingModel = false;
			currentModel = restorable;
		}
	};
</script>

<div class="wrap">
	<button
		class="modelButton currentModelButton"
		onclick={() => (showingDropDown = !showingDropDown)}
		type="button"
	>
		<div class="icon">
			{#if loadingModel}
				<LoadingSpinner />
			{:else}
				<CurrentIcon />
			{/if}
		</div>
		<span>{currentSelectionObject.humanName}</span>
		<div class="icon"><DropDownArrow /></div>
	</button>
	{#if showingDropDown}
		<div
			class="floatingPicker"
			transition:fly={{
				delay: 0,
				duration: 100,
				x: 0,
				y: 20
			}}
		>
			<div class="floatingPickerInnerWrap">
				<div class="floatingPickerInner">
					{#each Object.entries(models) as model, index (index)}
						{@const Icon = iconMap[model[1].provider]}
						<button
							type="button"
							class="modelButton modelDropDownButton"
							onclick={() => {
								changeModel(model[0]);
							}}
						>
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
		padding: 0 0.25rem;
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
