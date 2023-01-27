<script lang="ts">
	import './element.css';
	import {
		type elementType,
		type hierarchyType,
		type elementsKeyListType,
		addElement,
		getSelectedElement,
		type styleObjectType
	} from '$lib/utils/elements';
	import { getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import Resizer from './resizer.svelte';
	import * as _ from 'lodash';
	import { styleObjectToVariableBasedCss } from '$lib/utils/styleCompiler';
	import { asDraggable, asDropZone } from 'svelte-drag-and-drop-actions';
	import { cloneDeep } from 'lodash';
	let selectedElement = getSelectedElement();
	export let element: elementType;
	let {
		name,
		Component,
		id,
		elementId,
		style,
		classname,
		childEnabled,
		hierarchy,
		children,
		content
	} = element;

	let customStyleContext = getContext('custom-style') as Writable<{
		style: styleObjectType;
		id: string;
	}>;
	let device = getContext('active-device-size') as Writable<'desktop' | 'mobile' | 'tablet'>;

	let containerWidth: number, containerHeight: number;
	let desktopStyler: HTMLElement;
	let elementComponent: HTMLElement;
	let editor: HTMLTextAreaElement;
	let canvas: HTMLElement;
	let canvasRect: DOMRect;
	let isCtrlPressed = getContext('is-ctrl-pressed') as any;
	onMount(() => {
		editor = document.getElementById(`textarea_${id}`) as HTMLTextAreaElement;
		canvas = document.getElementById(`canvas`) as HTMLElement;
		canvasRect = canvas.getBoundingClientRect();

		elementComponent = document.getElementById(id) as HTMLElement;
		containerWidth = elementComponent.getBoundingClientRect().width;
		containerHeight = elementComponent.getBoundingClientRect().height;
		desktopStyler = document.getElementById(`style_desktop_${id}`) as HTMLElement;

		updateDeviceStyles();
	});

	let varStyle = '';
	const updateStyle = (css: string, device: any) => {
		let deviceElement = desktopStyler;
		if (deviceElement) {
			let tag = `<style>
						.${id}{
							${css}
						}
					</style>`;
			if (deviceElement.innerHTML !== tag && css.length > 0) {
				deviceElement.innerHTML = tag;
			}
		}
	};
	const updateDeviceStyles = () => {
		varStyle = '';
		const { css, variables } = styleObjectToVariableBasedCss(style, id);

		varStyle += variables;
		updateStyle(css, device);
	};
	$: {
		if (style) updateDeviceStyles();
	}
	$: active = $selectedElement.includes(id);
	let movingElement = getContext('moving-element') as Writable<hierarchyType>;
	const contentfulElement = ['heading', 'paragraph'];
	let tool = getContext('active-tool-drawer') as Writable<string | null>;

	let isHovering = false;
	let moving = false;
	const startDrag = () => {
		movingElement.set(hierarchy);
	};
	let initialMargin = {
			top: 0,
			left: 0
		},
		initialPos = { x: 0, y: 0 };
	const moveElement = (x: number, y: number) => {
		if (moving) {
			style['left'] = initialMargin.left + ((x - initialPos.x) / canvasRect.width) * 100 + '%';
			style['top'] = initialMargin.top + ((y - initialPos.y) / canvasRect.height) * 100 + '%';
		} else {
			moving = true;
			initialMargin.left = parseInt(String(style['left']).replace('%', ''));
			initialMargin.top = parseInt(String(style['top']).replace('%', ''));
			initialMargin.top = isNaN(initialMargin.top) ? 0 : initialMargin.top;
			initialMargin.left = isNaN(initialMargin.left) ? 0 : initialMargin.left;
			initialPos = {
				x: x,
				y: y
			};
		}
	};
	let childMoving = false;
	const checkArrayEquals = (arr1: any[], arr2: any[]) => {
		return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
	};
	const checkChildMoving = (val: hierarchyType) => {
		const droppedHierarchy = cloneDeep(val);
		droppedHierarchy.pop();
		if (droppedHierarchy.length === 0) {
			childMoving = false;
			return;
		}
		console.log(droppedHierarchy, hierarchy);

		childMoving = checkArrayEquals(droppedHierarchy, hierarchy);
	};
	movingElement.subscribe((val) => {
		checkChildMoving(val);
	});
	let edit = false;
	$: {
		if (!$selectedElement.includes(id)) {
			edit = false;
		}
	}
</script>

<span class="h-0 opacity-0 absolute">
	<span id={`style_desktop_${id}`} />
</span>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<svelte:element
	this={Component}
	class={`${classname} ${id} element`}
	use:asDraggable={{
		onDragMove: moveElement,
		neverFrom: '.never',
		relativeTo: 'parent',
		onDragEnd: () => {
			movingElement.set([]);
			moving = false;
		}
	}}
	on:dragstart={startDrag}
	on:click={(e) => {
		if (active) {
			edit = true;
		}
		if (isCtrlPressed.get()) {
			$selectedElement = [...$selectedElement, id];
		} else {
			$selectedElement = [id];
		}
		customStyleContext.set({ style, id });
		e.stopPropagation();
	}}
	on:mouseover|stopPropagation={() => (isHovering = true)}
	on:mouseout|stopPropagation={() => (isHovering = false)}
	style={`${varStyle}${isHovering ? 'outline: 1px solid seagreen;' : ''}${
		active && 'z-index:9999'
	} user-select: none;`}
	{id}
>
	<slot />
	{#if contentfulElement.includes(elementId)}
		{content}
		{#if edit}
			<textarea
				id={`textarea_${id}`}
				bind:value={content}
				disabled={!active}
				class="absolute top-0 left-0 w-full h-full {id}"
				style="margin:0;top:0;left:0;"
				autocomplete="off"
				autocorrect="off"
				spellcheck="false"
			/>
		{/if}
	{:else if !children || (children && children.length == 0)}
		{name}
	{/if}
	{#if active}
		<Resizer bind:style bind:containerWidth bind:containerHeight {hierarchy} />
	{/if}
</svelte:element>

<style>
	textarea {
		position: absolute !important;
		border: none;
		width: 100%;
		height: 100%;
		resize: none;
		overflow: hidden;
		background-color: transparent;
		transform: translate(0, 0);
	}
	textarea:focus {
		outline: none;
	}
	.element {
		transition: 0.2s ease-in-out outline;
		outline: 1px solid transparent;
		width: 100%;
	}
</style>
