<script lang="ts">
    import {formatId, formatLocation, getItemUrl, getRarityColour, getUpgradedRarity} from "$lib";
    import TimeAgo from 'javascript-time-ago'
    import en from 'javascript-time-ago/locale/en'

    export let json: any;
    export let enchantments: string[] = [];
    const ultimateEnchantments = enchantments.filter((enchantment) => enchantment.includes("Ultimate")).map((enchantment) => {
        if (!enchantment.includes("Ultimate Wise")) enchantment = enchantment.replace("Ultimate ", "")
        return enchantment;
    });

    const normalEnchantments = enchantments.filter((enchantment) => !enchantment.includes("Ultimate"));
    const hotPotatoCount = json.extraAttributes.hot_potato_count;
    const upgradedRarity = getUpgradedRarity(json);
    const attributes = json?.extraAttributes?.attributes;
    let attributesString = "";
    const upgradedRarityColour = getRarityColour(upgradedRarity);
    TimeAgo.addLocale(en)

    const timeAgo = new TimeAgo('en-US')
</script>

<div class="item">
    <div class="item__top card">
        <img src={getItemUrl(json ?? {})} alt="item" class="icon">
        <div class="item__name">
            <h2 style="color: {upgradedRarityColour};">{json?.friendlyName}</h2>
            <p class="rarity" style="color: {upgradedRarityColour};">{upgradedRarity}</p>
        </div>
    </div>
    {#if enchantments && enchantments.length > 0}
        <div class="item__enchants card">
            {#if ultimateEnchantments && ultimateEnchantments.length > 0}
                <p class="ultimate">
                    {ultimateEnchantments.join(", ")}
                </p>
            {/if}
            <p>{normalEnchantments.join(", ")}</p>
        </div>
    {/if}
    {#if attributes}
        <div class="item__attributes card">
            <p>{Object.entries(attributes).map(([k, v]) => formatId(k) + " " + v).join(", ")}</p>
        </div>
    {/if}
        <div class="item__info card">
            <p>Location: <span class="value">{formatLocation(json?.location)}</span></p>
            {#if json?.colour}
                <p>Colour: <span style="color: #{json?.colour};">#{json?.colour}</span></p>
            {/if}
            {#if hotPotatoCount}
                <p>Hot Potatoes: <span class="value">{hotPotatoCount}</span></p>
            {/if}
            <p>Origin Tag: <span class="value">{json?.extraAttributes?.originTag ?? "Unknown"}</span></p>
            <p>Item Id: <span class="value">{json?.itemId}</span></p>
            <p>Created: <span class="value">{timeAgo.format(json?.created_at ?? 0)}</span></p>
            <p>Last Checked: <span class="value">{timeAgo.format(json?.lastChecked ?? 0)}</span></p>
        </div>
</div>

<style>
    .icon {
        width: 80px;
        height: 80px;
        border-radius: 5px;
    }

    .item {
        box-sizing: border-box;
        flex-direction: column;
        display: flex;
        gap: 1rem;
        width: 45%;
    }

    .item__name h2 {
        color: #4ecca3;
        font-weight: 450;
    }

    .item__top {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        gap: 10px;
    }

    .item__enchants {
        width: 100%;
        gap: 10px;
        color: #5f8dd3;
        line-height: 1.5rem;
        box-sizing: border-box;
        padding: 1.3rem;
    }

    .item__attributes {
        width: 100%;
        gap: 10px;
        color: #08e1e8;
        line-height: 1.5rem;
        box-sizing: border-box;
        padding: 1.3rem;
        font-weight: 500;
    }

    .item__info {
        color: white;
        line-height: 1.5rem;
        padding: 1.3rem;
        font-weight: 500;
    }

    .item__top {
        word-wrap: anywhere;
    }

    .ultimate {
        font-weight: 800;
        font-size: 1.4rem;
        color: #ff7eb9;
        margin-top: .5rem;
        margin-bottom: 1.1rem;
    }

    .item__enchants {
        font-weight: 500;
    }

    @media (max-width: 1000px) {
        .item {
            width: 90%;
            margin-bottom: 1rem;
            height: fit-content;
        }
    }
</style>