<script lang="ts">
    import {showSettings, hypixelApiKey, iTemApiKey} from "$lib/storable.js";
    import { fly } from 'svelte/transition';
    import { clickOutside } from "$lib";
</script>

<div
        class="container"
        on:keypress={e => {
                if (e.key === 'Enter') {
                    $showSettings = false;
                }
            }}
        transition:fly={{ duration: 200 }}
>
    <div
            class="settings"
            use:clickOutside
            on:click_outside={() =>$showSettings = false}
    >
        <p>Some features require the following API keys.</p>
        <form on:submit|preventDefault>
            <input type="text" name="hypixelKey" placeholder="Hypixel API Key" bind:value={$hypixelApiKey} />
            <input type="text" name="iTemKey" placeholder="iTEM Key" bind:value={$iTemApiKey} />
        </form>
    </div>
</div>

<style>
    .container {
        position: fixed;
        min-height: 100vh;
        width: 100vw;
        background: rgba(10, 10, 10, 0.71);
        z-index: 100;
    }

    .settings {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(145deg, rgb(32, 32, 52) 0%, rgb(31, 32, 52) 35%, rgb(32, 32, 70) 100%) no-repeat fixed;
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.5);
    }

    form {
        display: flex;
        flex-direction: column;
    }

    input {
        width: auto !important;
        border-color: #376ba8 !important;
        font-size: 1.1rem;
    }

    p {
        margin: .5rem;
        font-weight: 500;
    }


</style>