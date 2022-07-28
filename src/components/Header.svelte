<script>
	import { setUnsplashRandomImage } from '~/api';

    function changeBackground() {
        setUnsplashRandomImage()
    }
</script>

<header>
    <img
        src="/images/trello-logo.svg"
        alt="Trello logo"
        class="logo"
        on:click={changeBackground}>
</header>

<style lang="scss">
    header {
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(black, 0.3);
        
        img.logo {
            width: 80px;
            opacity: 0.5;
            cursor: pointer;
        }
    }
</style>