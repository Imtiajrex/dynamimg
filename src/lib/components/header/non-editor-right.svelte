<script>
	import { Bell, Help } from 'tabler-icons-svelte';

	export let menuLinkClass = '';
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<div class="flex items-center justify-end  gap-3">
	<a class={menuLinkClass}>
		<Help />
	</a>
	<a class={menuLinkClass}>
		<Bell />
	</a>
	<a class="cursor-pointer outline-4 outline-primary">
		<img src="https://i.pravatar.cc/50" class="w-10 h-10 rounded-full" />
	</a>
</div>
