<svelte:head>
    <script src="../../nbt.js"></script>
</svelte:head>

<script>
    import { clickOutside } from "$lib";
    import { fly } from 'svelte/transition'
    import { hypixelApiKey, showDupePopup } from "$lib/storable";
    import pako from "pako";
    import {onMount} from "svelte";
    import {locationMappings} from "$lib";

    export let uuid;
    let stop = false;
    $: if (!$showDupePopup) {
        stop = true;
    }

    const knownInventories = ["inv_armor", "inv_contents", "wardrobe_contents",
        "ender_chest_contents", "personal_vault_contents", "talisman_bag", "fishing_bag", "quiver",
        "potion_bag", "candy_inventory_contents"];
    let progressData = [];
    let apiError = "";
    let verifiedOwners = new Set();
    let possibleOwners = new Set();
    let totalPages = 0;
    let processedPlayers = 0;
    let donePages = 0;
    let apiKey = "";
    let result = "";

    $: if (progressData) {
        setTimeout(() => {
            let element = document.querySelector(".popup");
            element.scrollTop = element.scrollHeight;
        }, 10);
    }

    async function start() {
        apiKey = $hypixelApiKey;
        addProgressMessage("Searching current auction house...");
        let auctionHouseOwners = await searchAuctionHouse(uuid);
        addProgressMessage("Found <span style='color: #4ecca3'>" + auctionHouseOwners.length + "</span> item(s) on the auction house RIGHT NOW with that uuid!");
        addProgressMessage("Downloading auction history...");
        if (stop) return;
        let coflOwners = await getAuctionsFromCofl(uuid);
        coflOwners.forEach((owner) => possibleOwners.add(owner));
        addProgressMessage("Found <span style='color: #4ecca3'>" + coflOwners.length + "</span> possible owners from auction history!");
        addProgressMessage("Fetching known previous owners...");
        let temOwners = await getOwnersFromTEM(uuid);
        temOwners.forEach((owner) => possibleOwners.add(owner));
        addProgressMessage("Found <span style='color: #4ecca3'>" + temOwners.size + "</span> previous owners from TEM!");
        // if they're on AH, they don't need to be in the possible owners set.;
        auctionHouseOwners.forEach((owner) => {
            processedPlayers++;
            verifiedOwners.add({"uuid": owner, "location": "Auction House"});
            possibleOwners.delete(owner);
        });
        addProgressMessage("Verifying owners!");
        let newVerifiedOwners = await verifyOwners(possibleOwners, uuid);
        verifiedOwners.forEach((owner) => newVerifiedOwners.push(owner));
        addProgressMessage("Found <span style='color: #4ecca3'>" + newVerifiedOwners.length + "</span> owners!");
        addProgressMessage("Searching for owner names...");
        newVerifiedOwners = newVerifiedOwners.map((owner) => {
            owner["uuid"] = owner["uuid"].replaceAll("-", "");
            return owner;
        });
        let lookup = await uuidsToUsernames(newVerifiedOwners.map((owner) => owner["uuid"]));
        newVerifiedOwners.forEach((verifiedOwnerData) => {
            let username = lookup[verifiedOwnerData["uuid"]];
            const name = locationMappings[verifiedOwnerData["location"]] ?? verifiedOwnerData["location"];
            addProgressMessage("Exists in <span style='color: #4ecca3'>" + username + "'s " + name + "</span>!");
        });
        if (newVerifiedOwners.length > 1) {
            result = "Definitely a duped item!";
        } else {
            result = "Item may not be duped!";
        }
    }

    onMount(() => {
        start()
    })

    async function uuidsToUsernames(uuids) {
        return fetch("https://api.thom.club/bulk_uuids", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "uuids": uuids
                })
            }
        ).then((response) => {
            return response.json().then((jsonData) => {
                return jsonData["uuids"];
            })
        })
    }


    function setApiError(errorMessage) {
        apiError = errorMessage
    }

    function getAuctionsFromCofl(itemUuid) {
        return fetch("https://sky.coflnet.com/api/auctions/uid/" + itemUuid + "/sold").then((response) => {
            if (response.status !== 200 && response.status !== 500) {
                response.json().then((jsonData) => {
                    addProgressMessage("Failed getting auctions: " + jsonData["Message"])
                })
                return []
            }
            if (response.status === 500) {
                response.json().then((jsonData) => {
                    addProgressMessage("Failed getting auctions, there seems to be an error with your input. " +
                        "Report the trace: " + jsonData["Trace"])
                })
                return []
            }
            return response.json().then((jsonData) => {
                return possibleOwnersFromAuctionHistory(jsonData)
            })
        }, (error) => {
            addProgressMessage("Failed getting auctions: " + error)
            return []
        })
    }

    function getOwnersFromTEM(itemUuid) {
        return fetch("https://api.tem.cx/items/" + itemUuid).then((response) => {
            if (response.status !== 200) {
                addProgressMessage("Error getting data from TEM, status: " + response.status)
                return []
            }
            return response.json().then((jsonData) => {
                let temPossibleOwners = new Set()
                let previousOwners = jsonData["item"]["previousOwners"]
                if (jsonData?.item?.currentOwner?.playerUuid !== undefined) {
                    temPossibleOwners.add(jsonData["item"]["currentOwner"]["playerUuid"])
                }
                for (let i = previousOwners.length - 1; i >= 0; i--) {
                    let playerUuid = previousOwners[i]["owner"]["playerUuid"]
                    if (possibleOwners.has(playerUuid)) {
                        continue
                    }
                    if (temPossibleOwners.size > 3) {
                        return temPossibleOwners
                    }
                    temPossibleOwners.add(playerUuid)
                }
                return temPossibleOwners
            })
        }, (error) => {
            addProgressMessage("Failed getting previous owners: " + error)
            return []
        })
    }

    function possibleOwnersFromAuctionHistory(jsonData) {
        let possibleOwners = []
        jsonData.forEach((auction) => {
            if (possibleOwners.includes(auction["seller"])) {
                possibleOwners[possibleOwners.indexOf(auction["seller"])] = auction["buyer"]
            } else {
                possibleOwners.push(auction["buyer"])
            }
        })
        return possibleOwners
    }

    function addProgressMessage(message) {
        progressData = [...progressData, message];
        progressData = progressData;
    }

    function updateLastProgressLine(newMessage) {
        progressData[progressData.length - 1] = newMessage
    }

    async function verifyOwners(possibleOwners, itemUuid) {
        let verifiedOwners = []
        let promises = []
        possibleOwners.forEach((possibleOwner) => {
            promises.push(downloadData(possibleOwner).then((profileData) => {
                if (profileData["profiles"] == null) {
                    return
                }
                for (const profile of profileData["profiles"]) {
                    if (profile["members"] == null) {
                        continue
                    }
                    let playerProfile = profile["members"][possibleOwner]
                    for (const inventoryName of knownInventories) {
                        if (playerProfile[inventoryName] == null) {
                            continue
                        }
                        if (checkIsPresent(inventoryName, playerProfile[inventoryName]["data"], itemUuid)) {
                            verifiedOwners.push({"uuid": possibleOwner, "location": inventoryName})
                            return
                        }
                    }
                    if (playerProfile["backpack_contents"] != null) {
                        let backpackNumber = 0
                        for (const value of Object.values(playerProfile["backpack_contents"])) {
                            if (checkIsPresent("backpack " + backpackNumber, value["data"], itemUuid)) {
                                verifiedOwners.push({"uuid": possibleOwner, "location": "backpack " + backpackNumber})
                                return
                            }
                            backpackNumber++
                        }
                    }
                }
            }))
        })
        await Promise.all(promises)
        return verifiedOwners
    }

    function checkIsPresent(inventoryName, inventoryBytes, itemUuid) {
        const decompressedData = pako.inflate(Uint8Array.from(atob(inventoryBytes), c => c.charCodeAt(0)))
        let found = false;
        nbt.parse(decompressedData, (error, data) => {
            try {
                let itemsList = data["value"]["i"]["value"]["value"]
                for (const itemNbt of itemsList) {
                    try {
                        let thisItemUuid = itemNbt["tag"]["value"]["ExtraAttributes"]["value"]["uuid"]["value"]
                        if (thisItemUuid === itemUuid) {
                            found = true
                            return true
                        }
                    } catch (e) {/* empty */}
                }
            } catch (e) {/* empty */}
        })
        return found
    }


    function downloadData(uuid) {
        return fetch("https://api.hypixel.net/skyblock/profiles?uuid=" + uuid + "&key=" + apiKey).then((response) => {
            if (response.status === 403) {
                setApiError("Invalid API Key. Please change it in settings.")
                return null
            } else if (response.status === 400) {
                setApiError("Invalid request.")
                return null
            } else if (response.status === 429) {
                let resetTime = response.headers.get("RateLimit-Reset")
                if (resetTime === null) {
                    resetTime = response.headers.get("Retry-After")
                }
                setApiError("Rate limit exceeded. Try again in " + resetTime + " seconds.")
                return null
            }
            return response.json()
        })
    }

    async function searchAuctionHouse(itemUuid) {
        let auctionHouseUuids = []
        let pageOneData = await fetch("https://api.hypixel.net/skyblock/auctions?page=0").then((response) => {
            return response.json()
        })
        totalPages = pageOneData["totalPages"]
        checkPageForUuid(pageOneData, itemUuid).forEach((auctionHouseOwnerUuid) => {
            auctionHouseUuids.push(auctionHouseOwnerUuid)
        })
        let promises = []
        for (let i = 1; i < totalPages; i++) {
            promises.push(fetch("https://api.hypixel.net/skyblock/auctions?page=" + i).then((response) => {
                return response.json().then((jsonData) => {
                    checkPageForUuid(jsonData, itemUuid).forEach((auctionHouseOwnerUuid) => {
                        auctionHouseUuids.push(auctionHouseOwnerUuid)
                    })
                })
            }))
        }
        await Promise.all(promises)
        return auctionHouseUuids
    }

    function checkPageForUuid(pageData, itemUuid) {
        if (stop) {
            return []
        }
        let auctionOwnerUuids = []
        let auctionUuid;
        pageData["auctions"].forEach((auction) => {
            const decompressedData = pako.inflate(Uint8Array.from(atob(auction["item_bytes"]), c => c.charCodeAt(0)))
            nbt.parse(decompressedData, (error, data) => {
                try {
                    auctionUuid = data["value"]["i"]["value"]["value"][0]["tag"]["value"]["ExtraAttributes"]["value"]["uuid"]["value"]
                    if (auctionUuid === itemUuid) {
                        auctionOwnerUuids.push(auction["auctioneer"])
                    }
                } catch (e) {/* empty */}
            })
        })
        donePages++
        updateLastProgressLine("Searching current auction house... <span style='color: #4ecca3'>(" + donePages + "/" + totalPages + ")</span>")
        return auctionOwnerUuids
    }

    import {draw} from "svelte/transition";

</script>

<div
        class="container"
        transition:fly={{ duration: 200 }}
>
    <div
            class="popup"
            use:clickOutside
            on:click_outside={() => $showDupePopup = false}
    >
        <h1>Dupe Checker</h1>
        {#each progressData as progressMessage}
            <p in:fly={{ duration: 200 }}>{@html progressMessage}</p>
        {/each}
        {#if apiError}
            <p><code style="color: #d02929">{apiError}</code></p>
        {/if}
        {#if result}
            <p class="result"><code style="color: #4ecca3">{result}</code></p>
        {/if}
        <form on:submit|preventDefault>

        </form>
    </div>
</div>


<style>
    .container {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        min-height: 100vh;
        width: 100vw;
        background: rgba(10, 10, 10, 0.71);
        z-index: 100;
    }

    .popup {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(145deg, rgb(32, 32, 52) 0%, rgb(31, 32, 52) 35%, rgb(32, 32, 70) 100%) no-repeat fixed;
        padding: 1rem;
        border-radius: 0.5rem;
        box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.5);
        width: 30rem;
        max-width: 80vw;
        max-height: 30rem;
        overflow-y: auto;
    }

    p {
        margin: .5rem;
        font-weight: 500;
    }

    h1 {
        border-bottom: 2px solid #4ecca3;
        padding-bottom: 0.5rem;
        margin-bottom: 1.0rem;
        padding-left: 0.5rem;
        font-size: 2.0rem;
        font-weight: 600;
    }

    .result {
        font-size: 1.1rem;
        font-weight: 600;
    }


</style>