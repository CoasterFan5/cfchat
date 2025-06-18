<script lang="ts">
	import Sidebar from '$lib/components/sidebar/Sidebar.svelte';
	import Toaster from '$lib/components/toaster/Toaster.svelte';
	import { getUserContext, setUserContext } from '$lib/context.svelte';

	const { children, data } = $props();

	setUserContext();
	const ctx = getUserContext();
	ctx.messageLimit = data.user.messageLimit;
	ctx.messagesSent = data.user.messagesSent;
	ctx.threadList = data.threadList;
</script>

<div class="wrap">
	<Sidebar username={data.user?.name} />
	<Toaster />
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
