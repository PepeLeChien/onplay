<template>
    <div class="body">
        <header>
            <p>OnPlay</p>
        </header>

        <main>
            <section class="form_div">
                <h1>Bienvenido</h1>
                <div class="navigation">
                    <p :class="{ active: isLogin }" @click="isLogin = true">ENTRAR</p>
                    <p :class="{ active: !isLogin }" @click="isLogin = false">REGISTRATE</p>
                </div>
                
                <div v-if="isLogin" class="form_content">
                    <div class="input_div">
                        <input 
                            v-model="email" 
                            type="email" 
                            placeholder="Email"
                            @keyup.enter="handleLogin"
                        >
                    </div>
                    <div class="input_div">
                        <input 
                            v-model="password" 
                            type="password" 
                            placeholder="Contraseña"
                            @keyup.enter="handleLogin"
                        >
                    </div>
                    <p class="forgot-password">Olvidaste tu contraseña?</p>
                    <button @click="handleLogin">ENTRAR</button>
                    <p v-if="error" class="error-message">{{ error }}</p>
                </div>

                <div v-else class="form_content">
                    <p>Formulario de registro aquí</p>
                </div>
            </section>
            <section class="img_div">
                <img src="https://www.infobae.com/new-resizer/Zq227nOmsISA9xjcCSjq91KEJws=/arc-anglerfish-arc2-prod-infobae/public/QYUVGM2RSNFDTFAEEEC6CLB66Y.jpg" alt="">
            </section>
        </main>
    </div>
    
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const isLogin = ref(true)

const handleLogin = async () => {
    error.value = ''
    
    if (!email.value || !password.value) {
        error.value = 'Por favor completa todos los campos'
        return
    }

    try {
        const response = await fetch('http://127.0.0.1:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        })

        const data = await response.json()

        if (response.ok) {
            // Guardar token si lo proporciona el servidor
            if (data.token) {
                localStorage.setItem('authToken', data.token)
            }
            // Redirigir al home
            router.push('/home')
        } else {
            error.value = data.message || 'Error en la autenticación'
        }
    } catch (err) {
        error.value = 'Error de conexión. Intenta nuevamente.'
        console.error('Login error:', err)
    }
}
</script>

<style scoped>
    .body {
        width: 100vw;
        height: 100vh;
        background: linear-gradient(248.7deg, #030A1B 26.28%, #EF2125 206.69%);
    }

    header {
        height: 100px;
    }

    header p {
        font-family: Inria Serif;
        font-size: 64px;
        text-align: end;
        color: rgba(237, 25, 71, 1);
        padding-right: 50px;
        padding-top: 20px;
    }

    main {
        display: flex;
    }

    h1 {
        font-size: 64px;
        color: white;
        font-family: Arial, Helvetica, sans-serif;
    }

    .navigation {
        width: 300px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 16px;
    }

    .navigation p {
        font-size: 24px;
        color: white;
        font-family: Arial, Helvetica, sans-serif;
        cursor: pointer;
        transition: color 0.3s;
    }

    .navigation p.active {
        color: rgba(34, 142, 229, 1);
        border-bottom: 2px solid rgba(34, 142, 229, 1);
    }

    .input_div {
        width: 200px;
        height: 38px;
    }

    .input_div input {
        width: 100%;
        height: 100%;
        background: none;
        border: white 1px solid;
        border-radius: 10px;
        padding: 5px 10px;
        color: white;
        font-family: Arial, Helvetica, sans-serif;
    }

    .input_div input::placeholder {
        color: rgba(255, 255, 255, 0.7);
    }

    section p {
        font-size: 16px;
        color: white;
    }

    .forgot-password {
        cursor: pointer;
        text-decoration: underline;
    }

    section button {
        color: white;
        background-color: rgba(34, 142, 229, 1);
        width: 120px;
        height: 40px;
        border-radius: 10px;
        border: none;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.3s;
    }

    section button:hover {
        background-color: rgba(34, 142, 229, 0.8);
    }

    .error-message {
        color: #EF2125;
        font-size: 14px;
        margin-top: 10px;
    }

    .form_content {
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
    }

    .img_div {
        width: 60%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .img_div img {
        width: 600px;
        padding-top: 40px;
    }

    .form_div {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 40%;
        padding-top: 20px;
        gap: 20px;
    }
</style>
