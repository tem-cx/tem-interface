<script lang="ts">
    import { createForm } from "svelte-forms-lib";
    import { page } from "$app/stores";
    import SubmitButton from "../../components/SubmitButton.svelte";
    import {onMount} from "svelte";
    let identifier = "";

    const {form, handleChange, handleSubmit } = createForm({
        initialValues: {
            identifier: "",
        },
        onSubmit: (values) => {
            location.href = `/player/${values.identifier}`;
        },
    })

    if ($page.url.pathname.split("/").length > 2) {
            identifier = $page.url.pathname.split("/").pop();
            form.set({identifier: identifier});
        }

</script>

<form on:submit={handleSubmit}>
    <input type="text" name="identifier" placeholder="Enter Player Name/UUID" on:change={handleChange} bind:value={identifier} />
    <SubmitButton/>
</form>
<slot />

<style>
    form {
        margin-top: 1rem;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    @media (max-width: 1000px) {
        input {
            width: 60% !important;
        }
    }
</style>