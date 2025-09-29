<script setup></script>

<template>

    <div class="body">
        <main>
            <div class="account_div">
                <h2>Hola Ever</h2>
                <img src="https://cdn-icons-png.flaticon.com/512/219/219983.png" alt="">
            </div>

            <div class="chooser_div">
                <p>Escoge tu perfil</p>
                <div class="accounts_div">
                    <img src="https://cdn-icons-png.flaticon.com/512/219/219983.png" alt="">
                    <img src="https://cdn-icons-png.flaticon.com/512/219/219983.png" alt="">
                    <img src="https://cdn-icons-png.flaticon.com/512/219/219983.png" alt="">
                    <img src="https://cdn-icons-png.flaticon.com/512/219/219983.png" alt="">
                    <img src="https://cdn-icons-png.flaticon.com/512/219/219983.png" alt="">
                    <img src="https://cdn-icons-png.flaticon.com/512/219/219983.png" alt="">
                    <img src="https://cdn-icons-png.flaticon.com/512/219/219983.png" alt="">
                    <img src="https://cdn-icons-png.flaticon.com/512/219/219983.png" alt="">
                    <img src="https://cdn-icons-png.flaticon.com/512/219/219983.png" alt="">
                </div>
            </div>

            <button>Confirmar</button>

        </main>
    </div>

</template>

<style scoped>

    .body {
        width: 100vw;
        height: 100vh;
        background: linear-gradient(248.7deg, #030A1B 26.28%, #EF2125 206.69%);
    }

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 50px 0 0 0;
    }

    .account_div {
        display: flex;
        flex-direction: column;
        gap: 30px;
        align-items: center;
    }

    .account_div h2 {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 32px;
        color: white;
        text-align: center;
    }

    img {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .chooser_div {
        display: flex;
        flex-direction: column;
        padding-top: 40px;
        gap: 10px;
    }

    .chooser_div p {
        color: white;
        font-family: Arial, Helvetica, sans-serif;
        text-align: center;
    }

    .chooser_div div {
        display: flex;
        flex-direction: row;
        width: 682px;
        flex-wrap: wrap;
        gap: 20px;
    }

    button {
        background-color: rgba(34, 142, 229, 1);
        color: white;
        width: 100px;
        height: 30px;
        border: none;
        border-radius: 10px;
        margin-top: 20px;
    }

</style>