<script lang="ts">
    import {onMount} from "svelte";
    import axios from "axios";
    import OwnerCard from "../../../../components/OwnerCard.svelte";
    import ItemCard from "../../../../components/ItemCard.svelte";

    export let data: any;
    let error = false;
    let json: any;
    let enchantments: string[] = [];
    onMount(() => {
        axios.get(`https://api.tem.cx/items/${data.uuid}`).then((res) => {
            json = res.data.item;
            json.previousOwners = json.previousOwners.reverse();
            for (const [enchant, level] of Object.entries(json.enchantments)) {
                let name = enchant;
                name = name.replace(/_/g, " ");
                name = name.replace(/\w\S*/g, function (txt: string) {
                    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
                });
                enchantments.push(`${name} ${level}`);
                enchantments = enchantments; // force update
            }
        }).catch(e => {
           error = true;
           console.error(e);
        });
    });
</script>

<div class="container">
    {#if json && enchantments}
        <ItemCard json={json} enchantments={enchantments} />
        <div class="owners">
            <h2>Current Owner</h2>
            <OwnerCard uuid={json?.currentOwner?.playerUuid} end={-1} start={json?.previousOwners.length !== 0 ? json?.previousOwners[json?.previousOwners.length - 1]?.end : -1} />
            <h2>Previous Owners</h2>
            <div class="owners__list">
                {#each json?.previousOwners ?? [] as owner}
                    <OwnerCard uuid={owner.owner.playerUuid} end={owner.end} start={owner.start} />
                {/each}
            </div>
        </div>
    {:else if !error}
        <div class="loading">Loading data...</div>
    {:else}
        <div class="error">Couldn't find the item.</div>
    {/if}
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

    .loading {
        font-size: 1.5rem;
        font-weight: 500;
        color: white;
        margin: auto;
    }

    .error {
        font-size: 1.5rem;
        font-weight: 500;
        color: red;
        margin: auto;
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