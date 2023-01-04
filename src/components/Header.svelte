<script>
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import Select from "svelte-select";
    import logo from "$lib/tem.png";
    const searchMethods = [
        {value: "item", label: "Lookup Item by UUID"},
        {value: "pet", label: "Lookup Pet by UUID"},
        {value: "player", label: "Lookup Player"},
    ]
    let searchMethod = "";

    $: if (searchMethod) {
        if (!$page.url.pathname.includes(searchMethod.value)) {
            location.href = `/${searchMethod.value}`;
        }
    }

    searchMethod = searchMethods.find(m => m.value === $page.url.pathname.slice(1).split("/")[0]);
</script>

<div class="header">
    <img class="logo" src={logo} alt="tem logo">
    <div class="search">
        <Select
                on:clear={() => goto("/")}
                items={searchMethods}
                placeholder="Search for..."
                bind:value={searchMethod}
        />
    </div>
</div>

<style lang="css">
    .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 5rem;
        width: 100%;
        backdrop-filter: blur(10px);
        position: sticky;
        box-shadow: rgba(0, 0, 0, 0.09) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px;
    }

    .logo {
        height: 9rem;
        margin-left: 1rem;
    }

    .search {
        margin-left: auto;
        margin-right: 2rem;
        --width: 300px;
        --border-radius: 10px;
        --border: 1px solid #373b42;
        --border-hover: 1px solid #28292a;
        --border-focused: 1px solid #123456;
        --background: #393E46;
        --input-color: #888;
        --placeholder-color: #888;
        --item-color: #fff;
        --list-background: #393E46;
        --item-hover-bg: #28292a;
        --item-hover-color: #fff;
        --item-is-active-bg: #202121;
        --icons-color: #fff;
        --selected-item-color: #fff;
    }

    :global(.search > :not(span)) {
        font-family: 'Montserrat', sans-serif;
    }

    @media only screen and (max-width: 600px) {
        .header {
            flex-direction: column;
            min-height: 8rem;
            justify-content: center;
        }

        .search {
            margin: 0;
        }

        .logo {
            height: 5rem;
            margin-left: 0;
            margin-top: -1rem;
        }
    }
</style>