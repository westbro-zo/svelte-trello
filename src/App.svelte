<script>
	import Header from '~/components/Header.svelte';
	import ListContainer from '~/components/ListContainer.svelte';
	import { onMount } from "svelte";
	import { setUnsplashRandomImage } from '~/api';

	onMount(async () => {
		Object.assign(document.body.style, {
			backgroundColor: 'darkgray',
			backgroundSize: 'cover'
		})

		// setUnsplashRandomImage()
	});
</script>

<Header />
<ListContainer />