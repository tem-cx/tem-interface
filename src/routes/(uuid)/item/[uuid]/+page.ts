import type { PageLoad } from "./$types";
import { getItemUrl } from "$lib";
import { error } from "@sveltejs/kit";

export const load = (async ({ fetch, params }) => {
    let response: Response;
    try {
        response = await fetch(`https://api.tem.cx/items/${params.uuid}`)
    } catch (e) {
        throw error(400, "Invalid UUID");
    }

    let serialized = await response.json();

    if (serialized.code !== 200) {
        throw error(serialized.code, `${serialized.reason}`);
    }
    serialized = serialized.item;

    serialized.previousOwners = serialized.previousOwners.reverse();

    params["enchantments"] = [];
    for (const [enchant, level] of Object.entries(serialized.enchantments)) {
        let name = enchant;
        name = name.replace(/_/g, " ");
        name = name.replace(/\w\S*/g, function (txt: string) {
            return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
        });
        params["enchantments"].push(`${name} ${level}`);
    }

    params["item"] = serialized;

    try {
        response = await fetch(`https://api.ashcon.app/mojang/v2/user/${serialized.currentOwner.playerUuid}`);
    } catch (e) {
        throw error(400, "Couldn't fetch current owner");
    }

    serialized = await response.json();
    if (serialized.error) {
        throw error(400, "Couldn't fetch current owner");
    } else {
        params["currentOwnerName"] = serialized.username;
    }

    params["itemImageUrl"] = `https://api.tem.cx/icons/item/${params["item"].itemId}`;


    return params;
}) satisfies PageLoad;