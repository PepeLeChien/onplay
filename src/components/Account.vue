<script setup>
import { ref, onMounted } from 'vue'
import { useMainStore } from '../stores/main'
import { USER_ENDPOINTS, PAYMENT_ENDPOINTS, PLAN_ENDPOINTS } from '../constants/urlConstants'
import { apiPayment, apiGet } from '../services/apiService'

const userDetails = ref(null)
const loading = ref(true)
const error = ref(null)
const selectedMenu = ref('Ayuda')
const mainStore = useMainStore();
const API_URL = import.meta.env.VITE_API_URL
const paymentLoading = ref(false)
const paymentError = ref(null)
const showPlanModal = ref(false)
const plans = ref([])
const plansLoading = ref(false)
const plansError = ref(null)
const selectedPlan = ref(null)

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
        const token = localStorage.getItem('accessToken')

        if (!token) {
            error.value = 'No se encontró el token de autenticación'
            loading.value = false
            return
        }

        const response = await fetch(USER_ENDPOINTS.GET_PROFILE, {
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

/**
 * Carga los planes disponibles desde el endpoint
 */
const fetchPlans = async () => {
    plansLoading.value = true
    plansError.value = null

    try {
        const plansData = await apiGet(PLAN_ENDPOINTS.GET_ALL)
        
        if (plansData.success && plansData.data) {
            plans.value = plansData.data
            console.log('✓ Planes cargados:', plans.value)
        } else {
            throw new Error(plansData.message || 'Error al cargar los planes')
        }
    } catch (err) {
        plansError.value = err instanceof Error ? err.message : 'Error al cargar los planes'
        console.error('❌ Error al cargar planes:', err)
    } finally {
        plansLoading.value = false
    }
}

/**
 * Abre el modal de selección de planes
 */
const openPlanModal = () => {
    selectedPlan.value = null
    showPlanModal.value = true
    if (plans.value.length === 0) {
        fetchPlans()
    }
}

/**
 * Cierra el modal de selección de planes
 */
const closePlanModal = () => {
    showPlanModal.value = false
    selectedPlan.value = null
}

/**
 * Selecciona un plan e inicia el pago
 */
const selectAndPayPlan = async (plan) => {
    selectedPlan.value = plan
    closePlanModal()
    await initiatePayment(plan.id)
}

/**
 * Inicia el flujo de pago hacia Mercado Pago
 * @param {number} planId - ID del plan a pagar
 */
const initiatePayment = async (planId) => {
    paymentLoading.value = true
    paymentError.value = null

    try {
        const token = localStorage.getItem('accessToken')
        if (!token) {
            throw new Error('No se encontró el token de autenticación')
        }

        if (!userDetails.value?.userId) {
            throw new Error('No se encontró el ID del usuario')
        }

        // Preparar datos del pago según el formato esperado
        const paymentData = {
            userId: userDetails.value.userId,
            planId: planId
        }

        console.log('📤 Enviando datos de pago:', paymentData)

        // Llamar al endpoint de pago
        const response = await fetch(PAYMENT_ENDPOINTS.PAY_SUBSCRIPTION, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
        })

        const paymentResponse = await response.json()
        console.log('📥 Respuesta del pago:', paymentResponse)

        // Validar respuesta
        if (paymentResponse.success && paymentResponse.data) {
            const { initPoint } = paymentResponse.data
            
            // Usar sandboxInitPoint si está disponible, sino usar initPoint
            const redirectUrl = initPoint
            
            if (redirectUrl) {
                console.log('✓ Redirigiendo a Mercado Pago:', redirectUrl)
                // Redirigir al usuario a Mercado Pago
                window.location.href = redirectUrl
            } else {
                throw new Error('No se obtuvo URL de pago válida')
            }
        } else {
            throw new Error(paymentResponse.message || 'Error al crear la referencia de pago')
        }
    } catch (err) {
        paymentError.value = err instanceof Error ? err.message : 'Error al procesar el pago'
        console.error('❌ Error en initiatePayment:', err)
    } finally {
        paymentLoading.value = false
    }
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
                <!-- Botón de pago -->
                <button 
                    @click="openPlanModal()" 
                    :disabled="paymentLoading"
                    class="payment-button"
                    :class="{ 'loading': paymentLoading }">
                    {{ paymentLoading ? 'Procesando...' : 'Pagar Suscripción' }}
                </button>
                <div v-if="paymentError" class="payment-error">
                    {{ paymentError }}
                </div>
                <div @click="logout()" :class="['menu-option', { 'selected': selectedMenu === menu }]">
                    Cerrar sesión
                </div>
            </div>
        </div>
    </div>

    <!-- Modal de selección de planes -->
    <div v-if="showPlanModal" class="modal-overlay" @click="closePlanModal">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h2>Selecciona tu Plan</h2>
                <button class="close-button" @click="closePlanModal">✕</button>
            </div>

            <div v-if="plansLoading" class="modal-body">
                <p class="loading-text">Cargando planes...</p>
            </div>

            <div v-else-if="plansError" class="modal-body">
                <p class="error-text">{{ plansError }}</p>
                <button @click="fetchPlans" class="btn-retry">Reintentar</button>
            </div>

            <div v-else class="modal-body">
                <div v-if="plans.length === 0" class="no-plans">
                    <p>No hay planes disponibles</p>
                </div>

                <div v-else class="plans-grid">
                    <div 
                        v-for="plan in plans" 
                        :key="plan.id"
                        class="plan-card"
                        :class="{ 'selected': selectedPlan?.id === plan.id }"
                        @click="selectAndPayPlan(plan)">
                        <div class="plan-header">
                            <h3 class="plan-name">{{ plan.name }}</h3>
                            <div class="plan-price">
                                <span class="currency">S/.</span>
                                <span class="amount">{{ plan.price }}</span>
                            </div>
                        </div>
                        <p class="plan-description">{{ plan.description }}</p>
                        <button class="plan-button" :disabled="plansLoading">
                            Elegir Plan
                        </button>
                    </div>
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

.payment-button {
    padding: 15px 20px;
    font-size: 16px;
    color: #fff;
    background: #EF2125;
    border: 1px solid #EF2125;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    margin-top: 10px;
}

.payment-button:hover:not(:disabled) {
    background: #d41a1f;
    border-color: #d41a1f;
}

.payment-button:disabled,
.payment-button.loading {
    opacity: 0.6;
    cursor: not-allowed;
}

.payment-error {
    padding: 10px;
    margin-top: 5px;
    background: rgba(239, 33, 37, 0.1);
    border: 1px solid #EF2125;
    color: #EF2125;
    border-radius: 4px;
    font-size: 14px;
    text-align: center;
}

/* Modal styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.modal-content {
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 8px;
    max-width: 900px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from {
        transform: translateY(-50px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px;
    border-bottom: 1px solid #333;
    position: sticky;
    top: 0;
    background: #1a1a1a;
}

.modal-header h2 {
    margin: 0;
    font-size: 24px;
    color: #fff;
}

.close-button {
    background: none;
    border: none;
    color: #aaa;
    font-size: 28px;
    cursor: pointer;
    transition: color 0.3s ease;
    padding: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-button:hover {
    color: #EF2125;
}

.modal-body {
    padding: 30px;
}

.loading-text,
.error-text {
    text-align: center;
    color: #aaa;
    font-size: 16px;
}

.error-text {
    color: #EF2125;
}

.no-plans {
    text-align: center;
    padding: 40px 20px;
    color: #aaa;
}

.plans-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
}

.plan-card {
    background: #2a2a2a;
    border: 2px solid #333;
    border-radius: 8px;
    padding: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
}

.plan-card:hover {
    border-color: #EF2125;
    background: #333;
    transform: translateY(-5px);
}

.plan-card.selected {
    border-color: #EF2125;
    background: rgba(239, 33, 37, 0.1);
}

.plan-header {
    margin-bottom: 15px;
}

.plan-name {
    margin: 0 0 10px 0;
    font-size: 20px;
    color: #fff;
}

.plan-price {
    display: flex;
    align-items: baseline;
    gap: 5px;
}

.currency {
    font-size: 14px;
    color: #aaa;
}

.amount {
    font-size: 28px;
    font-weight: bold;
    color: #EF2125;
}

.plan-description {
    color: #aaa;
    font-size: 14px;
    margin: 0 0 20px 0;
    flex-grow: 1;
}

.plan-button {
    background: #EF2125;
    color: #fff;
    border: none;
    padding: 12px 20px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.plan-button:hover:not(:disabled) {
    background: #d41a1f;
}

.plan-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-retry {
    background: #EF2125;
    color: #fff;
    border: none;
    padding: 12px 20px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 15px;
    transition: all 0.3s ease;
}

.btn-retry:hover {
    background: #d41a1f;
}
</style>