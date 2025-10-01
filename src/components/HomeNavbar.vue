<script setup>

</script>

<template>
    <aside class="sidebar">
        <router-link to="/home" class="menu-item"><img src="../assets/casita.svg" alt=""></router-link>
        <router-link to="/home/search" class="menu-item"><img src="../assets/lupa.svg" alt=""></router-link>
        <router-link to="/home/pagos" class="menu-item"><img src="../assets/tarjeta.svg" alt=""></router-link>
        <router-link to="/home/account" class="menu-item"><img src="../assets/cuenta.svg" alt=""></router-link>
    </aside>
</template>

<style scoped>
    .sidebar {
        width: 80px;
        height: 100vh;
        background: #111;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px 0;
        justify-content: space-around;
        position: sticky;
        top: 0;
    }

    .menu-item {
        margin: 20px 0;
        color: #aaa;
        cursor: pointer;
        text-align: center;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .menu-item:hover,
    .router-link-active {
        color: #fff;
        font-weight: bold;
        background: #1D1D1D;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.0748) 50.85%, rgba(255, 255, 255, 0) 100%);

    }

</style>