<script>
	import Header from '$lib/components/header/header.svelte';
	import '../../app.css';
</script>

<div class=" max-w-7xl p-5 w-full mx-auto min-h-screen text-black bg-bg">
	<Header />
	<slot />
</div>
