<script lang="ts">
	import {
		removeElement,
		type styleObjectType as objectStyleType,
		type hierarchyType
	} from '$lib/utils/elements';

	import { asDraggable } from 'svelte-drag-and-drop-actions';
	/**** map all touch events to mouse events ****/

	import mapTouchToMouseFor from 'svelte-touch-to-mouse';
	import type { Writable } from 'svelte/store';
	import { getContext, onMount } from 'svelte';
	import { DragDrop, Rotate, Trash } from 'tabler-icons-svelte';

	export let containerWidth: number, containerHeight: number;
	export let style: objectStyleType;

	let resizing = false;
	let paddingResizing = false;
	export let hierarchy = [] as hierarchyType;
	let initialX: number, initialY: number, initialWidth: number, initialHeight: number;

	mapTouchToMouseFor('.resizer');

	let device = getContext('active-device-size') as Writable<'desktop' | 'mobile' | 'tablet'>;

	/**** Svelte Event Handling ****/
	type paddingTypes = 'top' | 'right' | 'bottom' | 'left' | 'all';

	function onDragResize(x: number, y: number, dir: paddingTypes) {
		if (resizing) {
			if (dir == 'top' || dir == 'bottom' || dir == 'all') {
				const height = initialHeight + (y - initialY) * (dir == 'top' ? -1 : 1);
				containerHeight = height;
				style['min-height'] = height + 'px';
			}
			if (dir == 'left' || dir == 'right' || dir == 'all') {
				const width = initialWidth + (x - initialX) * (dir == 'left' ? -1 : 1);
				containerWidth = width;
				style['max-width'] = width + 'px';
			}
			console.log(
				`x: ${x}, y: ${y}, initialX: ${initialX}, initialY: ${initialY}, initialWidth: ${initialWidth}, initialHeight: ${initialHeight}`
			);
		} else {
			initialX = x;
			initialY = y;
			initialWidth = containerWidth;
			initialHeight = containerHeight;
			resizing = true;
		}
	}
	function onDragEnd() {
		resizing = false;
		paddingResizing = false;
	}
	const dir = ['top', 'right', 'bottom', 'left', 'all'] as paddingTypes[];
	const dirClassResizer = {
		top: 'bg-accent top-0 left-0 w-full h-0.5',
		right: 'bg-accent top-0 right-0 w-0.5 h-full',
		bottom: 'bg-accent left-0 bottom-0  w-full h-0.5',
		left: 'bg-accent top-0 left-0 w-0.5 h-full',
		all: 'bg-white border-2 border-solid border-black -bottom-0.5 -right-0.5 w-4 h-4 rounded-full'
	};
	const cursorClass = {
		top: 'cursor-n-resize',
		right: 'cursor-e-resize',
		bottom: 'cursor-s-resize',
		left: 'cursor-w-resize',
		all: 'cursor-se-resize'
	} as { [key in paddingTypes]: string };

	const remove = () => {
		removeElement({
			hierarchy
		});
	};
	let rotating = false;
	const rotate = () => {};
	export let canvasSize = { width: 0, height: 0 };
</script>

{#each dir as d}
	<div
		class="resizer absolute {dirClassResizer[d]} {cursorClass[d]}"
		use:asDraggable={{
			onDragMove: (x, y) => onDragResize(x, y, d),
			onDragEnd,
			relativeTo: 'parent'
		}}
	/>
{/each}
<button
	class="w-6 h-6 rounded-lg bg-red-700 shadow-sm flex justify-center items-center absolute top-1 right-1 text-white"
	on:click={remove}
>
	<Trash size={18} />
</button>

<div class="absolute -bottom-10 left-1/2 flex items-center gap-3">
	<button
		class="handle w-6 h-6 rounded-full cursor-move bg-white shadow-lg flex justify-center items-center  text-black"
	>
		<DragDrop size={15} />
	</button>

	<button
		on:drag|preventDefault|stopPropagation={(e) => {}}
		class="never w-6 h-6 rounded-full cursor-grab active:cursor-grabbing active:outline-1 outline-black active:outline bg-white shadow-lg flex justify-center items-center text-black"
	>
		<Rotate size={15} />
	</button>
</div>

<style>
	button,
	div {
		z-index: 999;
	}
</style>
