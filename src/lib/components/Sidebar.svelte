<script lang="ts">
	const {
		threadList
	}: {
		threadList: {
			id: string;
			name: string;
		}[];
	} = $props();
</script>

<nav class="sidebar">
	<h3 class="logo">CF Chat</h3>
	<a href="/" class="createChat"> Create Chat </a>
	{#each threadList as thread (thread.id)}
		<a href="/chat/{thread.id}">{thread.name}</a>
	{/each}
</nav>

<style lang="scss">
	.sidebar {
		width: 15rem;
		background: var(--secondary);
		height: 100vh;
		padding: 1rem;
		display: flex;
		flex-direction: column;
	}

	.logo {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		margin: 0px;
		margin-bottom: 0.5rem;
	}

	.createChat {
		background: var(--primary-10);
		border: 1px solid var(--primary);
		color: var(--text);
		text-align: center;
		width: 100%;
		text-decoration: none;
		padding: 0.5rem;
		border-radius: 0.5rem;
		font-size: 0.8rem;
	}
</style>
