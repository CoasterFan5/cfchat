<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { getUserContext, setUserContext } from '$lib/contex.svelte';

	const { children, data } = $props();

	setUserContext();
	const ctx = getUserContext();
	ctx.messageLimit = data.user.messageLimit;
	ctx.messagesSent = data.user.messagesSent;
	ctx.threadList = data.threadList;
</script>

<div class="wrap">
	<Sidebar username={data.user?.name} />
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
