import { cloneDeep } from 'lodash';
import { getContext, setContext } from 'svelte';
import { SvelteElement } from 'svelte/internal';
import { get, writable, type Writable } from 'svelte/store';
import { Container, CursorText, Heading, LayoutGrid } from 'tabler-icons-svelte';

export const elementsList = [
	{ Icon: Heading, name: 'Heading' },
	{ Icon: CursorText, name: 'Paragraph' },
	{ Icon: Container, name: 'Container' },
	{ Icon: LayoutGrid, name: 'Grid' }
] as { Icon: any; name: string }[];

export type elementsKeyListType = 'heading' | 'paragraph' | 'container' | 'grid';
export type hierarchyType = string[];
export type styleObjectType = {
	[key: string]: string | styleObjectType;
};
export type elementType = {
	name: string;
	Component: any;
	id: string;
	elementId: string;
	classname?: string;
	style: styleObjectType;
	content?: string;
	hierarchy: hierarchyType;
	children?: elementType[];
	childEnabled: boolean;
};
export type elementsType = Writable<elementType[]>;
const elements = writable<elementType[]>([]);
const selectedElement = writable<string[]>([]);
export const setSelectedElement = () => setContext('selected-element', selectedElement);
export const getSelectedElement: () => Writable<string[]> = () => getContext('selected-element');
type elementMapType = {
	[key in elementsKeyListType]: {
		name: string;
		Component: any;
		content?: string;
		style?: styleObjectType;
		classname?: string;
		childEnabled: boolean;
	};
};
const elementsMap = {
	heading: {
		name: 'Heading',
		Component: 'h1',
		content: 'This is a heading',
		childEnabled: false
	},
	paragraph: {
		name: 'Paragraph',
		Component: 'p',
		childEnabled: false,
		content: 'This is a paragraph. It is used to write large chunks of text.'
	},
	container: {
		name: 'Container',
		Component: 'div',
		childEnabled: true,
		classname: 'canvas-container'
	},
	grid: {
		name: 'Grid',
		Component: 'div',
		childEnabled: true,
		classname: 'canvas-grid'
	}
} as elementMapType;

export const getElements = () => getContext('elements');
export const setElements = () => setContext('elements', elements);

export const getElement = ({
	elements,
	hierarchy = []
}: {
	elements: elementType[];
	hierarchy: hierarchyType;
}) => {
	console.log(elements);
};
const usedIds = [] as string[];
const generateID = (): string => {
	let id = Math.random().toString(36).substring(2, 9);
	if (usedIds.includes(id)) id = generateID();
	usedIds.push(id);
	return id;
};
export const addElement = ({
	elementID,
	hierarchy = [],
	style
}: {
	elementID: elementsKeyListType;
	hierarchy?: hierarchyType;
	style?: styleObjectType;
}) => {
	const element = { ...elementsMap[elementID] } as elementType;
	element.id = elementID + '_' + generateID();
	element.elementId = elementID;
	element.hierarchy = [element.id];
	if (!element.style) element.style = {};
	else element.style = cloneDeep(element.style);
	if (style) {
		element.style = { ...element.style, ...style };
	}
	elements.update((elements) => {
		if (hierarchy.length == 0) return [...elements, element];
		else {
			const elementHierarchy = [...hierarchy, element.id];
			element.hierarchy = elementHierarchy;
			const foundElement = traverseElements(elements, hierarchy);

			if (foundElement)
				if (foundElement.children) foundElement.children.push(element);
				else foundElement.children = [element];
			console.log(elements);
			return elements;
		}
	});
};

const traverseElements = (elements: elementType[], hierarchy: hierarchyType = []) => {
	let foundElement;
	while (hierarchy.length > 0) {
		const id = hierarchy.shift();
		if (foundElement && foundElement.children)
			foundElement = foundElement.children.find((element) => element.id == id);
		else foundElement = elements.find((element) => element.id == id);
	}
	return foundElement;
};

export const assignElement = ({
	element,
	hierarchy = []
}: {
	element: elementType;
	hierarchy: hierarchyType;
}) => {
	console.log(element);
};
export const removeElement = ({ hierarchy }: { hierarchy: hierarchyType }) => {
	elements.update((elements) => {
		if (hierarchy.length == 1) {
			console.log(
				elements,
				hierarchy,
				elements.filter((element) => element.id !== hierarchy[0])
			);
			return elements.filter((element) => element.id !== hierarchy[0]);
		} else {
			const parentElement = traverseElements(elements, [...hierarchy.slice(0, -1)]);
			if (parentElement && parentElement.children && parentElement.children.length > 0) {
				parentElement.children = parentElement.children.filter(
					(element) => element.id !== hierarchy[hierarchy.length - 1]
				);
				return elements;
			}
			return elements;
		}
	});
};
