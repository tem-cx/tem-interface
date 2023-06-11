<script>
    import { page } from '$app/stores';
</script>

<error-container>
    <p class="error-message">{$page.error.message}</p>
    <a href="/" target="_self">Go back home</a>
</error-container>

<style>
    error-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        text-align: center;
        gap: 10px;
    }

    .error-title {
        font-size: 2rem;
        font-weight: 500;
        color: #f0f0f0;
    }

    .error-message {
        font-size: 1.5rem;
        font-weight: 500;
        color: rgb(228, 31, 31);
    }

    a {
        color: #4ecca3;
        font-size: 1.5rem;
        font-weight: 500;
    }
</style>