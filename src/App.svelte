<script>
	import Header from '~/components/Header.svelte';
	import { onMount } from "svelte";

	onMount(async () => {
		fetch("https://api.unsplash.com/photos/random?client_id=3nqwVq8pU9DMo1p0-W_6jrMnawq84xoo3RGuemcMByA")
		.then(response => response.json())
		.then(data => {
			setBackgrounImage(data.urls.regular);
		}).catch(error => {
			console.log(error);
			return [];
		});
	});

	function setBackgrounImage(src) {
		console.log('src', src)
		Object.assign(document.body.style, {
			backgroundColor: 'darkgray',
			backgroundImage: `url(${src})`,
			backgroundSize: 'cover'
		})
	}

</script>

<Header />