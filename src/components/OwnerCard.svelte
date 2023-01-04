<script lang="ts">
    import axios from "axios";
    import {goto} from "$app/navigation";
    import {onMount} from "svelte";

    export let uuid: string;
    let name;
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

</script>

<div class="owner" on:click={() => {
    location.href = "/player/" + name
}}>
    <img src="https://crafatar.com/avatars/{uuid}?size=64&overlay" alt="avatar" class="avatar">
    <div class="owner__info">
        {#await getName(uuid)}
            <p class="name">loading...</p>
        {:then name}
            <p class="name">{name}</p>
        {/await}
        <div class="buttons">
            <span class="material-symbols-outlined">file_download</span>
            <span class="material-symbols-outlined">file_upload</span>
        </div>
    </div>
</div>

<style>
    .owner {
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    .avatar {
        width: 56px;
        height: 56px;
        border-radius: 50%;
    }

    .owner__info {
        margin-left: 1rem;
        display: flex;
        justify-content: space-between;
        width: 100%;
    }

    .name {
        font-size: 1.3rem;
        font-weight: 500;
    }
</style>
