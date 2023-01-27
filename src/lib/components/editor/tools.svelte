<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	import {
		Adjustments,
		DeviceDesktop,
		DeviceMobile,
		DeviceTablet,
		Plus,
		Stack
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
	let deviceSizes = [
		{
			name: 'desktop',
			Icon: DeviceDesktop
		},
		{
			name: 'tablet',
			Icon: DeviceTablet
		},
		{
			name: 'mobile',
			Icon: DeviceMobile
		}
	] as { name: deviceSizeType; Icon: any }[];
</script>

<div class="grid grid-cols-2 w-full my-4">
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
