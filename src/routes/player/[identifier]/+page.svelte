<script lang="ts">
    import axios from "axios";
    import TimeAgo from 'javascript-time-ago'
    import en from 'javascript-time-ago/locale/en'
    import Select from "svelte-select";
    import {getItemUrl, getRarityColour, getUpgradedRarity} from "$lib";
    import Lazy from 'svelte-lazy';
    TimeAgo.addLocale(en);
    const timeAgo = new TimeAgo('en-US')
    export let data: any;
    let items: [any];
    let errorMessage: string = "";
    let nameFilter = "";
    let locationFilter: any;
    if (data.uuid) {
       axios.get(`https://api.ashcon.app/mojang/v2/user/${data.uuid}`)
            .then(response => {
                data.username = response.data.username;
                data.uuid = response.data.uuid.replace(/-/g, "");
            }).catch(error => {
                console.error(error);
                errorMessage = "Invalid UUID";
            });
    } else {
        axios.get(`https://api.ashcon.app/mojang/v2/user/${data.username}`)
            .then(response => {
                data.username = response.data.username;
                data.uuid = response.data.uuid.replace(/-/g, "");
            }).catch(error => {
                console.error(error);
                errorMessage = "Invalid Username";
            });
    }
    $: if (data.uuid) {
        axios.get(`https://api.tem.cx/items/player/${data.uuid}`)
            .then(response => {
                items = response.data.items.map((item: any) => {
                    item.location = (item.location ?? "unknown").replace(/-\d+/, "");
                    return item;
                });
            }).catch(error => {
                console.error(error);
                errorMessage = "Invalid UUID";
            });
    }

    const locationMappings = {
        "wardrobe_contents": "Wardrobe",
        "inv_armor": "Inventory Armour",
        "talisman_bag": "Talisman Bag",
        "inv_contents": "Inventory",
        "ender_chest_contents": "Ender Chest",
        "fishing_bag": "Fishing Bag",
        "Unknown": "Unknown",
        "personal_vault_contents": "Personal Vault",
        "backpack": "Backpacks",
        "equippment_contents": "Equipment"
    }

    const locationOptions = Object.keys(locationMappings).map(key => {
        return {
            label: (locationMappings as any)[key],
            value: key
        }
    });

    const formatLocation = (location: string): string => {
        const newLocation = location.toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, l => l.toUpperCase())
            .replace(/-/, " - ")
            .replace("Inv", "Inventory")
            .replace(/ Contents /g, " ")
            .replace(/ Contents/g, "")
            .replace(/Contents /g, "")
            .replace("Armor", "Armour");
        return newLocation;
    }
</script>

<div class="container">
    {#if items}
        <div class="player">
            <img src="https://crafatar.com/renders/body/{data.uuid}?overlay" alt="Player Skin">
            <div class="player-info">
                <h1>{data.username}</h1>
                <p>Items Owned: <span class="value">{items.length}</span></p>
                <p>UUID: <span class="value">{data.uuid}</span></p>
            </div>
        </div>
        <input type="text" name="uuid" placeholder="Enter Item Name" class="input__name" bind:value={nameFilter}>
        <div class="search">
            {#if !locationFilter}
                <span class="material-symbols-outlined expand">expand_more</span>
            {/if}
            <Select bind:value={locationFilter} items={locationOptions} placeholder="Select Location" />
        </div>
        <div class="items">
            {#each items.filter(item => item.friendlyName.toLowerCase().includes(nameFilter.toLowerCase())).sort((a, b) => b.previousOwners.length - a.previousOwners.length).filter(item => {
               if (locationFilter) {
                   return item.location === locationFilter.value
               } else {
                   return true
               }
            }) as item}
                <div class="item" on:click={() => window.open(`/item/${item._id}`, "_blank")} style="border-left-color:{getRarityColour(getUpgradedRarity(item))};">
                    <Lazy height={96} offset={430}>
                        <img src="{getItemUrl(item)}" alt="">
                    </Lazy>
                    <div class="item__info">
                        <h3>{item.friendlyName}</h3>
                        <p>Previous Owners: <span class="value">{item.previousOwners.length}</span>.</p>
                        <p>Location: <span class="value">{formatLocation(item.location ?? "Unknown")}</span>.</p>
                        <p class="uuid">{item._id}</p>
                    </div>
                    <p class="last__scanned">{timeAgo.format(new Date(item.lastChecked ?? 0))}</p>
                </div>
            {/each}
            </div>
    {:else if !errorMessage}
        <div class="loading">Loading data...</div>
    {:else}
        <div class="error">{errorMessage}</div>
    {/if}
</div>

<style>
    .container {
        box-sizing: border-box;
        margin-top: 1rem;
        margin-bottom: 1rem;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
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

    .input__name {
        align-self: flex-start;
        width: 15rem;
        margin: .5rem 0 0 1rem;
    }

    .player {
        display: flex;
        flex-direction: row;
        align-items: center;
        align-self: flex-start;
        margin-bottom: .5rem;
        width: 45rem;
        max-width: 80vw;
        padding: 1rem 2rem;
        height: fit-content;
        background-color: #143037;
        border: 2px solid #4ecca3;
        border-radius: 2px;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
        margin-left: 1rem;
    }

    .player img {
        height: 7rem;
        margin-right: 1rem;
    }

    .player-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        color: white;
        word-wrap: anywhere;
        gap: 4px;
    }

    .player-info p {
        margin: 0;
    }

    .player-info h1 {
        margin: 0;
        font-size: 2rem;
        color: #4ecca3;
        text-wrap: normal;
    }

    .value {
        color: #4ecca3;
    }

    .items {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 1rem;
        margin: 1.3rem 1rem;
    }

    .item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 24rem;
        height: 11rem;
        /*background-color: #222830;*/
        border-left: 4px solid #4ecca3;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
        border-radius: 5px;
        padding: 0 1rem;
        flex: 1 1 24rem;
        position: relative;
        cursor: pointer;
    }

    h3 {
        margin-bottom: 4px;
    }

    :global(.container .clear-select) {
        justify-content: flex-end !important;
    }

    .item__info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        color: white;
        word-wrap: anywhere;
        width: 100%;
        gap: 5px;
    }

    .item img {
        height: 5rem;
        margin-right: 1rem;
    }

    .uuid {
        margin-top: 4px;
        font-size: 0.8rem;
        color: #696b6a;
    }

    :global(.search *) {
        color: white;
    }

    .search {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 16.1rem;
        --background: transparent;
        align-self: flex-start;
        --border-focused: none;
        --border-hover: none;
        --border: none;
        --font-size: 1.2rem;
        --padding: 0.5em;
        --padding-input: 0.5em;
        --input-color: #757575;
        --list-empty-color: #fff;
        --placeholder-color: #9b9a9a;
        --margin: 0;
        margin: .7rem 0 0 1rem;
        border: 1px solid #4ecca3;
        border-radius: 5px;
        --item-color: #fff;
        --list-background: #393E46;
        --item-hover-bg: #28292a;
        --item-hover-color: #fff;
        --item-is-active-bg: #202121;
        --icons-color: #fff;
        --selected-item-color: #fff;
    }

    .expand {
        position: absolute;
        right: 7px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 10;
        pointer-events: none;
    }

    .search :global(.value-container) {
        padding: 0 !important;
    }


    @media (max-width: 768px) {
        .items {
            margin: 1.3rem 1rem;
            gap: 0;
        }

        .player {
            margin: 0;
            align-self: center;
            transform: scale(85%);
        }

        .container {
            margin-top: 0;
        }

        .item {
            flex: 1 1 100%;
            width: 100%;
            font-size: 85%;
            margin-bottom: 1rem;
            height: 9rem;
        }

        .last__scanned {
            font-size: 0.65rem !important;
        }

        .uuid {
            font-size: 85%;
        }
    }

    .last__scanned {
        position: absolute;
        font-size: 0.8rem;
        top: .6rem;
        right: .6rem;
        color: #696b6a;
    }
</style>