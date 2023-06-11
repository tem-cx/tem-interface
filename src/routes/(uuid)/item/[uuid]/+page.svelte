<script lang="ts">
    import {onMount} from "svelte";
    import axios from "axios";
    import OwnerCard from "../../../../components/OwnerCard.svelte";
    import ItemCard from "../../../../components/ItemCard.svelte";
	import { getItemUrl } from "$lib";

    export let data: any;
    let {enchantments, item} = data;
</script>

<svelte:head>
    <title>{item?.name}</title>
    <meta property="og:title" content={`${data.currentOwnerName}'s ${item.friendlyName}`} />
    <meta name="og:site_name" content="iTEM • All of Hypixel SkyBlock, Here." />
    <meta property="og:image" content={data.itemImageUrl} />
    <meta property="og:image:width" content="1500" />
    <meta property="og:image:height" content="1500" />
</svelte:head>

<div class="container">
        <ItemCard json={item} enchantments={enchantments} />
        <div class="owners">
            <h2>Current Owner</h2>
            <OwnerCard uuid={item?.currentOwner?.playerUuid} end={-1} start={item?.previousOwners.length !== 0 ? item?.previousOwners[item?.previousOwners.length - 1]?.end : -1} />
            <h2>Previous Owners</h2>
            <div class="owners__list">
                {#each item?.previousOwners ?? [] as owner}
                    <OwnerCard uuid={owner.owner.playerUuid} end={owner.end} start={owner.start} />
                {/each}
            </div>
        </div>
</div>

<style>
    .container {
        box-sizing: border-box;
        margin-top: 1rem;
        margin-bottom: 1rem;
        height: 100%;
        display: flex;
        justify-content: space-evenly;
        flex-direction: row;
    }

    .owners {
        box-sizing: border-box;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        justify-self: flex-end;
        width: 45%;
        height: 100%;
        padding: 1rem;
        border-radius: 5px;
        background-color: transparent;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
        color: white;
        overflow: auto;
        border-left: 4px solid #4ecca3;
    }

    .owners__list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        height: 0;
    }


    h2 {
        margin-bottom: 1rem;
        margin-top: 1rem;
        font-size: 1.3rem;
    }

    h2:first-child {
        margin-top: 0;
    }


    @media (max-width: 1000px) {
        .container {
            flex-direction: column;
            align-items: center;
        }
        .owners {
            width: 90%;
            height: auto;
            overflow: visible;
        }

        .owners__list {
            height: auto !important;
            overflow: visible;
        }

        .container {
            justify-content: flex-start;
        }

        :global(.avatar) {
            width: 50px !important;
            height: 50px !important;
        }
    }
</style>