<script>
	import ChatInput from '$lib/components/ChatInput.svelte';
</script>

<div class="newChat">
	<div class="welcome">
		<h2>Hello</h2>
		<p>Let me know how I can help!</p>
	</div>
	<ChatInput />
</div>

<style>
	.newChat {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	.welcome {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		flex-grow: 1;

		h2 {
			margin: 0;
		}
	}
</style>
