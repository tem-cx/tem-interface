<script lang="ts">
    import axios from "axios";

    export let json;
    import TimeAgo from 'javascript-time-ago'
    import en from 'javascript-time-ago/locale/en'
    import {getRarityColour} from "$lib";
    TimeAgo.addLocale(en);
    const timeAgo = new TimeAgo('en-US')
    let skin_url: string;
    const rarity = json?.rarity;

    axios.get("https://raw.githubusercontent.com/SkyCryptWebsite/SkyCrypt/development/src/constants/pets.js").then((res) => {
        let text = res.data;
        const pet_name = json?.name;
        const regex = new RegExp(pet_name + ":\\s*{[^}]*head:\\s*\"([^\"]*)\"");
        const match = regex.exec(text);
        if (match) {
            skin_url = "https://sky.shiiyu.moe" + match[1];
        }
    });
</script>


<div class="pet">
    <div class="pet__top card">
        <img src={skin_url} alt="pet" class="icon">
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