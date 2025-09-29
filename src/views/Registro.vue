<script setup></script>

<template>

    <div class="body">

        <header>
            <p>OnPlay</p>
            <button>Iniciar Sesión</button>
        </header>
        
        <main>

            <div class="main_div">

                <h2>Todo el entretenimiento en un solo lugar.<br></br>Empieza a ver OnPlay hoy mismo.</h2>
                <p>¿Quieres ver OnPlay ya? Ingresa tu email para crear una cuenta o reiniciar tu membresía de OnPlay.</p>

                <div class="form_div">
                    <div class="input_div">
                        <input type="text" name="" id="">
                    </div>
                    <button>
                        Comenzar
                    </button>
                </div>

            </div>

        </main>

    </div>

</template>

<style scoped>

    .body {
        width: 100vw;
        height: 100vh;
        background: radial-gradient(50% 50% at 50% 50%, #666666 20.2%, #000000 100%);
        position: absolute;
    }

    header {
        width: 100%;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 40px;
        position: fixed;
    }

    header p {
        font-family: Inria Serif;
        font-size: 64px;
        text-align: end;
        color: rgba(237, 25, 71, 1);
        padding-right: 50px;
        padding-top: 20px;
    }

    header button {
        width: 160px;
        height: 40px;
        background-color: rgba(237, 25, 71, 1);
        color: white;
        font-size: 18px;
        border: 1px solid white;
        border-radius: 20px;
    }


    main {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .main_div {
        border: 1px solid white;
        width: 500px;
        background: radial-gradient(50% 50% at 50% 50%, rgba(90, 87, 87, 0.8) 10.1%, #201D1D 100%);
        padding: 30px;
        display: flex;
        flex-direction: column;
        gap: 30px;
        border-radius: 30px;
    }

    .main_div h2 {
        color: white;
        font-size: 34px;
        text-align: center;
    }

    .main_div p {
        color: white;
        font-size: 16px;
    }

    .form_div {
        display: flex;
        justify-content: space-between;
    }

    .input_div {
        width: 70%;
        background-color: rgba(217, 217, 217, 1);
        height: 40px;
        border-radius: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .input_div input {
        width: 92%;
        height: 70%;
        border-radius: 20px;
        border: none;
        padding: 0 20px;
    }

    .form_div button {
        width: 28%;
        background-color: rgba(237, 25, 71, 1);
        color: white;
        font-size: 16px;
        border: none;
        border-radius: 20px;
    }



</style>