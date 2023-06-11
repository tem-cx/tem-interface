import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";


export const load = (async ({ fetch, params }) => {
    let data: any = {};
    let response: Response;
    try {
        response = await fetch(`https://api.ashcon.app/mojang/v2/user/${params.identifier}`);
    } catch (e) {
        if (params.identifier.length > 16) {
            throw error(400, "Invalid UUID");
        } else {
            throw error(400, "Invalid username");
        }
    }
    let serialized = await response.json();
    if (serialized.error) {
        throw error(404, serialized.reason ?? serialized.error ?? "Unknown error")
    }
    data["uuid"] = serialized.uuid.replace(/-/g, '');
    data["username"] = serialized.username;

    try {
        response = await fetch(`https://api.tem.cx/items/player/${data.uuid}`);
    } catch (e) {
        throw error(400, "Invalid UUID");
    }

    serialized = await response.json();
    data["items"] = serialized.items.map((item: any) => {
        item.location = (item.location ?? "unknown").replace(/-\d+/, "");
        return item;
    });


    return data;
}) satisfies PageLoad;