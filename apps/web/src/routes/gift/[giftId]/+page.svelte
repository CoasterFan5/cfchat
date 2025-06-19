<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import type { PageData } from './$types';
	import { enhance } from '$app/forms';
	import { toast } from '$lib/components/toaster/Toast.svelte';
	import { goto } from '$app/navigation';

	const {
		data
	}: {
		data: PageData;
	} = $props();
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="wrap">
	<div class="giftWrap">
		<div class="gift">
			<h2>A Wild Gift! <span class="uses">({data.gift.uses} uses)</span></h2>
			<p>
				This gift contains an additional <span class="messageCount"
					>{data.gift.messageCount} messages!</span
				>
			</p>
			<form
				class="buttons"
				method="post"
				action="?/claimGift"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type == 'error') {
							toast.error(result.error);
						}
						toast.toast('Gift Claimed!');
						goto('/', {
							invalidateAll: true
						});
					};
				}}
			>
				<Button variation="primary" type="submit">Claim</Button>
			</form>
		</div>
	</div>
</div>

<style lang="scss">
	.wrap {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100vh;
	}

	.giftWrap {
		background: var(--secondary);
		background-image: linear-gradient(-15deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.2));
		padding: 1px;
		border-radius: 0.5rem;
	}

	.gift {
		width: 100%;
		height: 100%;
		background: var(--secondary);
		display: flex;
		border-radius: calc(0.5rem - 1px);
		padding: 1rem;
		flex-direction: column;
	}

	h2 {
		margin: 0;
	}

	.uses {
		color: var(--text-50);
		font-weight: 400;
	}

	p {
		color: var(--text-50);
	}

	.messageCount {
		color: var(--text);
	}

	.buttons {
		display: flex;
		flex-direction: row;
		width: 100%;
		align-items: center;
		justify-content: end;
	}
</style>
