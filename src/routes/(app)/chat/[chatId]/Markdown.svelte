<script lang="ts">
	import { fromMarkdown } from 'mdast-util-from-markdown';
	import type {
		Node,
		Text,
		Strong,
		Emphasis,
		Paragraph,
		Code,
		ListItem,
		List,
		Heading,
		Link,
		Image,
		Blockquote
	} from 'mdast';
	import Codeblock from './Codeblock.svelte';
	const {
		markdown
	}: {
		markdown: string;
	} = $props();

	let root = $derived(fromMarkdown(markdown));

	//eslint-disable-next-line @typescript-eslint/no-explicit-any
	const renderers: Record<string, (token: any) => ReturnType<import('svelte').Snippet>> = {
		strong: strongRender,
		text: textrender,
		em: italicsRender,
		space: spaceRenderer,
		paragraph: paragraphRender,
		code: codeRender,
		inlineCode: inlineCodeRender,
		list: listRenderer,
		listItem: listItemRenderer,
		heading: headingRenderer,
		emphasis: emphasisRender,
		link: linkRenderer,
		image: imageRenderer,
		blockquote: blockQuoteRenderer,
		thematicBreak: thematicBreakRenderer
	};
</script>

{#snippet strongRender(node: Strong)}
	<strong>
		{#if node.children}
			{@render tokensRender(node.children)}
		{/if}
	</strong>
{/snippet}

{#snippet textrender(node: Text)}
	{node.value}
{/snippet}

{#snippet italicsRender(token: Emphasis)}
	<span style="font-style: italic;">
		{#if token.children}
			{@render tokensRender(token.children)}
		{/if}
	</span>
{/snippet}

{#snippet paragraphRender(node: Paragraph)}
	<p>
		{#if node.children}
			{@render tokensRender(node.children)}
		{/if}
	</p>
{/snippet}

{#snippet codeRender(node: Code)}
	<Codeblock code={node.value} language={node.lang} />
{/snippet}

{#snippet inlineCodeRender(node: Code)}
	<code>{node.value}</code>
{/snippet}

{#snippet spaceRenderer()}
	&NonBreakingSpace;
{/snippet}

{#snippet listRenderer(node: List)}
	{#if node.ordered}
		<ol>
			{#if node.children}
				{@render tokensRender(node.children)}
			{/if}
		</ol>
	{:else}
		<ul>
			{#if node.children}
				{@render tokensRender(node.children)}
			{/if}
		</ul>
	{/if}
{/snippet}

{#snippet listItemRenderer(node: ListItem)}
	<li>
		{#if node.children}
			{@render tokensRender(node.children)}
		{/if}
	</li>
{/snippet}

{#snippet headingRenderer(node: Heading)}
	{#if node.depth == 1}
		<h1>
			{@render tokensRender(node.children)}
		</h1>
	{:else if node.depth == 2}
		<h2>
			{@render tokensRender(node.children)}
		</h2>
	{:else if node.depth == 3}
		<h3>
			{@render tokensRender(node.children)}
		</h3>
	{:else if node.depth == 4}
		<h4>
			{@render tokensRender(node.children)}
		</h4>
	{:else if node.depth == 5}
		<h5>
			{@render tokensRender(node.children)}
		</h5>
	{:else if node.depth == 6}
		<h6>
			{@render tokensRender(node.children)}
		</h6>
	{/if}
{/snippet}

{#snippet emphasisRender(node: Emphasis)}
	<em>
		{#if node.children}
			{@render tokensRender(node.children)}
		{/if}
	</em>
{/snippet}

{#snippet linkRenderer(node: Link)}
	<a target="_blank" href={node.url}>
		{#if node.children}
			{@render tokensRender(node.children)}
		{/if}
	</a>
{/snippet}

{#snippet imageRenderer(node: Image)}
	<img src={node.url} alt={node.alt} />
{/snippet}

{#snippet blockQuoteRenderer(node: Blockquote)}
	<blockquote>
		{@render tokensRender(node.children)}
	</blockquote>
{/snippet}

{#snippet thematicBreakRenderer()}
	<hr />
{/snippet}

{#snippet tokensRender(nodes: Node[])}
	{#each nodes as node, index (index)}
		{@render tokenRender(node)}
	{/each}
{/snippet}

{#snippet tokenRender(node: Node)}
	{#if renderers[node.type]}
		{@render renderers[node.type](node)}
	{:else}
		<pre>{JSON.stringify(node, null, 4)}</pre>
	{/if}
{/snippet}

{@render tokensRender(root.children)}

<style lang="scss">
	code {
		padding: 0 0.25rem;
		background: #23272e;
		font-family: 'Geist Mono Variable', monospace;
	}

	img {
		width: 100%;
		background: var(--secondary);
	}
</style>
