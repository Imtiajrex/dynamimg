<script lang="ts">
	//@ts-nocheck
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	import {
		Adjustments,
		Bold,
		DeviceDesktop,
		DeviceMobile,
		DeviceTablet,
		Italic,
		List,
		ListNumbers,
		Plus,
		Stack,
		Underline
	} from 'tabler-icons-svelte';
	import type { deviceSizeType } from '../types/editor/deviceSizeType';
	import type { toolType } from '../types/editor/toolType';
	import ToolButton from './tool-button.svelte';
	let activeTool = getContext('active-tool-drawer') as Writable<toolType>;

	let device = getContext('active-device-size') as Writable<deviceSizeType>;
	let adjustment = getContext('adjustments-active') as Writable<boolean>;
	const tools = [
		{
			name: 'Add Elements',
			id: 'add',
			Icon: Plus
		},
		{
			name: 'Layers',
			id: 'layer',
			Icon: Stack
		}
	] as { name: string; id: toolType; Icon: any }[];
	let editorTools = [
		{
			name: 'bold',
			Icon: Bold,
			command: 'bold'
		},
		{
			name: 'italic',
			Icon: Italic,
			command: 'italic'
		},
		{
			name: 'underline',
			Icon: Underline,
			command: 'underline'
		},
		{
			name: 'Ordered List',
			Icon: ListNumbers,
			command: 'insertOrderedList'
		},
		{
			name: 'Unordered List',
			Icon: List,
			command: 'insertUnorderedList'
		}
	] as { name: string; Icon: any; command: string }[];
</script>

<div class="grid grid-cols-3 w-full my-4">
	<div class="flex items-center gap-2">
		{#each tools as tool}
			<ToolButton
				onClick={() => {
					$activeTool = $activeTool != tool.id ? tool.id : null;
				}}
				Icon={tool.Icon}
				active={$activeTool == tool.id}
			/>
		{/each}
	</div>
	<div class="flex items-center justify-center gap-2">
		{#each editorTools as tool}
			<ToolButton
				onClick={() => {
					document.execCommand(tool.command, false, null);
				}}
				Icon={tool.Icon}
				active={false}
			/>
		{/each}
	</div>
	<div class="flex items-center gap-4 justify-end">
		<ToolButton
			onClick={() => {
				$adjustment = !$adjustment;
			}}
			Icon={Adjustments}
			active={$adjustment}
		/>
	</div>
</div>
