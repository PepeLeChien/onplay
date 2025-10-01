<script setup>
import { RouterView } from 'vue-router';
import CatalogNavbar from './CatalogNavbar.vue';


</script>

<template>
    <div>
        <!-- Navbar secundario -->
        <CatalogNavbar/>

        <!-- Contenido de "All" -->
        <RouterView></RouterView>
        
    </div>
</template>


<style scoped>


</style>