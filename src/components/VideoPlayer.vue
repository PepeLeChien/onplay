<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const videoUrl = ref(null)
const loading = ref(true)
const error = ref(null)
const videoTitle = ref('')
const videoPath = ref(null)
const videoElement = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const isFullscreen = ref(false)

// Obtener el path del video desde los parámetros de ruta o query
onMounted(async () => {
    let path = route.params.path || route.query.path
    const title = route.params.title || route.query.title || 'Video'

    // Si el path viene como parámetro de ruta, puede venir codificado
    if (path) {
        try {
            path = decodeURIComponent(path)
        } catch (e) {
            console.warn('Error decodificando path:', e)
        }
    }

    videoPath.value = path
    videoTitle.value = typeof title === 'string' ? decodeURIComponent(title) : 'Video'

    if (path) {
        await fetchVideoUrl(path)
    } else {
        error.value = 'No se proporcionó un path de video'
        loading.value = false
    }
})

const fetchVideoUrl = async (path) => {
    loading.value = true
    error.value = null

    try {
        const accessToken = localStorage.getItem('accessToken')

        if (!accessToken) {
            throw new Error('No se encontró el token de autenticación')
        }

        console.log('Fetching video URL for path:', path)
        const response = await fetch(`http://127.0.0.1:3000/videos/getVideoUrl?path=${path}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        })

        console.log('Response status:', response.status)

        if (response.status != 200) {
            throw new Error('Error al obtener la URL del video')
        }

        const { data } = await response.json()

        if (data.presignedUrl) {

            videoUrl.value = data.presignedUrl
        } else {
            throw new Error('No se recibió una URL válida del video')
        }
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Error de conexión'
        console.error('Error fetching video URL:', err)
    } finally {
        loading.value = false
    }
}

const togglePlay = () => {
    if (videoElement.value) {
        if (isPlaying.value) {
            videoElement.value.pause()
        } else {
            videoElement.value.play()
        }
        isPlaying.value = !isPlaying.value
    }
}

const handleTimeUpdate = () => {
    if (videoElement.value) {
        currentTime.value = videoElement.value.currentTime
        duration.value = videoElement.value.duration
    }
}

const handleLoadedMetadata = () => {
    if (videoElement.value) {
        duration.value = videoElement.value.duration
    }
}

const handlePlay = () => {
    isPlaying.value = true
}

const handlePause = () => {
    isPlaying.value = false
}

const seek = (event) => {
    if (videoElement.value) {
        const rect = event.currentTarget.getBoundingClientRect()
        const pos = (event.clientX - rect.left) / rect.width
        videoElement.value.currentTime = pos * duration.value
    }
}

const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
}

const toggleFullscreen = () => {
    if (!document.fullscreenElement && videoElement.value) {
        videoElement.value.requestFullscreen().then(() => {
            isFullscreen.value = true
        }).catch(err => {
            console.error('Error al entrar en pantalla completa:', err)
        })
    } else {
        document.exitFullscreen().then(() => {
            isFullscreen.value = false
        }).catch(err => {
            console.error('Error al salir de pantalla completa:', err)
        })
    }
}

const handleVolumeChange = (event) => {
    if (videoElement.value) {
        volume.value = event.target.value
        videoElement.value.volume = volume.value
    }
}

const goBack = () => {
    router.back()
}

onUnmounted(() => {
    if (videoElement.value) {
        videoElement.value.pause()
        videoElement.value = null
    }
})
</script>

<template>
    <div class="video-player-container">
        <div class="video-header">
            <button @click="goBack" class="back-button">← Volver</button>
            <h1 class="video-title">{{ videoTitle }}</h1>
        </div>

        <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Cargando video...</p>
        </div>

        <div v-else-if="error" class="error-container">
            <p class="error-message">{{ error }}</p>
            <button @click="goBack" class="back-button">Volver</button>
        </div>

        <div v-else-if="videoUrl" class="video-wrapper">
            <video ref="videoElement" :src="videoUrl" class="video-player" @timeupdate="handleTimeUpdate"
                @loadedmetadata="handleLoadedMetadata" @play="handlePlay" @pause="handlePause"
                @click="togglePlay"></video>

            <div class="video-controls">
                <div class="controls-top">
                    <button @click="togglePlay" class="control-button">
                        {{ isPlaying ? '⏸' : '▶' }}
                    </button>

                    <div class="progress-container" @click="seek">
                        <div class="progress-bar">
                            <div class="progress-fill"
                                :style="{ width: duration ? (currentTime / duration * 100) + '%' : '0%' }"></div>
                        </div>
                    </div>

                    <div class="time-display">
                        {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
                    </div>
                </div>

                <div class="controls-bottom">
                    <div class="volume-control">
                        <span>🔊</span>
                        <input type="range" min="0" max="1" step="0.1" :value="volume" @input="handleVolumeChange"
                            class="volume-slider" />
                    </div>

                    <button @click="toggleFullscreen" class="control-button">
                        ⛶
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.video-player-container {
    width: 100%;
    min-height: 100vh;
    background: #000;
    color: #fff;
    padding: 20px;
}

.video-header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 20px;
}

.back-button {
    padding: 10px 20px;
    background: #333;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.3s ease;
}

.back-button:hover {
    background: #555;
}

.video-title {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
}

.loading-container,
.error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    gap: 20px;
}

.loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #333;
    border-top: 4px solid #EF2125;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.error-message {
    color: #EF2125;
    font-size: 18px;
}

.video-wrapper {
    position: relative;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    background: #000;
    border-radius: 8px;
    overflow: hidden;
}

.video-player {
    width: 100%;
    height: auto;
    max-height: 80vh;
    display: block;
    cursor: pointer;
}

.video-controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.video-wrapper:hover .video-controls {
    opacity: 1;
}

.controls-top {
    display: flex;
    align-items: center;
    gap: 15px;
}

.control-button {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: #fff;
    padding: 10px 15px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 18px;
    transition: background 0.3s ease;
}

.control-button:hover {
    background: rgba(255, 255, 255, 0.3);
}

.progress-container {
    flex: 1;
    height: 6px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
    cursor: pointer;
    position: relative;
}

.progress-bar {
    width: 100%;
    height: 100%;
    position: relative;
}

.progress-fill {
    height: 100%;
    background: #EF2125;
    border-radius: 3px;
    transition: width 0.1s linear;
}

.time-display {
    font-size: 14px;
    color: #fff;
    min-width: 100px;
    text-align: right;
}

.controls-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.volume-control {
    display: flex;
    align-items: center;
    gap: 10px;
}

.volume-slider {
    width: 100px;
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    outline: none;
    cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    background: #EF2125;
    border-radius: 50%;
    cursor: pointer;
}

.volume-slider::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: #EF2125;
    border-radius: 50%;
    cursor: pointer;
    border: none;
}
</style>
