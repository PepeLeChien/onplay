<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '../stores/main'

const router = useRouter()

const loading = ref(false)
const uploading = ref(false)
const error = ref(null)
const success = ref(false)
// const userRole = ref(null)
// const checkingRole = ref(true)
const mainStore = useMainStore();

const videoFile = ref(null)
const videoTitle = ref('')
const videoDescription = ref('')
const videoPreview = ref(null)

// Verificar el rol del usuario
const checkUserRole = async () => {
    // checkingRole.value = true
    error.value = null

    try {
        const token = localStorage.getItem('accessToken');

        if (!token) {
            error.value = 'No se encontró el token de autenticación'
            // checkingRole.value = false
            router.push('/login')
            return
        }

        /* const response = await fetch('http://127.0.0.1:3000/userDetails', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error('Error al obtener los datos del usuario')
        }

        const data = await response.json()
        const userData = data.data || data */

        // Verificar si el usuario tiene el rol PRODUCER
        /* if (userData.role === 'PRODUCER') {
            userRole.value = 'PRODUCER'
        } else {
            error.value = 'No tienes permisos para acceder a esta sección. Solo los productores pueden subir videos.'
            setTimeout(() => {
                router.push('/home')
            }, 3000)
        } */
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Error de conexión'
        console.error('Error checking user role:', err)
    } finally {
        // checkingRole.value = false
        return;
    }
}

// Manejar selección de archivo
const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
        // Validar tipo de archivo
        const validTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm']
        if (!validTypes.includes(file.type)) {
            error.value = 'Por favor selecciona un archivo de video válido (MP4, MPEG, MOV, AVI, WEBM)'
            return
        }

        // Validar tamaño (por ejemplo, máximo 500MB)
        const maxSize = 500 * 1024 * 1024 // 500MB
        if (file.size > maxSize) {
            error.value = 'El archivo es demasiado grande. El tamaño máximo es 500MB'
            return
        }

        videoFile.value = file
        error.value = null

        // Crear preview del video
        if (videoPreview.value) {
            videoPreview.value.src = URL.createObjectURL(file)
        }
    }
}

// Subir el video
const uploadVideo = async () => {
    if (!videoFile.value) {
        error.value = 'Por favor selecciona un archivo de video'
        return
    }

    if (!videoTitle.value.trim()) {
        error.value = 'Por favor ingresa un título para el video'
        return
    }

    uploading.value = true
    error.value = null
    success.value = false

    try {
        const token = localStorage.getItem('accessToken')

        if (!token) {
            throw new Error('No se encontró el token de autenticación')
        }

        // Primero, obtener la URL presignada para subir el video
        const getUploadUrlResponse = await fetch('https://j2ddh84hp9.execute-api.us-west-2.amazonaws.com/Prod/videos/generatePresignedUrl', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            /* body: JSON.stringify({
                fileName: videoFile.value.name,
                contentType: videoFile.value.type
            }) */
        })

        if (!getUploadUrlResponse.ok) {
            throw new Error('Error al obtener la URL de subida')
        }

        const uploadData = await getUploadUrlResponse.json()
        const presignedUrl = uploadData.data?.presignedUrl || uploadData.presignedUrl

        if (!presignedUrl) {
            throw new Error('No se recibió una URL de subida válida')
        }

        // Subir el archivo a S3 usando la URL presignada
        const uploadResponse = await fetch(presignedUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': videoFile.value.type
            },
            body: videoFile.value
        })

        if (!uploadResponse.ok) {
            throw new Error('Error al subir el archivo')
        }

        // Registrar el video en la base de datos
        const videoPath = uploadData.data?.path || uploadData.path || videoFile.value.name

        const registerResponse = await fetch('http://127.0.0.1:3000/videos/saveVideo', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: videoTitle.value,
                description: videoDescription.value,
                url: videoPath,
                duration: 100,
                category: 'General'
            })
        })

        if (!registerResponse.ok) {
            const errorData = await registerResponse.json()
            throw new Error(errorData.message || 'Error al registrar el video')
        }

        success.value = true
        // Limpiar el formulario
        videoFile.value = null
        videoTitle.value = ''
        videoDescription.value = ''
        if (videoPreview.value) {
            videoPreview.value.src = ''
        }
        const fileInput = document.querySelector('input[type="file"]')
        if (fileInput) {
            fileInput.value = ''
        }

        // Ocultar el mensaje de éxito después de 5 segundos
        setTimeout(() => {
            success.value = false
        }, 5000)

    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Error al subir el video'
        console.error('Error uploading video:', err)
    } finally {
        uploading.value = false
    }
}

onMounted(() => {
    checkUserRole()
})
</script>

<template>
    <div class="upload-container">
        <h1 class="upload-title">Subir Video</h1>

        <div v-if="success" class="success-message">
            ✅ Video subido exitosamente
        </div>

        <div v-if="error" class="error-message">
            {{ error }}
        </div>

        <form @submit.prevent="uploadVideo" class="upload-form">
            <div class="form-group">
                <label for="videoFile" class="form-label">Seleccionar Video</label>
                <input id="videoFile" type="file" accept="video/*" @change="handleFileSelect" class="file-input"
                    :disabled="uploading" />
                <p class="form-hint">Formatos soportados: MP4, MPEG, MOV, AVI, WEBM (máx. 500MB)</p>
            </div>

            <div v-if="videoFile" class="video-preview-container">
                <video ref="videoPreview" controls class="video-preview"></video>
                <p class="file-name">{{ videoFile.name }} ({{ (videoFile.size / 1024 / 1024).toFixed(2) }} MB)</p>
            </div>

            <div class="form-group">
                <label for="videoTitle" class="form-label">Título del Video *</label>
                <input id="videoTitle" v-model="videoTitle" type="text" placeholder="Ingresa el título del video"
                    class="form-input" :disabled="uploading" required />
            </div>

            <div class="form-group">
                <label for="videoDescription" class="form-label">Descripción</label>
                <textarea id="videoDescription" v-model="videoDescription"
                    placeholder="Ingresa una descripción del video (opcional)" class="form-textarea"
                    :disabled="uploading" rows="4"></textarea>
            </div>

            <button type="submit" class="submit-button" :disabled="uploading || !videoFile || !videoTitle.trim()">
                <span v-if="uploading">Subiendo...</span>
                <span v-else>Subir Video</span>
            </button>
        </form>
    </div>
</template>

<style scoped>
.upload-container {
    width: 100%;
    min-height: 100vh;
    background: #000;
    color: #fff;
    padding: 40px;
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
    text-align: center;
}

.upload-form-container {
    max-width: 800px;
    margin: 0 auto;
}

.upload-title {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 30px;
    text-align: center;
}

.success-message {
    background: rgba(76, 175, 80, 0.2);
    border: 1px solid #4CAF50;
    color: #4CAF50;
    padding: 15px;
    border-radius: 6px;
    margin-bottom: 20px;
    text-align: center;
    font-weight: bold;
}

.upload-form {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.form-label {
    font-size: 16px;
    font-weight: bold;
    color: #fff;
}

.form-input,
.form-textarea {
    padding: 12px;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 6px;
    color: #fff;
    font-size: 14px;
    font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
    outline: none;
    border-color: #EF2125;
}

.form-input:disabled,
.form-textarea:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.form-textarea {
    resize: vertical;
    min-height: 100px;
}

.file-input {
    padding: 10px;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 6px;
    color: #fff;
    cursor: pointer;
}

.file-input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.form-hint {
    font-size: 12px;
    color: #aaa;
    margin-top: 5px;
}

.video-preview-container {
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.video-preview {
    width: 100%;
    max-height: 400px;
    background: #000;
    border-radius: 6px;
}

.file-name {
    font-size: 14px;
    color: #aaa;
    text-align: center;
}

.submit-button {
    padding: 15px 30px;
    background: #EF2125;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s ease;
    margin-top: 10px;
}

.submit-button:hover:not(:disabled) {
    background: #d0191c;
}

.submit-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>
