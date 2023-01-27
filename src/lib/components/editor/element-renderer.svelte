<script lang="ts">
	import type { elementType } from '$lib/utils/elements';
	import Element from './element.svelte';
	export let elements: elementType[];
</script>

{#if elements}
	{#each elements as element, idx (element.id)}
		<Element bind:element>
			<svelte:self bind:elements={element.children} />
		</Element>
	{/each}
{/if}
