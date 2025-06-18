<script lang="ts">
	import NoLanguageIcon from '~icons/ph/code';
	import CopyIcon from '~icons/ph/copy';

	import PythonIcon from '~icons/devicon/python';
	import JSIcon from '~icons/devicon/javascript';
	import TypescriptIcon from '~icons/devicon/typescript';
	import HTMLIcon from '~icons/devicon/html5';
	import CSSIcon from '~icons/devicon/css3';
	import SQLIcon from '~icons/devicon/azuresqldatabase';
	import JavaIcon from '~icons/devicon/java';
	import CSharpIcon from '~icons/devicon/csharp';
	import RustIcon from '~icons/devicon/rust';

	import { codeToTokens, bundledLanguages, type BundledLanguage, type TokensResult } from 'shiki';
	import 'highlight.js/styles/atom-one-dark.css';
	import type { Component } from 'svelte';
	import type { SVGAttributes } from 'svelte/elements';
	import { toast } from '$lib/components/toaster/Toast.svelte';

	const getSupportedLanguage = (lang?: string | null) => {
		if (bundledLanguages[lang as BundledLanguage]) {
			return lang as BundledLanguage;
		} else {
			return 'typescript';
		}
	};

	type CustomIcon = Component<SVGAttributes<SVGSVGElement>>;

	const languageIconMap: Partial<Record<BundledLanguage, CustomIcon>> = {
		python: PythonIcon,
		javascript: JSIcon,
		typescript: TypescriptIcon,
		html: HTMLIcon,
		css: CSSIcon,
		sql: SQLIcon,
		java: JavaIcon,
		rust: RustIcon,
		csharp: CSharpIcon
	};

	const getLanguageIcon = (lang: string | undefined) => {
		if (lang && languageIconMap[lang as BundledLanguage]) {
			return languageIconMap[lang as BundledLanguage];
		}
		return NoLanguageIcon;
	};

	const {
		code,
		language,
		mountCallback
	}: {
		code: string;
		language?: string | null;
		mountCallback: () => void;
	} = $props();

	let tokens: TokensResult | undefined = $state(undefined);

	$effect(() => {
		codeToTokens(code, {
			lang: getSupportedLanguage(language),
			theme: 'vesper'
		}).then((v) => {
			tokens = v;
			mountCallback();
		});
	});

	const copyText = () => {
		navigator.clipboard.writeText(code);
		toast.toast(`Text Copied`);
	};
</script>

{#if tokens}
	{@const lang = tokens.grammarState?.lang}
	{@const Icon = getLanguageIcon(lang)}
	<div class="c" style="background: {tokens.bg}">
		<div class="toolbar">
			<span class="language">
				<Icon />
				<span class="name">{lang}</span>
			</span>
			<div class="tools">
				<button class="iconButton" onclick={copyText}>
					<CopyIcon />
				</button>
			</div>
		</div>
		<pre><code
				>{#each tokens.tokens as line, index (index)}{#each line as block, index (index)}<span
							style="color: {block.color}">{block.content}</span
						>{/each}<br />{/each}</code
			></pre>
	</div>
{/if}

<style lang="scss">
	.c {
		border-radius: 0.5rem;
		white-space: pre-line;
	}

	.toolbar {
		background: rgba(0, 0, 0, 0.3);
		border-radius: 0.5rem 0.5rem 0 0;
		padding: 0.25rem 0.25rem;
		padding-left: 1rem;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}

	pre {
		padding: 0.25rem 1rem;
		margin: 0;
		padding-bottom: 1rem;
		overflow-x: auto;
	}

	.language {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: start;
		gap: 0.5rem;
	}

	.tools {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: end;
	}

	.iconButton {
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 1/1;
		padding: 0.25rem;
		border-radius: 0.25rem;
		outline: 0px;
		border: 0px;
		font-size: 0.8rem;
		background: transparent;
		color: var(--text);
		cursor: pointer;
		transition: all cubic-bezier(0.455, 0.03, 0.515, 0.955) 0.1s;

		&:hover {
			background: var(--primary-10);
			color: var(--primary);
		}
	}
</style>
