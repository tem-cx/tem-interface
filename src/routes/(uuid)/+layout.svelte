<script lang="ts">
    import { createForm } from "svelte-forms-lib";
    import { page } from "$app/stores";
    import { hypixelApiKey } from "$lib/storable";
    import SvelteTooltip from "svelte-tooltip";
    import SubmitButton from "../../components/SubmitButton.svelte";
    import {showDupePopup} from "$lib/storable.js";
    import DupePopup from "../../components/DupePopup.svelte";
    let uuida = "";

    const { form, handleChange, handleSubmit } = createForm({
        initialValues: {
            uuid: "",
        },
        onSubmit: (values) => {
            location.href = `/${$page.url.pathname.split('/')[1]}/${values.uuid}`;
        },
    })

    if ($page.url.pathname.split("/").length > 2) {
        uuida = $page.url.pathname.split("/").pop();
        form.set({uuid: uuida});
    }

</script>

<form on:submit={handleSubmit}>
    <input type="text" name="uuid" placeholder="Enter Item UUID" on:change={handleChange} bind:value={uuida} />
    <SubmitButton/>
    {#if $hypixelApiKey}
        <button type="button" class="duped__active duped" on:click={() => {
            $showDupePopup = true;
        }}>Duped?</button>
    {:else}
        <button type="button" data-title="Please provide a Hypixel API Key in settings." class="duped__inactive duped" >Duped?</button>
    {/if}
</form>
{#if $showDupePopup}
    <DupePopup uuid={uuida}/>
{/if}
<slot />

<style>
    form {
        margin-top: 1rem;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .duped__active {
        background-color: #d02929;
        color: #fff;
    }

    .duped__active:hover {
        background-color: #d33838;
    }

    .duped__inactive {
        background-color: rgba(178, 35, 35, 0.72);
        color: #bbbaba;
    }

    .duped__inactive[data-title]:hover::after {
        content: attr(data-title);
        position: absolute;
        top: 110%;
        right: 0;
        transform: translate(0, 0);
        white-space: nowrap;
        padding: 0.5rem;
        background-color: #4a4b4d;
        color: #fff;
        border-radius: 0.25rem;
        font-size: 0.75rem;
        cursor: default;
    }

    .duped__inactive[data-title]:hover::before {
        content: "";
        position: absolute;
        top: 101%;
        border-left: 0.5rem solid transparent;
        border-right: 0.5rem solid transparent;
        border-bottom: 0.5rem solid #4a4b4d;
    }

    .duped__inactive:hover {
        cursor: not-allowed;
    }

    .duped {
        position: relative;
        border: none;
        border-radius: 7px;
        padding: 12px 13px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
        transition-duration: 0.1s;
    }


    @media (max-width: 1000px) {
        input {
            width: 60% !important;
        }
    }
</style>