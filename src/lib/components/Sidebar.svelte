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
	<h3 class="logo">CF CHAT</h3>
	<a href="/" class="createChat">
		<div class="createChatInnerWrap">
			<div class="createChatInner">Create Chat</div>
		</div>
	</a>
	<div class="threads">
		{#each threadList as thread (thread.id)}
			<a href="/chat/{thread.id}" class="threadLink">{thread.name}</a>
		{/each}
	</div>
	<div class="accountInfoWrap">
		<div class="accountInfoInnerBorderBackground">
			<div class="accountInfoInnerBorder">
				<div class="accountInfoInner">
					<span>Username</span>
					<span class="usage">0/100 Synapse</span>
				</div>
			</div>
		</div>
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
		position: relative;
	}

	.logo {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		margin: 0px;
		margin-bottom: 0.5rem;
		font-weight: 200;
	}

	.createChat {
		background: var(--background);
		opacity: 0.95;
		color: var(--text);
		text-align: center;
		width: 100%;
		text-decoration: none;
		border-radius: 0.5rem;
		font-size: 0.8rem;

		&:hover {
			opacity: 1;
			color: var(--primary);

			.createChatInnerWrap {
				background-image: linear-gradient(75deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.4));
			}
		}

		.createChatInnerWrap {
			background-image: linear-gradient(75deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3));
			padding: 1px;
			border-radius: 0.5rem;
			cursor: pointer;
			transition: all cubic-bezier(0.455, 0.03, 0.515, 0.955) 0.1s;

			.createChatInner {
				padding: 0.5rem;
				border-radius: calc(0.5rem - 1px);
				background: var(--background);
			}
		}
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

	.accountInfoWrap {
		position: absolute;
		bottom: 0px;
		left: 0px;
		width: 100%;
		padding: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;

		.accountInfoInnerBorderBackground {
			width: 100%;
			height: 100%;
			background: var(--background);
			display: flex;
			border-radius: 0.25rem;
		}

		.accountInfoInnerBorder {
			background-image: linear-gradient(75deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3));
			border-radius: 0.25rem;
			width: 100%;
			height: 100%;
			padding: 1px;
		}

		.accountInfoInner {
			background: var(--background);
			border-radius: calc(0.25rem - 1px);
			padding: 0.5rem;
			display: flex;
			flex-direction: column;

			.usage {
				opacity: 0.8;
				font-size: 0.8rem;
			}
		}
	}
</style>
