<script setup>
    import { ref, onMounted } from "vue";

    const peliculas = ref([]);
    const title = ref("Avengers");

    onMounted(async () => {
    try {
        const res = await fetch("/data/peliculas.json");
        peliculas.value = await res.json();
    } catch (error) {
        console.error("Error cargando películas:", error);
    }
    });


    const handleTitle = (name) => {
        title.value = name;
    }

</script>

<template>
    <section class="catalog-content" :style="{ backgroundImage: `url(${background})` }">
            <h1 class="title">{{ title }}</h1>
            <div class="meta">
                <span class="badge">C18</span>
                <span>2018</span>
            </div>
            <p class="description">Jackson, una estrella de la música country con problemas de alcoholismo, descubre el talento de Ally, una joven cantante de la cual se enamora. Mientras la carrera de ella despega, Jackson percibe que sus días de gloria están llegando a su fin.</p>

            <div class="actions">
                <button class="btn watch">▶ Ver</button>
                <button class="btn list">+ Añadir a Lista</button>
                <button class="btn trailer">Trailer</button>
            </div>

            <!-- Carrusel de películas -->
            <section class="carousel">
                <h2>Recientes</h2>
                <div class="carousel-items">
                    <div v-for="(pelicula, index) in peliculas" :key="index" class="card"
                        @click="handleTitle(pelicula.nombre)"
                    >
                        <img :src="pelicula.src" alt="">
                        <p>{{ pelicula.nombre }}</p>
                    </div>
                </div>
            </section>

            <section class="carousel">
                <h2>Populares</h2>
                <div class="carousel-items">
                    <div v-for="(pelicula, index) in peliculas" :key="index" class="card">
                        <img :src="pelicula.src" alt="">
                        <p>{{ pelicula.nombre }}</p>
                    </div>
                </div>
            </section>
        </section>
</template>

<style scoped>

    .title {
        font-family: "Staatliches", sans-serif;
        font-size: 74px;
        font-weight: bold;
    }

    .meta {
        display: flex;
        gap: 10px;
        margin: 10px 0;
        color: #aaa;
    }
    .badge {
        border: 1px solid #888;
        padding: 2px 6px;
        border-radius: 4px;
    }
    .description {
        font-family: Arial, Helvetica, sans-serif;
        color: #bbb;
        margin: 10px 0;
        width: 70%;
    }

    .actions {
        display: flex;
        gap: 10px;
        margin: 40px 0 80px;
    }
    .btn {
        padding: 8px 16px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        font-weight: bold;
    }
    .watch { background: #e50914; color: #fff; }
    .list { background: #333; color: #fff; }
    .trailer { background: #555; color: #fff; }

    .carousel {
        margin-top: 50px;
    }
    .carousel h2 {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 20px;
        margin-bottom: 10px;
    }
    .carousel-items {
        display: flex;
        gap: 30px;
        overflow-x: auto;
        padding-bottom: 10px;
    }
    .card {
        width: 200px;
        height: 200px;
        background: #222;
        display: flex;
        align-items: flex-end;
        justify-content: baseline;
        border-radius: 6px;
        flex-shrink: 0;
        position: relative;
        cursor: pointer;
    }

    .card img {
        width: 100%;
        object-fit: contain;
    }

    .card p {
        position: absolute;
        margin-left: 10px;
        margin-bottom: 5px;
    }
    .card:hover {
        background: #333;
    }
    .carousel-items::-webkit-scrollbar {
        height: 8px;   
    }

    .carousel-items::-webkit-scrollbar-track {
        background: #111;  
        border-radius: 10px;
    }

    .carousel-items::-webkit-scrollbar-thumb {
        background: #555;  
        border-radius: 10px;
    }

    .carousel-items::-webkit-scrollbar-thumb:hover {
        background: #777;  
    }
</style>