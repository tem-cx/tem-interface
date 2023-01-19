<svelte:head>
    <script src="/nbt.js"></script>
</svelte:head>
<script lang="ts">
    import { hypixelApiKey, showDupePopup } from "$lib/storable.js";
    import DupePopup from "../../components/DupePopup.svelte";
    let uuid: string;
</script>

<div class="container">
    <h1 class="title">Item Dupe Checker</h1>
    <h2 class="description">
        This tool scans the auction house and the iTEM database for duplicate items.
    </h2>
    <form on:submit|preventDefault={() => {
        $showDupePopup = true;
    }}>
        <input type="text" name="uuid" placeholder="Item UUID" bind:value={uuid}>
        <input type="password" name="key" placeholder="API Key" bind:value={$hypixelApiKey}>
        <button type="submit">Go!</button>
    </form>
    {#if $showDupePopup}
        <DupePopup uuid={uuid} />
    {/if}
</div>

<style>
    .title {
        font-size: 3rem;
        font-weight: 700;
        color: #78c5a1;
        text-align: center;
    }

    .description {
        font-size: 1.5rem;
        font-weight: 400;
        text-align: center;
        margin-top: 1rem;
        margin-bottom: 1.6rem;
    }

    @media (max-width: 768px) {
        .title {
            font-size: 2rem;
        }

        .description {
            font-size: 1rem;
        }

        .container {
            padding: 0 1rem;
        }
    }

    button {
        border: 2px solid #57c2a2;
        border-radius: 10px;
        background-color: transparent;
        color: white;
        padding: 14px 32px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        cursor: pointer;
        transition-duration: 0.4s;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, .4);
    }

    button:hover {
        background-color: #57c2a2;
        color: white;
    }

    button:active {
        background-color: #57c2a2;
        color: white;
    }

    input {
        /*text-align: center;*/
        border: 2px solid #57c2a2 !important;
        border-radius: 10px;
        font-size: 1.3rem !important;
        width: auto !important;
        margin: 0 !important;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, .4);
    }

    form {
        display: flex;
        flex-direction: column;
        text-align: center;
        width: 40rem;
        max-width: 100%;
        gap: .9rem;

    }

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

</style>