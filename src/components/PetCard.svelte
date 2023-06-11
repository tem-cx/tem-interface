<script lang="ts">
    export let json;
    import TimeAgo from 'javascript-time-ago'
    import en from 'javascript-time-ago/locale/en'
    import {formatLocation, getRarityColour} from "$lib";
    TimeAgo.addLocale(en);
    const timeAgo = new TimeAgo('en-US')
    export let skinUrl: string;
    const rarity = json?.rarity;
    let metaDescription = `🗡️ ID: ${json.name}
    🎒 Location: ${formatLocation(json.location)}\n`;
    
    metaDescription += `\n🍭 Candy: ${json.candy}/10`
    if (json.heldItem) {
        metaDescription += `\n💎 Held Item: ${json.heldItem}`
    }

    metaDescription += '\n';
    if (json.extraAttributes?.originTag && json.extraAttributes?.originTag != "Unknown") {
        metaDescription += `\n🔎 Origin ${json.extraAttributes?.originTag}`
    } 
    metaDescription += `\n✅ Last Checked ${timeAgo.format(json.lastChecked)}`;
</script>

<svelte:head>
    <title>{json?.friendlyName}</title>
    <meta content={getRarityColour(rarity)} data-react-helmet="true" name="theme-color" />
    <meta name="og:description" content={`${metaDescription}`} />
</svelte:head>

<div class="pet">
    <div class="pet__top card">
        <img src={skinUrl} alt="pet" class="icon">
        <div class="pet__name">
            <h2 style="color: {getRarityColour(rarity)}">[Lvl {json?.level}] {json?.friendlyName}</h2>
            <p class="rarity" style="color: {getRarityColour(rarity)}">{json?.rarity}</p>
        </div>
    </div>
    <div class="pet__bottom card">
        <div class="pet__info">
            <p>Candy: <span class="value">{json?.candy}/10</span></p>
            <p>Location: <span class="value">{json?.location}</span></p>
            <p>Item Id: <span class="value">{json?.name}</span></p>
            <p>Held Item: <span class="value">{json?.heldItem}</span></p>
            <p>Last Checked: <span class="value">{timeAgo.format(json?.lastChecked ?? 0)}</span></p>
        </div>
    </div>
</div>

<style>
    .icon {
        height: 64px;
        border: #4ecca3 solid 2px;
        border-radius: 5px;
    }

    .pet {
        box-sizing: border-box;
        flex-direction: column;
        gap: 1rem;
        width: 45%;
    }

    .pet__name h2 {
        color: #4ecca3;
    }

    .pet__top {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        gap: 10px;
    }

    .pet__bottom {
        margin-top: 1rem;
        padding: 0;
    }

    .pet__info {
        color: white;
        line-height: 1.5rem;
        padding: 1.3rem;
        font-weight: 500;
    }

    @media (max-width: 1000px) {
        .pet {
            width: 90%;
            margin-bottom: 1rem;
            height: fit-content;
        }
    }
</style>