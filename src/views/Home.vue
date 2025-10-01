<script setup>
import HomeNavbar from '../components/HomeNavbar.vue';


</script>

<template>
    <div class="home-layout">
        <HomeNavbar/>

        <!-- Aquí se cargan las secciones como Catálogo -->
        <main class="content">
            <RouterView></RouterView>
        </main>
    </div>
</template>


<style scoped>
    .home-layout {
        display: flex;
        min-height: 100vh;
        background: #000;
        color: #fff;
    }

    .content {
        flex: 1;
        padding: 20px;
        padding-left: 40px;
        width: calc(100% - 80px)
    }
</style>