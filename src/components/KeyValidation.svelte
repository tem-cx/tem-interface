<script lang="ts">
    import {onMount} from "svelte";
    import axios from "axios";
    let apiKey: string;
    let connectionStatus: "waiting" | "connecting" | "disconnected" | "connected" = "connecting";
    const MY_CONTRIBS_URL = "https://api.tem.cx/my_contributions?key=";

    const validateApiKey = async (): Promise<boolean> => {
        connectionStatus = "connecting";
        if (apiKey == null) connectionStatus = "waiting";
        else {
            try {
                const response = await axios.get(MY_CONTRIBS_URL + apiKey + "&" + Date.now());
                if (response.status === 200) {
                    connectionStatus = "connected";
                    localStorage.setItem("apiKey", apiKey);
                    return true;
                }
            } catch (e) {
                connectionStatus = "disconnected";
                return false;
            }
        }
    }

    onMount(() => {
        apiKey = localStorage.getItem("apiKey");
        validateApiKey();
        window.addEventListener('paste', (e: ClipboardEvent) => {
            if (connectionStatus === "connected") return;
            apiKey = e.clipboardData.getData('text/plain');
            validateApiKey();
        });
    });
</script>

<div class="validation">
    {#if connectionStatus === "connecting"}
        <h1 class="status connecting">connecting...</h1>
    {:else if connectionStatus === "waiting"}
        <h1 class="status waiting">copy & paste your key</h1>
    {:else if connectionStatus === "connected"}
        <div class="content">
            <slot />
        </div>
    {:else if connectionStatus === "disconnected"}
        <h1 class="status disconnected">couldn't connect.</h1>
        <h2 class="status disconnected">try again?</h2>
    {/if}
</div>

<style>
    .content {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .status {
        font-size: 2.8vw;
        font-family: "Montserrat", serif;
        font-weight: 1000;
        position: relative;
        text-align: center;
        top: 50%;
        transform: translateY(-50%);
    }

    .validation {
        height: 100%;
    }

    .connecting {
        color: #65c765;
    }

    .waiting {
        color: #736e6e;
    }

    .disconnected {
        color: #c76565;
    }
</style>