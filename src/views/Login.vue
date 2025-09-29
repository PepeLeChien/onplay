<template>
    <div class="body">
        <header>
            <p>OnPlay</p>
        </header>

        <main>
            <section class="form_div">
                <h1>Bienvenido</h1>
                <div class="navigation">
                    <p>ENTRAR</p>
                    <p>REGISTRATE</p>
                </div>
                <div class="input_div">
                    <input type="text">
                    <img src="" alt="">
                </div>
                <div class="input_div">
                    <input type="password">
                    <img src="" alt="">
                </div>
                <p>Olvidaste tu contraseña?</p>
                <button>ENTRAR</button>
            </section>
            <section class="img_div">
                <img src="https://www.infobae.com/new-resizer/Zq227nOmsISA9xjcCSjq91KEJws=/arc-anglerfish-arc2-prod-infobae/public/QYUVGM2RSNFDTFAEEEC6CLB66Y.jpg" alt="">
            </section>
        </main>
    </div>
    
</template>

<script setup>

</script>

<style scoped>
    .body {
        width: 100vw;
        height: 100vh;
        background: linear-gradient(248.7deg, #030A1B 26.28%, #EF2125 206.69%);
    }

    header {
        height: 100px;
    }

    header p {
        font-family: Inria Serif;
        font-size: 64px;
        text-align: end;
        color: rgba(237, 25, 71, 1);
        padding-right: 50px;
        padding-top: 20px;
    }

    main {
        display: flex;
    }


    h1 {
        font-size: 64px;
        color: white;
        font-family: Arial, Helvetica, sans-serif;
    }

    .navigation {
        width: 300px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 16px;
    }

    .navigation p{
        font-size: 24px;
        color: white;
        font-family: Arial, Helvetica, sans-serif;
    }

    .input_div {
        width: 200px;
        height: 38px;
    }

    .input_div input {
        width: 100%;
        height: 100%;
        background: none;
        border: white 1px solid;
        border-radius: 10px;
        padding: 5px 10px;
        color: white;
    }


    section p {
        font-size: 16px;
        color: white;
    }

    section button {
        color: white;
        background-color: rgba(34, 142, 229, 1);
        width: 120px;
        height: 40px;
        border-radius: 10px;
        border: none;
        cursor: pointer;
    }

    .img_div {
        width: 60%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .img_div img{
        width: 600px;
        padding-top: 40px;
    }

    .form_div {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 40%;
        padding-top: 20px;
        gap: 20px;
    }

</style>
