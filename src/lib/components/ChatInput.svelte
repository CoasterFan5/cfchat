<div class="wrap">
	<div class="inner">
		<textarea class="textInput" placeholder="Ask Anything"></textarea>
		<div class="bottomBar">
			<div class="optionHolder">
				<button> Search </button>
				<button> Files </button>
			</div>
			<div class="submit">
				<button> Go </button>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.wrap {
		padding: 0.25rem 0.25rem 0 0.25rem;
		border-radius: 0.5rem 0.5rem 0 0;
		background: var(--secondary);
		width: 50ch;
		max-width: 100%;
	}

	.inner {
		background: var(--background);
		border-radius: 0.25rem 0.25rem 0 0;
		padding: 0.5rem;
	}

	.textInput {
		all: unset;
		width: 100%;
	}

	.optionHolder {
		flex-grow: 1;
	}

	.bottomBar {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-betweenpace;
	}
</style>
