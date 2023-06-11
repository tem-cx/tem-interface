export const load = (async ({ fetch, params }) => {
    let response: Response;
    try {
        response = await fetch(`https://api.tem.cx/pets/${params.uuid}`)
    } catch (e) {
        throw error(400, "Invalid UUID");
    }

    let serialized = await response.json();

    if (serialized.code !== 200) {
        throw error(serialized.code, `${serialized.reason}`);
    }
    serialized = serialized.pet;
    serialized.previousOwners = serialized.previousOwners.reverse();

    params["pet"] = serialized;

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

    try {
        response = await fetch("https://raw.githubusercontent.com/SkyCryptWebsite/SkyCrypt/development/src/constants/pets.js")
    } catch (e) {
        throw error(400, "Couldn't fetch GitHub data")
    }

    const text = await response.text();
    const petName = params["pet"].name;
    const regex = new RegExp(petName + ":\\s*{[^}]*head:\\s*\"([^\"]*)\"");
    const match = regex.exec(text);
    if (match) {
        params["petImageUrl"] = "https://sky.shiiyu.moe" + match[1];
    }

    return params;
}) satisfies PageLoad;