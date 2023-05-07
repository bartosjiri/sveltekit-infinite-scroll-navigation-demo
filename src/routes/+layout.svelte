<script>
	import { Navigation, isOpen } from '$lib/navigation';

	import '../styles/_global.scss';
</script>

<Navigation />

<button on:click={() => ($isOpen = !$isOpen)}>Toggle navigation</button>
<main>
	<slot />
</main>

<style lang="scss">
	main {
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	button {
		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: 1000;
	}
</style>
