<script>
	import ChatInput from '$lib/components/ChatInput.svelte';
</script>

<div class="newChat">
	<div class="chatLog"></div>
	<ChatInput
		onPrompt={() => {
			console.log('a');
		}}
		createMode={true}
	/>
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

	.chatLog {
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
