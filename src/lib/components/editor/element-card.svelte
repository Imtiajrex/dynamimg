<script lang="ts">
	// @ts-nocheck

	import { IconAlignCenter } from '@tabler/icons-svelte';
	import { asDroppable } from 'svelte-drag-and-drop-actions';
	import { addElement } from '$lib/utils/elements';
	import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';

	export let Icon = IconAlignCenter;
	let tool = getContext('active-tool-drawer') as Writable<string | null>;
	export let name = '';
	export let id = '';
	export let open = false;
	export let component = undefined;
	const insertElement = () => {
		if (open) {
			tool.set(id);
			return;
		}
		const canvas = document.getElementById('canvas') as HTMLElement;
		const canvasRect = canvas.getBoundingClientRect();
		const top = canvasRect.height / 2 + 'px';
		const left = canvasRect.width / 2 + 'px';
		addElement({
			elementID: id,
			style: {
				position: 'absolute',
				translate: left + ' ' + top,
				width: '400px'
			},
			component
		});

		tool.set(null);
	};
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class=" transition group hover:bg-primary select-none rounded-md bg-white p-3 w-24 h-24 flex flex-col justify-center items-center cursor-pointer"
	on:click={insertElement}
>
	<svelte:component
		this={Icon}
		size={name.length > 0 ? 25 : 35}
		class={' transition group-hover:text-white '}
	/>
	<div
		class="transition text-xs text-center font-semibold mt-2 group-hover:text-white whitespace-pre-wrap "
	>
		{name}
	</div>
</div>
