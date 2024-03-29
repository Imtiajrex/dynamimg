<script lang="ts">
	//@ts-nocheck
	import { htmlCompiler } from '$lib/utils/compilers';
	import { getElements, getSelectedElement } from '$lib/utils/elements';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { onMount } from 'svelte';

	import {
		IconAdjustments,
		IconAlignCenter,
		IconAlignLeft,
		IconAlignRight,
		IconBold,
		IconColorPicker,
		IconDatabaseExport,
		IconItalic,
		IconList,
		IconListNumbers,
		IconPlus,
		IconStack,
		IconUnderline
	} from '@tabler/icons-svelte';
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
			Icon: IconPlus
		},
		{
			name: 'Layers',
			id: 'layer',
			Icon: IconStack
		}
	] as { name: string; id: toolType; Icon: any }[];
	let editorTools = [
		{
			name: 'bold',
			Icon: IconBold,
			command: 'bold'
		},
		{
			name: 'italic',
			Icon: IconItalic,
			command: 'italic'
		},
		{
			name: 'underline',
			Icon: IconUnderline,
			command: 'underline'
		},
		{
			name: 'Ordered List',
			Icon: IconListNumbers,
			command: 'number'
		},
		{
			name: 'Unordered List',
			Icon: IconList,
			command: 'bullet'
		},
		{
			name: 'Align Left',
			Icon: IconAlignLeft,
			command: 'textAlign',
			val: 'left'
		},
		{
			name: 'Align Center',
			Icon: IconAlignCenter,
			command: 'textAlign',
			val: 'center'
		},
		{
			name: 'Align Right',
			Icon: IconAlignRight,
			command: 'textAlign',
			val: 'right'
		}
	] as { name: string; Icon: any; command: string; val: string }[];
	let elements = getElements();
	let defaultAttributes = {
		bold: false,
		italic: false,
		underline: false,
		number: false,
		bullet: false,
		color: '',
		backgroundColor: '',
		fontSize: '',
		fontFamily: ''
	};
	let attributes = { ...defaultAttributes };
	const executeCommand = (command: string, value?: string) => {
		const element = document.querySelector('trix-editor') as HTMLElement;
		console.log(element.editor, command);
		if (attributes[command]) {
			element.editor.deactivateAttribute(command);
		} else {
			if (value) {
				element.editor.activateAttribute(command, value);
			} else element.editor.activateAttribute(command);
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
	const handleColorChange = (e: any, attribute: string) => {
		executeCommand(attribute, e.target.value);
	};
	const fontSizes = Array.from(Array(125).keys()).map((i) => i + 10);
	const handleFontSize = (e: any) => {
		executeCommand('fontSize', e.target.value);
	};
	const handleAlignMent = (dir: string) => {
		executeCommand('textAlign', dir);
	};
</script>

<div class="flex justify-between items-center w-full my-4 h-9 ">
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
	<div class="flex items-center justify-center grid-flow-row gap-2" id="toolbar">
		{#if $selectedElement.length > 0}
			<select class="select min-h-0 h-8" on:change={handleFontSize}>
				<option disabled selected>Font Size</option>
				{#each fontSizes as size}
					<option value={size + 'px'}>{size}</option>
				{/each}
			</select>
			<input
				type="color"
				class="w-8 h-8"
				on:change={(e) => {
					handleColorChange(e, 'backgroundColor');
				}}
			/>
			<input
				type="color"
				class="w-8 h-8"
				on:change={(e) => {
					handleColorChange(e, 'color');
				}}
			/>
			{#each editorTools as tool}
				<ToolButton
					onClick={() => executeCommand(tool.command, tool.val)}
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
			Icon={IconDatabaseExport}
		/>
		<ToolButton
			onClick={() => {
				$adjustment = !$adjustment;
			}}
			Icon={IconAdjustments}
			active={$adjustment}
		/>
	</div>
</div>
