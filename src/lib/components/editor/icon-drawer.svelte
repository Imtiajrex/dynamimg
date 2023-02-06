<script>
	//@ts-nocheck
	import { getIcons } from '$lib/utils/icons';
	import * as Icons from '@tabler/icons-svelte';
	import { onMount } from 'svelte';
	import Drawer from './drawer.svelte';

	import IntersectionObserver from 'svelte-intersection-observer';
	import ElementCard from './element-card.svelte';
	import Input from '../input.svelte';

	let icons = [];
	onMount(() => {
		icons = getIcons({});
	});
	let intersecting = false;
	$: if (intersecting) {
		loadMore();
	}
	const loadMore = () => {
		console.log('load more');
		icons = [...icons, ...getIcons({ offset: icons.length, search })];
	};
	export let show = false;
	let intersection;
	let search = '';
	$: if (search) {
		icons = getIcons({ search });
	}
</script>

{#if show}
	<Drawer className="top-0 left-0 max-w-sm rounded-r-xl overflow-auto ">
		<h3 class="text-xl">Icons</h3>
		<Input placeholder="Search For Icons" Icon={Icons.IconSearch} bind:value={search} />
		<div class="flex justify-between gap-3 flex-wrap mt-5">
			{#each icons as icon}
				<ElementCard Icon={Icons[icon]} id={'icon'} component={Icons[icon]} />
			{/each}
		</div>
		<IntersectionObserver element={intersection} bind:intersecting>
			<div bind:this={intersection} style="height:50px" />
		</IntersectionObserver>
	</Drawer>
{/if}
