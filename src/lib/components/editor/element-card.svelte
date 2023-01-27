<script>
	// @ts-nocheck

	import { AlignCenter } from 'tabler-icons-svelte';
	import { asDroppable } from 'svelte-drag-and-drop-actions';

	export let Icon = AlignCenter;
	export let name = '';
	const id = name.toLowerCase().replace(' ', '-');
	function onDragStart() {}
	function onDragMove(x, y, dx, dy) {}
	function onDragEnd() {}
</script>

<div
	class=" transition group hover:bg-primary select-none rounded-md bg-white p-3 w-24 h-24 flex flex-col justify-center items-center cursor-move"
	use:asDroppable={{
		DataToOffer: { element: id },
		Operations: 'copy',
		onDragStart,
		onDragMove,
		onDragEnd
	}}
>
	<Icon size={25} class={' transition group-hover:text-white '} />
	<div class="transition text-xs text-center font-semibold mt-2 group-hover:text-white  ">
		{name}
	</div>
</div>
