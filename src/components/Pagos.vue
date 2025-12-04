<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(true)
const error = ref(null)
const paymentStatus = ref(null)
const paymentDetails = ref(null)

onMounted(async () => {
    // Obtener parámetros de la URL (status, payment_id, preference_id, external_reference)
    const params = new URLSearchParams(window.location.search)
    const status = params.get('status')
    const paymentId = params.get('payment_id')
    const preferenceId = params.get('preference_id')
    const externalReference = params.get('external_reference')

    paymentDetails.value = {
        paymentId,
        preferenceId,
        externalReference,
        timestamp: new Date().toLocaleString('es-PE')
    }

    console.log('📊 Parámetros de pago:', { status, paymentId, preferenceId })

    if (status === 'approved') {
        paymentStatus.value = 'success'
        console.log('✓ Pago aprobado')
        // Aquí puedes hacer una llamada al backend para confirmar el pago
    } else if (status === 'pending') {
        paymentStatus.value = 'pending'
        console.log('⏳ Pago pendiente')
    } else if (status === 'failure') {
        paymentStatus.value = 'failure'
        error.value = 'El pago fue rechazado. Por favor intenta con otro método de pago.'
        console.error('❌ Pago rechazado')
    } else {
        paymentStatus.value = 'cancelled'
        error.value = 'El pago fue cancelado. Puedes intentar nuevamente cuando lo desees.'
        console.warn('⚠️ Pago cancelado')
    }

    loading.value = false
})

const goHome = () => {
    router.push('/home')
}

const retryPayment = () => {
    router.push('/home/account')
}
</script>

<template>
    <div class="payment-container">
        <div v-if="loading" class="payment-status loading">
            <div class="spinner"></div>
            <h2>Procesando tu pago...</h2>
            <p>Por favor espera mientras confirmamos tu pago con Mercado Pago.</p>
        </div>

        <div v-else-if="paymentStatus === 'success'" class="payment-status success">
            <div class="success-icon">✓</div>
            <h2>¡Pago Exitoso!</h2>
            <p>Tu suscripción ha sido activada correctamente.</p>
            <p v-if="paymentDetails?.paymentId" class="payment-details">
                ID de Pago: <strong>{{ paymentDetails.paymentId }}</strong>
            </p>
            <p v-if="paymentDetails?.timestamp" class="payment-details">
                Fecha: <strong>{{ paymentDetails.timestamp }}</strong>
            </p>
            <button @click="goHome" class="btn-primary">Volver al Inicio</button>
        </div>

        <div v-else-if="paymentStatus === 'pending'" class="payment-status pending">
            <div class="pending-icon">⏳</div>
            <h2>Pago Pendiente</h2>
            <p>Tu pago está siendo procesado. Te notificaremos cuando se confirme.</p>
            <p v-if="paymentDetails?.paymentId" class="payment-details">
                ID de Transacción: <strong>{{ paymentDetails.paymentId }}</strong>
            </p>
            <p class="info-text">Esto puede tomar algunos minutos. No cierres esta página.</p>
            <button @click="goHome" class="btn-primary">Volver al Inicio</button>
        </div>

        <div v-else class="payment-status failure">
            <div class="failure-icon">✕</div>
            <h2>Pago No Completado</h2>
            <p>{{ error || 'Ocurrió un error al procesar tu pago.' }}</p>
            <div v-if="paymentDetails?.paymentId" class="payment-details">
                <p>ID de Intento: <strong>{{ paymentDetails.paymentId }}</strong></p>
            </div>
            <div class="button-group">
                <button @click="retryPayment" class="btn-primary">Intentar Nuevamente</button>
                <button @click="goHome" class="btn-secondary">Volver al Inicio</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.payment-container {
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(135deg, #030A1B 0%, #1a1a1a 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    padding: 20px;
}

.payment-status {
    text-align: center;
    padding: 60px 40px;
    border-radius: 12px;
    max-width: 500px;
    width: 100%;
}

.payment-status h2 {
    font-size: 28px;
    margin: 20px 0 10px;
    font-weight: bold;
}

.payment-status p {
    font-size: 16px;
    color: #aaa;
    margin: 10px 0;
}

.payment-details {
    background: rgba(255, 255, 255, 0.05);
    padding: 15px;
    border-radius: 6px;
    margin: 15px 0;
    font-size: 13px;
    word-break: break-all;
    font-family: monospace;
}

.info-text {
    font-size: 14px;
    color: #ffc107;
    background: rgba(255, 193, 7, 0.1);
    padding: 10px;
    border-radius: 4px;
}

.success {
    background: rgba(76, 175, 80, 0.1);
    border: 2px solid #4CAF50;
}

.success-icon {
    font-size: 80px;
    color: #4CAF50;
    margin-bottom: 20px;
    font-weight: bold;
}

.pending {
    background: rgba(255, 193, 7, 0.1);
    border: 2px solid #FFC107;
}

.pending-icon {
    font-size: 80px;
    color: #FFC107;
    margin-bottom: 20px;
}

.failure {
    background: rgba(244, 67, 54, 0.1);
    border: 2px solid #F44336;
}

.failure-icon {
    font-size: 80px;
    color: #F44336;
    margin-bottom: 20px;
    font-weight: bold;
}

.loading {
    background: rgba(33, 150, 243, 0.1);
    border: 2px solid #2196F3;
}

.spinner {
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-top: 4px solid #2196F3;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.button-group {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 30px;
}

.btn-primary,
.btn-secondary {
    padding: 12px 30px;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary {
    background-color: #EF2125;
    color: white;
    margin-top: 30px;
}

.btn-primary:hover {
    background-color: #d41e22;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 33, 37, 0.3);
}

.btn-secondary {
    background-color: transparent;
    color: #aaa;
    border: 1px solid #aaa;
}

.btn-secondary:hover {
    color: #fff;
    border-color: #fff;
    background: rgba(255, 255, 255, 0.05);
}
</style>