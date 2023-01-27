<script lang="ts">
	// @ts-nocheck

	import { AlignCenter } from 'tabler-icons-svelte';
	import { asDroppable } from 'svelte-drag-and-drop-actions';
	import { addElement } from '$lib/utils/elements';
	import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';

	export let Icon = AlignCenter;
	let tool = getContext('active-tool-drawer') as Writable<string | null>;
	export let name = '';
	const id = name.toLowerCase().replace(' ', '-');
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class=" transition group hover:bg-primary select-none rounded-md bg-white p-3 w-24 h-24 flex flex-col justify-center items-center cursor-pointer active:cursor-move"
	use:asDroppable={{
		DataToOffer: { element: id },
		Operations: 'copy'
	}}
	on:click={() => {
		addElement({
			elementID: id,
			style: {
				top: '50%',
				left: '50%',
				position: 'absolute',
				'max-width': '500px',
				transform: 'translate(-50%, -50%)'
			}
		});

		tool.set(null);
	}}
>
	<Icon size={25} class={' transition group-hover:text-white '} />
	<div class="transition text-xs text-center font-semibold mt-2 group-hover:text-white  ">
		{name}
	</div>
</div>
