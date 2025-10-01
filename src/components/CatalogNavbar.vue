<script setup>

</script>

<template>
    <nav class="catalog-navbar">
        <router-link to="/home" class="links active">Todos</router-link>
        <router-link to="/home/movies" class="links">Películas</router-link>
        <router-link to="/home/shows" class="links">TV Shows</router-link>
    </nav>
</template>

<style scoped>
    .catalog-navbar {
        display: flex;
        gap: 50px;
        margin-bottom: 20px;
        padding: 20px 0;
    }
    .catalog-navbar .links {
        font-family: "Staatliches", sans-serif;
        color: #484848;
        text-decoration: none;
        font-weight: bold;
        font-size: 30px;
    }
    .catalog-navbar a.active,
    .catalog-navbar a:hover {
        color: #fff;
    }
</style>