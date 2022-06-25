<script>
	import Header from '~/components/Header.svelte';
	import { onMount } from "svelte";

	onMount(async () => {
		setBackgrounImage();
	});

	document.body.addEventListener('click', setBackgrounImage, true); 

	function setBackgrounImage() {
		fetch("https://api.unsplash.com/photos/random?client_id=3nqwVq8pU9DMo1p0-W_6jrMnawq84xoo3RGuemcMByA")
		.then(response => response.json())
		.then(data => {
			Object.assign(document.body.style, {
				backgroundColor: 'darkgray',
				backgroundImage: `url(${data.urls.regular})`,
				backgroundSize: 'cover'
			})
		}).catch(error => {
			console.log(error);
			return [];
		});
	}
</script>

<Header />