<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	import { initLenisInstance } from '$util/lenis';

	import { isOpen } from './navigation.store';

	let containerRef: HTMLElement;
	let listRef: HTMLElement;
	let lenisInstance: any;
	let isStatic = false;

	const cloneList = () => {
		const cloneEl = listRef.cloneNode(true) as HTMLElement;
		cloneEl.classList.add('clone');
		containerRef.appendChild(cloneEl);
	};

	const setupNavigation = () => {
		if (typeof window === 'undefined' || !lenisInstance || !listRef || !$isOpen) return;

		if (listRef.clientHeight < window.innerHeight) {
			isStatic = true;
			if (!$lenisInstance.isStopped) $lenisInstance.stop();
		} else {
			isStatic = false;
			if ($lenisInstance.isStopped) $lenisInstance.start();
			$lenisInstance.scrollTo('top', { immediate: true });
		}
	};

	onMount(() => {
		if (!containerRef || !listRef) return;

		cloneList();
		lenisInstance = initLenisInstance({
			wrapper: containerRef,
			content: listRef,
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
	<ul bind:this={listRef}>
		{#each { length: 5 } as _, i}
			<li>Page {i + 1}</li>
		{/each}
	</ul>
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
