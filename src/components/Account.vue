<script setup>
import { ref, onMounted } from 'vue'
import { useMainStore } from '../stores/main'


const userDetails = ref(null)
const loading = ref(true)
const error = ref(null)
const selectedMenu = ref('Ayuda')
const mainStore = useMainStore();
const API_URL = import.meta.env.VITE_API_URL

const menuOptions = [
    'Ayuda',
    'Subcripciones',
    'Problemas',
    'Contacto',
    'Cambio de planes',
    'Cambio de contraseña',
    'Terminos y condiciones',
    'Tarjetas de credito'
]

const fetchUserDetails = async () => {
    loading.value = true
    error.value = null

    try {
        const token = mainStore.token

        if (!token) {
            error.value = 'No se encontró el token de autenticación'
            loading.value = false
            return
        }

        const response = await fetch(`${API_URL}/userDetails`, {
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

        // La respuesta viene dentro de data según la interfaz
        if (data.data) {
            userDetails.value = data.data
        } else {
            userDetails.value = data
        }
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'Error de conexión'
        console.error('Error fetching user details:', err)
    } finally {
        loading.value = false
    }
}

const selectMenu = (menu) => {
    selectedMenu.value = menu
}

const logout = () => {
    mainStore.logout();
    window.location.href = '/login'
}

onMounted(() => {
    fetchUserDetails()
})
</script>

<template>
    <div class="profile-container">
        <h1 class="profile-title">perfil</h1>

        <div class="profile-content">
            <!-- Columna izquierda: Información del perfil -->
            <div class="profile-info-column">
                <div class="profile-picture">
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="60" cy="60" r="60" fill="#1E88E5" />
                        <circle cx="60" cy="45" r="20" fill="white" />
                        <ellipse cx="60" cy="95" rx="30" ry="25" fill="white" />
                    </svg>
                </div>

                <div v-if="loading" class="loading-message">
                    Cargando...
                </div>

                <div v-else-if="error" class="error-message">
                    {{ error }}
                </div>

                <div v-else-if="userDetails" class="user-info">
                    <div class="info-item">
                        <span class="info-label">Nombre</span>
                        <span class="info-value">{{ userDetails.fullName }}</span>
                    </div>

                    <div class="info-item">
                        <span class="info-label">Teléfono</span>
                        <span class="info-value">{{ userDetails.phoneNumber || 'No disponible' }}</span>
                    </div>

                    <div class="info-item">
                        <span class="info-label">País</span>
                        <span class="info-value">{{ userDetails.country || 'No disponible' }}</span>
                    </div>

                    <div class="info-item">
                        <span class="info-label">Idioma preferido</span>
                        <span class="info-value">{{ userDetails.preferredLanguage || 'No disponible' }}</span>
                    </div>

                    <div class="info-item">
                        <span class="info-label">correo</span>
                        <span class="info-value">example@gmail.com</span>
                    </div>

                    <div class="info-item">
                        <span class="info-label">contraseña</span>
                        <span class="info-value">********</span>
                    </div>

                    <div class="info-item">
                        <span class="info-label">Plan actual</span>
                        <span class="info-value">Mensual con oferta de 19$</span>
                    </div>
                </div>
            </div>

            <!-- Columna derecha: Opciones del menú -->
            <div class="menu-column">
                <div v-for="menu in menuOptions" :key="menu"
                    :class="['menu-option', { 'selected': selectedMenu === menu }]" @click="selectMenu(menu)">
                    {{ menu }}
                </div>
                <div @click="logout()" :class="['menu-option', { 'selected': selectedMenu === menu }]">
                    Cerrar sesión
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.profile-container {
    width: 100%;
    min-height: 100vh;
    background: #000;
    color: #fff;
    padding: 20px 40px;
}

.profile-title {
    font-size: 14px;
    color: #aaa;
    font-weight: normal;
    margin-bottom: 30px;
    text-transform: lowercase;
}

.profile-content {
    display: flex;
    gap: 60px;
    max-width: 1200px;
}

.profile-info-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.profile-picture {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
}

.user-info {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.info-label {
    font-weight: bold;
    font-size: 16px;
    color: #fff;
}

.info-value {
    font-size: 14px;
    color: #aaa;
    font-weight: normal;
}

.menu-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 15px;
    max-width: 300px;
}

.menu-option {
    padding: 15px 20px;
    font-size: 16px;
    color: #aaa;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.3s ease;
    border-radius: 4px;
}

.menu-option:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.05);
}

.menu-option.selected {
    color: #fff;
    border: 1px solid #EF2125;
    background: rgba(239, 33, 37, 0.1);
}

.loading-message,
.error-message {
    padding: 20px;
    text-align: center;
    color: #aaa;
}

.error-message {
    color: #EF2125;
}
</style>
