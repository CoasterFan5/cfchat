<script lang="ts">
	/*
    This is used to display tool uses
    */
	export const {
		toolName
	}: {
		toolName: string;
	} = $props();
</script>

<div class="container">
	<div class="wrap">
		<div class="title">
			<span class="text">Using: <span class="toolName">{toolName}</span></span>
		</div>
	</div>
</div>

<style lang="scss">
	.container {
		display: flex;
		border-left: 1px solid var(--primary);
		padding-left: 0.25rem;
	}

	.title {
		display: flex;
		flex-direction: row;
	}

	.text {
		padding: 0 0.5rem;
		padding-right: 1rem;
		font-size: 0.9rem;
	}

	.toolName {
		background: var(--primary-10);
		padding: 0.1rem 0.25rem;
		border-radius: 0.25rem;
	}
</style>
