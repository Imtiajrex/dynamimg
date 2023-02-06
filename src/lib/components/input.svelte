<script lang="ts">
	import { IconSearch } from '@tabler/icons-svelte';
	export let placeholder = 'Search…';
	export let Icon: any;
	export let handleChange = () => {};
	export let value: string;
</script>

<div class="form-control">
	<div class="input-group w-full">
		<input bind:value type="text" {placeholder} class="input  w-full" on:change={handleChange} />
		{#if Icon}
			<button class="btn btn-square">
				<Icon />
			</button>
		{/if}
	</div>
</div>
