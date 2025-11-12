<template>
    <div class="body">
        <header>
            <p>OnPlay</p>
        </header>

        <main>
            <section class="form_div">
                <h1>Bienvenido</h1>
                <div class="navigation">
                    <p :class="{ active: section === 'login' }" @click="section = 'login'">ENTRAR</p>
                    <p :class="{ active: section === 'register' }" @click="section = 'register'">REGISTRATE</p>
                    <p :class="{ active: section === 'producer' }" @click="section = 'producer'">REGISTRAR PRODUCTOR</p>
                </div>

                <!-- LOGIN -->
                <div v-if="section === 'login'" class="form_content login_form">

                    <div class="input_div">
                        <input v-model="email" type="email" placeholder="Email" @keyup.enter="handleLogin">
                    </div>

                    <div class="input_div">
                        <input v-model="password" type="password" placeholder="Contraseña" @keyup.enter="handleLogin">
                    </div>

                    <p class="forgot-password">Olvidaste tu contraseña?</p>
                    <button @click="handleLogin">ENTRAR</button>
                    <p v-if="error" class="error-message">{{ error }}</p>

                </div>

                <!-- REGISTRO NORMAL (CLIENTE) -->
                <div v-if="section === 'register'" class="form_content login_form">

                    <div class="input_div">
                        <input v-model="register.full_name" type="text" placeholder="Nombre completo">
                    </div>

                    <div class="input_div">
                        <input v-model="register.email" type="email" placeholder="Email">
                    </div>

                    <div class="input_div">
                        <input v-model="register.password" type="password" placeholder="Contraseña">
                    </div>

                    <div class="input_div">
                        <input v-model="register.phone_number" type="text" placeholder="Número telefónico">
                    </div>

                    <div class="input_div">
                        <input v-model="register.country" type="text" placeholder="País">
                    </div>

                    <div class="input_div">
                        <input v-model="register.preferred_language" type="text" placeholder="Idioma preferido">
                    </div>

                    <button @click="handleRegisterCliente">REGISTRAR</button>
                </div>

                <!-- REGISTRO COMO PRODUCTOR -->
                <div v-if="section === 'producer'" class="form_content">

                    <div class="input_div">
                        <input v-model="producer.full_name" type="text" placeholder="Nombre completo">
                    </div>

                    <div class="input_div">
                        <input v-model="producer.email" type="email" placeholder="Email">
                    </div>

                    <div class="input_div">
                        <input v-model="producer.password" type="password" placeholder="Contraseña">
                    </div>

                    <div class="input_div">
                        <input v-model="producer.phone_number" type="text" placeholder="Número telefónico">
                    </div>

                    <div class="input_div">
                        <input v-model="producer.country" type="text" placeholder="País">
                    </div>

                    <div class="input_div">
                        <input v-model="producer.preferred_language" type="text" placeholder="Idioma preferido">
                    </div>

                    <p style="color: white; font-size: 20px; margin-top: 20px;">Datos de la productora</p>

                    <div class="input_div">
                        <input v-model="producer.institution_name" type="text" placeholder="Nombre de la institución">
                    </div>

                    <div class="input_div">
                        <input v-model="producer.description" type="text" placeholder="Descripción">
                    </div>

                    <div class="input_div">
                        <input v-model="producer.contact_email" type="email" placeholder="Email de contacto">
                    </div>

                    <div class="input_div">
                        <input v-model="producer.contact_phone" type="text" placeholder="Teléfono de contacto">
                    </div>

                    <button @click="handleRegisterProducer">REGISTRAR COMO PRODUCTOR</button>
                </div>
            </section>
            <section class="img_div">
                <img src="https://www.infobae.com/new-resizer/Zq227nOmsISA9xjcCSjq91KEJws=/arc-anglerfish-arc2-prod-infobae/public/QYUVGM2RSNFDTFAEEEC6CLB66Y.jpg"
                    alt="">
            </section>
        </main>
    </div>

</template>

<script setup>

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '../stores/main'

const router = useRouter()

// ========= LOGIN ==========
const email = ref('')
const password = ref('')
const error = ref('')
const section = ref('login') // login | register | producer
const mainStore = useMainStore()
const API_URL = import.meta.env.VITE_API_URL

const handleLogin = async () => {
    error.value = ''

    if (!email.value || !password.value) {
        error.value = 'Por favor completa todos los campos'
        return
    }

    try {
        const response = await fetch( `${API_URL}/Prod/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        })

        const data = await response.json()
        mainStore.token = data.data.accessToken
        console.log(data)
        console.log(mainStore.token);
        

        // if (response.ok) {
        //     if (data.data) {
        //         const authToken = data.data.accessToken;
        //         setToken(authToken);
        //         localStorage.setItem('accessToken', authToken)
        //     }
        //     router.push('/home')
        // } else {
        //     error.value = data.message || 'Error en la autenticación'
        // }
        router.push('/home')
    } catch (err) {
        error.value = 'Error de conexión. Intenta nuevamente.'
    }
}



// ========= REGISTRO NORMAL (CLIENTE) ==========
const register = ref({
    email: "",
    password: "",
    full_name: "",
    phone_number: "",
    country: "",
    preferred_language: "",
    role: "USER"
})

const handleRegisterCliente = async () => {
    error.value = ""

    // Validación básica
    if (!register.value.email || !register.value.password || !register.value.full_name) {
        error.value = "Por favor completa todos los campos obligatorios"
        return
    }

    try {
        const response = await fetch("http://127.0.0.1:3000/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(register.value)
        })

        const data = await response.json()

        if (response.ok) {
            alert("Registro exitoso ✅")
            section.value = "login" // volver al login
        } else {
            error.value = data.message || "Error al registrar"
        }

    } catch (err) {
        error.value = "Error de conexión"
    }
}



// ========= REGISTRO COMO PRODUCTOR ==========
const producer = ref({
    email: "",
    password: "",
    full_name: "",
    phone_number: "",
    country: "",
    preferred_language: "",
    role: "PRODUCER",

    // Campos ProducerRequest
    institution_name: "",
    description: "",
    contact_email: "",
    contact_phone: ""
})

const handleRegisterProducer = async () => {
    error.value = ""

    // Construimos el JSON EXACTO que tu API necesita
    const payload = {
        email: producer.value.email,
        password_hash: producer.value.password,
        full_name: producer.value.full_name,
        phone_number: producer.value.phone_number,
        country: producer.value.country,
        preferred_language: producer.value.preferred_language,
        role: "PRODUCER",
        producerRequest: {
            institution_name: producer.value.institution_name,
            description: producer.value.description,
            contact_email: producer.value.contact_email,
            contact_phone: producer.value.contact_phone
        }
    }

    try {
        const response = await fetch("http://127.0.0.1:3000/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })

        const data = await response.json()

        if (response.ok) {
            alert("Productor registrado ✅")
            section.value = "login"
        } else {
            error.value = data.message || "Error en el registro"
        }

    } catch (err) {
        error.value = "Error de conexión"
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
    width: 500px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 16px;
    margin-left: 30px;
}

.navigation p {
    font-size: 18px;
    color: white;
    font-family: Arial, Helvetica, sans-serif;
    cursor: pointer;
    transition: color 0.3s;
    margin-right: 10px;
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
    height: 300px;
    overflow-y: scroll;
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
    height: 400px;
}

.form_div {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 40%;
    padding-top: 20px;
    gap: 20px;
}

.login_form {
    overflow-y: hidden;
}
</style>
