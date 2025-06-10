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
	<div class="threads">
		{#each threadList as thread (thread.id)}
			<a href="/chat/{thread.id}" class="threadLink">{thread.name}</a>
		{/each}
	</div>
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

	.threadLink {
		text-decoration: none;
		color: var(--text);
		width: 100%;
		padding: 0.25rem;
		border-radius: 0.25rem;
		opacity: 0.8;
		transition: all cubic-bezier(0.455, 0.03, 0.515, 0.955) 0.1s;
		overflow-x: hidden;
		text-overflow: ellipsis;
		text-wrap-mode: nowrap;
		min-height: 2rem;

		&:hover {
			opacity: 1;
			background: var(--primary-10);
		}
	}

	.threads {
		display: flex;
		flex-direction: column;
		align-items: start;
		justify-content: start;
		height: 100%;
		flex-grow: 1;
		gap: 0.25rem;
		margin-top: 1rem;
		overflow-y: auto;
	}
</style>
