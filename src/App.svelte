<script>
	import Header from '~/components/Header.svelte';
	import { onMount } from "svelte";

	const UNSPLASH_API_URL = 'https://api.unsplash.com/photos';
	const UNSPLASH_ACCESS_KEY = '3nqwVq8pU9DMo1p0-W_6jrMnawq84xoo3RGuemcMByA';

	onMount(async () => {
		setBackgrounImage();
		document.body.addEventListener('click', setBackgrounImage, true); 
	});

	// UNSPLASH 랜덤 이미지 배경화면 설정
	function setBackgrounImage() {
		fetch(`${UNSPLASH_API_URL}/random?client_id=${UNSPLASH_ACCESS_KEY}`)
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