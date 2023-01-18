<script lang="ts">
    import "$lib/global.css";
    import Header from "../components/Header.svelte";
    import Settings from "../components/Settings.svelte";
    import {showSettings} from "$lib/storable.ts";
    
</script>

<Header />
{#if $showSettings}
    <Settings />
{/if}
<slot/>