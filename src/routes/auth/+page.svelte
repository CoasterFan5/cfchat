<script lang="ts">
	import GithubIcon from '~icons/ph/github-logo';
</script>

<div class="wrap">
	<div class="loginForm">
		<h2>Log In</h2>
		<p>Continue With:</p>
		<a class="loginLink" href="/auth/github">
			<div class="loginLinkInner">
				<div class="icon">
					<GithubIcon />
				</div>
				GitHub
			</div>
		</a>
		<!-- If I fix zero before this goes out.
		<a class="loginLink" href="/auth/zero">
			<div class="loginLinkInner">
				<div class="icon">0</div>
				CF Zero
			</div>
		</a>
		-->
	</div>
</div>

<style lang="scss">
	.wrap {
		display: flex;
		width: 100%;
		height: 100vh;
		padding: 1rem;
		padding-bottom: 20%;
		align-items: center;
		justify-content: center;
	}

	.loginForm {
		background: var(--secondary);
		border-radius: 0.25rem;
		padding: 1rem;
		width: 100%;
		max-width: 20rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;

		h2 {
			margin: 0;
		}

		p {
			margin: 0;
			opacity: 0.8;
			font-size: 0.8rem;
		}
	}

	.loginLink {
		width: 100%;
		background: var(--background);
		color: var(--text);
		padding: 0.25rem;
		text-decoration: none;
		border-radius: 0.5rem;
	}

	.loginLinkInner {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.25rem;
		border-radius: 0.25rem;
		position: relative;
		width: 100%;
		height: 100%;
	}

	.icon {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		aspect-ratio: 1/1;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--secondary);
		border-radius: 0.25rem;
	}
</style>
