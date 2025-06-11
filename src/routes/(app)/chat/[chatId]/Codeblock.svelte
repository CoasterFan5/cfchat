<script lang="ts">
	/* eslint-disable svelte/no-at-html-tags */

	import hljs from 'highlight.js/lib/common';
	import 'highlight.js/styles/atom-one-dark.css';

	const {
		code,
		language
	}: {
		code: string;
		language?: string | null;
	} = $props();

	let hl = $derived(
		hljs.highlight(code, {
			language: language || 'python'
		}).value
	);
</script>

<pre><code>{@html hl}</code></pre>

<style lang="scss">
	pre {
		background: #23272e;
		padding: 1rem;
		border-radius: 0.5rem;
	}
</style>
