<script lang="ts">
    import axios from "axios";
    import SvelteTooltip from 'svelte-tooltip';
    import {onMount} from "svelte";
	import { timeAgo } from "$lib";

    export let uuid: string;
    export let end: number;
    export let start: number;
    let name: string;
    const getName = async (uuid: string) => {
        try {
            const r = await axios.get(`https://api.ashcon.app/mojang/v2/user/${uuid}`);
            return r.data.username;
        } catch (e) {
            return uuid
        }
    }

    onMount(async () => {
        name = await getName(uuid);
    })

    const openPlayerPage = () => {
        location.href = "/player/" + name
    }

</script>

<div class="owner">
    <img src="https://crafatar.com/avatars/{uuid}?size=64&overlay" alt="avatar" class="avatar" on:click={openPlayerPage}>
    <div class="owner__info" on:click={openPlayerPage}>
        {#await getName(uuid)}
            <p class="name">loading...</p>
        {:then name}
            <p class="name">{name}</p>
        {/await}
    </div>
    <div class="buttons">
        <SvelteTooltip tip={`Acquired ${timeAgo.format(start)}`} left>
            <span class="material-symbols-outlined">file_download</span>
        </SvelteTooltip>
        <SvelteTooltip tip={(end != -1) ? `Passed on ${timeAgo.format(end)}` : "Current Owner"} left>
            <span class="material-symbols-outlined">file_upload</span>
        </SvelteTooltip>
    </div>
</div>

<style>
    .owner {
        display: flex;
        align-items: center;
    }

    .avatar {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        cursor: pointer;
    }

    .owner__info {
        margin-left: 1rem;
        display: flex;
        justify-content: space-between;
        width: 100%;
        cursor: pointer;
    }

    .name {
        font-size: 1.3rem;
        font-weight: 500;
    }

    .buttons {
        display: flex;
        cursor: default;
    }

    .buttons span {
        padding: 0.5rem;
    }

    @media (max-width: 1000px) {
        :global(.tooltip-slot) {
            display: block;
        }
    }
</style>
