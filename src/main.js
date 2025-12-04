import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia()   

app.use(pinia)               
app.use(router)              

// Inicializar Mercado Pago SDK
if (window.MercadoPago) {
    const publicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY
    
    try {
        window.mp = new window.MercadoPago(publicKey, {
            locale: 'es-PE' // Configurar locale en español (Perú)
        })
        console.log('✓ Mercado Pago inicializado correctamente')
    } catch (error) {
        console.error('❌ Error inicializando Mercado Pago:', error)
    }
} else {
    console.warn('⚠ SDK de Mercado Pago no cargado. Asegúrate de que el script esté en index.html')
}

// Suprimir advertencias de permisos de storage en consola (esto es normal)
if (typeof window !== 'undefined') {
    const originalError = console.error
    console.error = function(...args) {
        if (args[0]?.includes?.('requestStorageAccessFor')) {
            return // Ignorar este error específico
        }
        originalError.apply(console, args)
    }
}

app.mount('#app')