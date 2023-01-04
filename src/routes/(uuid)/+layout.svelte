<script lang="ts">
    import { createForm } from "svelte-forms-lib";
    import { page } from "$app/stores";
    import SubmitButton from "../../components/SubmitButton.svelte";
    import {onMount} from "svelte";
    let uuida = "";

    const { form, handleChange, handleSubmit } = createForm({
        initialValues: {
            uuid: "",
        },
        onSubmit: (values) => {
            console.log("dsjfjdsk")
            console.log(values)
            console.log(`/${$page.url.pathname.split('/')[1]}/${values.uuid}`)
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