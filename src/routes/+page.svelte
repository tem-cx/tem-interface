<script>
    import Typewriter from 'svelte-typewriter';
    let borderColour = "transparent";
    import discord from "$lib/discord-mark-white.png";
    import github from "$lib/github-mark-white.png";

</script>

<div class="container">
    <div class="center">
        <h1>
            This is <span class="i">i</span>TEM.
        </h1>
        <Typewriter
                interval={[40, 50, 60]}
                keepCursorOnFinish={true}
        >
            <h2>
                A comprehensive collection of Skyblock items.
            </h2>
        </Typewriter>
    </div>
    <div class="footer">
        <div class="discord">
            <img src={discord} alt="Discord" />
            <a href="https://discord.gg/wshPVHRtNF">Join our Discord</a>
        </div>
        <div class="github">
            <img src={github} alt="GitHub" />
            <a href="https://github.com/TGWaffles/TheExoticsMod">View on GitHub</a>
        </div>
    </div>
</div>



<style>
    .container {
        height: 100vh;
        width: 100vw;
    }

    .center {
        font-family: "Kanit", sans-serif;
        font-weight: 100;
        margin-left: 8vw;
        color: white;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
    }

    h1 {
        font-size: 7.7vw;
        font-weight: 100;
    }

    h2 {
        font-size: 2.7vw;
    }

    h2::after {
        --cursor-width: .5ch;
        --cursor-color: #403565;
    }

    .footer {
        position: absolute;
        bottom: 0;
        width: 100%;
        display: flex;
        justify-content: center;
    }

    .footer > div {
        display: flex;
        align-items: center;
        margin: 1.2rem 1vw;
        white-space: nowrap;
    }

    a {
        color: white;
        text-decoration: none;
        margin-left: 1vw;
    }


    .footer img {
        height: 26px;
    }

    @media only screen and (max-width: 600px) {
        h1 {
            font-size: 12vw;
        }

        h2 {
            font-size: 5vw;
        }
    }
</style>