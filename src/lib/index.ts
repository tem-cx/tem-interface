import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addDefaultLocale(en)
export const timeAgo = new TimeAgo('en-US')

export const getItemUrl = (item: any): string => {
    if (item.colour) {
        const armourType = item.itemId.split("_")[item.itemId.split("_").length - 1];
        return `https://sky.shiiyu.moe/leather/${armourType.toLowerCase()}/${item.colour}`
    }
    return "https://sky.shiiyu.moe/item/" + item.itemId;
}

export const locationMappings = {
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

export const rarities = [
    "COMMON",
    "UNCOMMON",
    "RARE",
    "EPIC",
    "LEGENDARY",
    "MYTHIC",
    "DIVINE",
    "SPECIAL",
    "VERY_SPECIAL"
]

export const getRarityColour = (rarity: string): string => {
    switch (rarity) {
        case "COMMON":
            return "#b7aeae";
        case "UNCOMMON":
            return "#6dc06a";
        case "RARE":
            return "#4747b4";
        case "EPIC":
            return "#ad30ad";
        case "LEGENDARY":
            return "#D4AF37";
        case "MYTHIC":
            return "#FF69B4";
        case "DIVINE":
            return "#66e0dc";
        case "SPECIAL":
            return "#FF0000";
        case "VERY_SPECIAL":
            return "#660000";
        default:
            return "#00FF00";
    }
}

export const getUpgradedRarity = (item: any): string => {
    if (!item?.extraAttributes?.rarity_upgrades) {
        return item.rarity;
    }
    const upgrades = item.extraAttributes.rarity_upgrades;
    const rarityIndex = rarities.indexOf(item.rarity);
    if (rarityIndex + upgrades >= rarities.length) {
        return rarities[rarities.length - 1];
    }
    return rarities[rarityIndex + upgrades];
}

export const formatId = (id: string): string => {
    return id.toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, l => l.toUpperCase())
        .replace(/-/, " - ");
}

export const formatLocation = (location: string): string => {
    return location.toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, l => l.toUpperCase())
        .replace(/-/, " - ")
        .replace("Inv", "Inventory")
        .replace(/ Contents /g, " ")
        .replace(/ Contents/g, "")
        .replace(/Contents /g, "")
        .replace("Armor", "Armour");
}

export function clickOutside(node) {
    const handleClick = event => {
        if (node && !node.contains(event.target) && !event.defaultPrevented) {
            node.dispatchEvent(
                new CustomEvent('click_outside', node)
            )
        }
    }

    document.addEventListener('click', handleClick, true);

    return {
        destroy() {
            document.removeEventListener('click', handleClick, true);
        }
    }
}