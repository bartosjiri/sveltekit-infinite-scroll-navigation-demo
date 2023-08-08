<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	import { initLenisInstance } from '$util/lenis';

	import { isOpen } from './navigation.store';

	let containerRef: HTMLElement;
	let listRefs: HTMLElement[] = [];
	let lenisInstance: any;
	let isStatic = false;

	const setupNavigation = () => {
		if (typeof window === 'undefined' || !lenisInstance || !listRefs.length || !$isOpen) return;

		if (listRefs[0].clientHeight < window.innerHeight) {
			isStatic = true;
			if (!$lenisInstance.isStopped) $lenisInstance.stop();
		} else {
			isStatic = false;
			if ($lenisInstance.isStopped) $lenisInstance.start();
			$lenisInstance.scrollTo('top', { immediate: true });
		}
	};

	onMount(() => {
		if (!containerRef || !listRefs.length) return;
		lenisInstance = initLenisInstance({
			wrapper: containerRef,
			content: listRefs[0],
			infinite: true
		});
	});

	onDestroy(() => {
		if ($lenisInstance) $lenisInstance.destroy();
	});

	$: if ($isOpen) {
		setupNavigation();
	}
	$: if (!$isOpen) $lenisInstance?.stop();
</script>

<svelte:window on:resize={setupNavigation} />
<nav
	bind:this={containerRef}
	class:navigation={true}
	class:lenis-hide-scrollbar={true}
	class:is-open={$isOpen}
	class:is-static={isStatic}
>
	{#each Array.from({ length: 2 }) as _, listIndex}
		<ul bind:this={listRefs[listIndex]} class:clone={listIndex === 1} >
			{#each { length: 5 } as _, itemIndex}
				<li>Page {itemIndex + 1}</li>
			{/each}
		</ul>
	{/each}
</nav>

<style lang="scss">
	.navigation {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 0;
		background: #ccc;
		z-index: 999;
		overflow-y: scroll;
		transition: height 0.3s ease-in-out;

		:global(.clone) {
			height: 100vh;
			overflow: hidden;
		}

		&.is-open {
			height: 100vh;
		}

		&.is-static {
			display: flex;
			flex-direction: column;
			justify-content: center;

			:global(.clone) {
				display: none;
			}
		}

		ul {
			padding: 0 3rem;

			li {
				display: flex;
				font-size: 12vw;
				line-height: 1;
				text-transform: uppercase;
				color: #999;
				cursor: pointer;

				&:hover {
					color: #000;
				}
			}
		}
	}
</style>
