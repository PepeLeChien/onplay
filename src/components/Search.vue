<template>
  <div class="search-page">
    <h1>Buscar Películas</h1>
    <input
      v-model="query"
      type="text"
      placeholder="Buscar por título..."
      class="search-input"
    />

    <p v-if="filteredVideos.length" class="result-count">
      Resultados encontrados: {{ filteredVideos.length }}
    </p>

    <div v-if="errorMessage" class="error-message">
      <p>{{ errorMessage }}</p>
    </div>

    <div v-if="filteredVideos.length" class="video-grid">
      <div
        v-for="(video, index) in filteredVideos"
        :key="index"
        class="video-card"
      >
        <img :src="video.src || defaultImage" alt="Miniatura" />
        <div class="video-info">
          <h3>{{ video.nombre }}</h3>
        </div>
      </div>
    </div>

    <div v-else class="no-results">
      <p>No se encontraron resultados para "{{ query }}".</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMainStore } from '../stores/main'
import defaultImage from '../assets/images.jpeg'

const query = ref('')
const videos = ref([])
const errorMessage = ref('')
const mainStore = useMainStore()

const fetchFromBackend = async (token) => {
  try {
    const res = await fetch('http://127.0.0.1:3000/videos/getVideos', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!res.ok) {
      throw new Error('Token inválido o backend no disponible. Usando datos locales.')
    }

    const result = await res.json()
    if (result.success && Array.isArray(result.data)) {
      videos.value = result.data.map(video => ({
        nombre: video.title || 'Sin título',
        descripcion: video.description || '',
        url: video.url || null,
        src: null
      }))
    } else {
      throw new Error('Respuesta inesperada del backend')
    }
  } catch (error) {
    console.error(error.message)
    await fetchFromLocal()
  }
}

const fetchFromLocal = async () => {
  try {
    const res = await fetch('/data/peliculas.json')
    const data = await res.json()
    videos.value = data.map(p => ({
      nombre: p.nombre,
      src: p.src || null
    }))
    console.log('Usando datos locales desde peliculas.json')
  } catch (error) {
    console.error('No se pudo cargar datos locales.')
    errorMessage.value = 'No se pudo cargar datos locales.'
  }
}

onMounted(async () => {
  const token = mainStore.token
  if (!token) {
    console.warn('No hay token disponible. Usando datos locales.')
    await fetchFromLocal()
    return
  }

  await fetchFromBackend(token)
})

const filteredVideos = computed(() => {
  const q = query.value.toLowerCase()
  return videos.value.filter(video =>
    video.nombre.toLowerCase().includes(q)
  )
})
</script>

<style scoped>
.search-page {
  padding: 2rem;
  max-width: 1000px;
  margin: auto;
}
.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  border: 2px solid #007bff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.result-count {
  margin-bottom: 1rem;
  font-weight: bold;
  color: #333;
}
.error-message {
  background-color: #ffe0e0;
  color: #a00;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  text-align: center;
}
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
}
.video-card {
  background-color: #421d1d;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
}
.video-card:hover {
  transform: scale(1.03);
}
.video-card img {
  width: 100%;
  height: 240px;
  object-fit: cover;
}
.video-info {
  padding: 0.75rem;
  text-align: center;
}
.video-info h3 {
  font-size: 1rem;
  margin: 0;
}
.no-results {
  margin-top: 2rem;
  font-style: italic;
  color: #666;
  text-align: center;
}
</style>