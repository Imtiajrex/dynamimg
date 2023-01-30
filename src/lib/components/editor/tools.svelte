<script lang="ts">
	//@ts-nocheck
	import { htmlCompiler } from '$lib/utils/compilers';
	import { getElements, getSelectedElement } from '$lib/utils/elements';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { onMount } from 'svelte';

	import {
		Adjustments,
		Bold,
		DatabaseExport,
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
	import { attr } from 'svelte/internal';
	import { arrayEquals } from '$lib/utils/array';

	let activeTool = getContext('active-tool-drawer') as Writable<toolType>;

	let device = getContext('active-device-size') as Writable<deviceSizeType>;
	let adjustment = getContext('adjustments-active') as Writable<boolean>;
	onMount(() => {
		document.addEventListener('trix-selection-change', function (event) {
			const element = document.querySelector('trix-editor') as HTMLElement;
			const attr = element.editor.composition.currentAttributes;
			attributes.bold = attr.bold ?? false;
			attributes.italic = attr.italic ?? false;
			attributes.underline = attr.underline ?? false;
			attributes.orderedList = attr.orderedList ?? false;
			attributes.unorderedList = attr.unorderedList ?? false;
		});
	});
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
			command: 'number'
		},
		{
			name: 'Unordered List',
			Icon: List,
			command: 'bullet'
		}
	] as { name: string; Icon: any; command: string }[];
	let elements = getElements();
	let defaultAttributes = {
		bold: false,
		italic: false,
		underline: false,
		number: false,
		bullet: false,
		color: '',
		backgroundColor: ''
	};
	let attributes = { ...defaultAttributes };
	const executeCommand = (command: string) => {
		const element = document.querySelector('trix-editor') as HTMLElement;
		console.log(element.editor, command);
		if (attributes[command]) {
			element.editor.deactivateAttribute(command);
		} else {
			element.editor.activateAttribute(command);
		}
		attributes[command] = !attributes[command];
	};

	let selectedElement = getSelectedElement();
	let prevVal = [] as string[];
	selectedElement.subscribe((val) => {
		if (arrayEquals(val, prevVal)) return;
		attributes = { ...defaultAttributes };
		prevVal = [...val];
	});
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
		{#if $selectedElement.length > 0}
			{#each editorTools as tool}
				<ToolButton
					onClick={() => executeCommand(tool.command)}
					Icon={tool.Icon}
					active={attributes[tool.command]}
				/>
			{/each}
		{/if}
	</div>
	<div class="flex items-center gap-4 justify-end">
		<ToolButton
			onClick={() => {
				htmlCompiler({
					elements: $elements
				});
			}}
			Icon={DatabaseExport}
		/>
		<ToolButton
			onClick={() => {
				$adjustment = !$adjustment;
			}}
			Icon={Adjustments}
			active={$adjustment}
		/>
	</div>
</div>
