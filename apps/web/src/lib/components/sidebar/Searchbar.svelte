<script lang="ts">
	import SearchIcon from '~icons/ph/magnifying-glass';

	let {
		value = $bindable()
	}: {
		value: string;
	} = $props();
</script>

<label class="wrap">
	<span class="icon">
		<SearchIcon />
	</span>
	<input placeholder="Search" bind:value />
</label>

<style lang="scss">
	.wrap {
		box-sizing: border-box;
		margin-top: 0.5rem;
		margin-bottom: 0rem;
		border-bottom: 1px solid var(--text-50);
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		cursor: text;

		&:focus-within {
			.icon {
				color: var(--primary);
			}
		}
	}

	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.25s;
	}

	input {
		padding: 0px;
		background: transparent;
		color: var(--text);
		width: 100%;
		border: 0px;
		outline: 0px;
		font-size: 1rem;
		padding: 0.25rem 0.5rem;
	}
</style>
