<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';

	const { children, data } = $props();
</script>

<div class="wrap">
	<Sidebar threadList={data.threadList} />
	<div class="content">
		{@render children?.()}
	</div>
</div>

<style lang="scss">
	.wrap {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
	}

	.content {
		height: 100vh;
		width: 100%;
		overflow-y: auto;
	}
</style>
