<script lang="ts">
	import './element.css';
	import {
		type elementType,
		type hierarchyType,
		type customStyleType,
		type elementsKeyListType,
		addElement,
		getSelectedElement
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
		style: customStyleType;
		id: string;
	}>;
	let device = getContext('active-device-size') as Writable<'desktop' | 'mobile' | 'tablet'>;

	let containerWidth: number, containerHeight: number;
	let desktopStyler: HTMLElement;
	let tabletStyler: HTMLElement;
	let mobileStyler: HTMLElement;
	let elementComponent: HTMLElement;
	let editor: HTMLTextAreaElement;
	let canvas: HTMLElement;
	onMount(() => {
		editor = document.getElementById(`textarea_${id}`) as HTMLTextAreaElement;
		canvas = document.getElementById(`canvas`) as HTMLElement;
		if (canvas) {
			new ResizeObserver(getWidthHeight).observe(canvas);
		}
		elementComponent = document.getElementById(id) as HTMLElement;
		getWidthHeight();

		desktopStyler = document.getElementById(`style_desktop_${id}`) as HTMLElement;
		tabletStyler = document.getElementById(`style_tablet_${id}`) as HTMLElement;
		mobileStyler = document.getElementById(`style_mobile_${id}`) as HTMLElement;

		updateDeviceStyles();
	});
	const getWidthHeight = () => {
		elementComponent = document.getElementById(id) as HTMLElement;
		if (elementComponent) {
			containerWidth = elementComponent.getBoundingClientRect().width;
			containerHeight = elementComponent.getBoundingClientRect().height;
		}
	};

	let varStyle = '';
	let desktopStyle = '';
	const updateStyle = (css: string, device: any) => {
		const deviceElementMap = {
			desktop: desktopStyler,
			tablet: tabletStyler,
			mobile: mobileStyler
		} as { [key: string]: HTMLElement };
		const containerQuery = {
			tablet: `@container canvas (min-width: 501px) and (max-width: 768px){`,
			mobile: `@container canvas (max-width: 500px){`
		} as { [key: string]: string };

		const deviceElement = deviceElementMap[device];
		if (deviceElement) {
			let tag = `<style>
					${containerQuery[device] || ''}
						.${id}{
							${css}
						}
					${containerQuery[device] ? '}' : ''}
					</style>`;
			if (deviceElement.innerHTML !== tag && css.length > 0) {
				deviceElement.innerHTML = tag;
			}
		}
	};
	const updateDeviceStyles = () => {
		varStyle = '';
		['desktop', 'tablet', 'mobile'].forEach((device) => {
			const val = device as 'desktop' | 'tablet' | 'mobile';
			const { css, variables } = styleObjectToVariableBasedCss(style[val], `${id}-${device}`);

			varStyle += variables;
			updateStyle(css, device);
		});
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
			style[$device]['left'] = initialMargin.left + (x - initialPos.x) + 'px';
			style[$device]['top'] = initialMargin.top + (y - initialPos.y) + 'px';
		} else {
			moving = true;
			initialMargin.left = parseInt(String(style[$device]['left']).replace('px', ''));
			initialMargin.top = parseInt(String(style[$device]['top']).replace('px', ''));
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
</script>

<span class="h-0 opacity-0 absolute">
	<span id={`style_desktop_${id}`} />
	<span id={`style_tablet_${id}`} />
	<span id={`style_mobile_${id}`} />
</span>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<svelte:element
	this={Component}
	class={`${classname} ${id} element`}
	use:asDraggable={{
		onDragMove: moveElement,
		onlyFrom: '.handle',
		relativeTo: 'parent',
		onDragEnd: () => {
			movingElement.set([]);
			moving = false;
		}
	}}
	on:dragstart={startDrag}
	on:click={(e) => {
		$selectedElement.push(id);
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
		<textarea
			id={`textarea_${id}`}
			bind:value={content}
			disabled={!active}
			class="absolute top-0 left-0 w-full h-full {id}"
			style="margin:0;top:0;left:0;"
		/>
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
	}
	textarea:focus {
		outline: none;
	}
	.element {
		transition: 0.2s ease-in-out outline;
		outline: 1px solid transparent;
		position: relative;
		width: 100%;
		height: max-content;
	}
</style>
