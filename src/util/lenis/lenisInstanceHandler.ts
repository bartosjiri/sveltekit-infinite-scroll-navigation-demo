import { writable, get, type Writable } from 'svelte/store';
import Lenis from '@studio-freight/lenis';

export const initLenisInstance = (config: any = {}) => {
	const instance: Writable<Lenis | null> = writable(null);

	const requestFrame = (time: number) => {
		const targetInstance = get(instance);
		targetInstance?.raf(time);
		requestAnimationFrame(requestFrame);
	};

	const targetInstance = new Lenis(config);
	instance.set(targetInstance);
	requestFrame(0);

	return instance;
};

export default initLenisInstance;
