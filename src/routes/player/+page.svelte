<script>
	import { onMount } from "svelte";

    const usernames = [
        "RagingEnby",
        "BenC1ark",
        "treade",
        "HellCastleBTW"
    ]
    let randomUsername;

    onMount(() => {
        randomUsername = usernames[Math.floor(Math.random() * usernames.length)]
    });

    const goToUsername = () => {
        return () => {
            window.location.href = `/player/${randomUsername}`;
        }
    }
</script>

<center-container>
    {#if randomUsername}
        <p>This page takes a player's username (or uuid) and displays their items.</p>
        <p>Not sure what to search for? <a class="search-click" target="_self" href="/player/{randomUsername}">How about {randomUsername}?</a></p>
    {/if}
</center-container>

<style>
    center-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        text-align: center;
        padding: 0 1em;
    }
    
    p {
        margin: 0;
        padding: 0;
        font-size: 1.5em;
    }

    .search-click {
        position: relative;
        color: #00aaff;
        cursor: pointer;
        transition: 0.2s;
        text-decoration: none;

    }

    .search-click::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #00aaff;
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 0.2s ease-in-out;
    }

    .search-click:hover::after {
        transform: scaleX(1);
        transform-origin: left;
    }

    .search-click:active {
        color: #0088ff;
    }
</style>
