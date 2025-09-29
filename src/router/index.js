import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Registro from "../views/Registro.vue";
import Choose from "../views/Choose.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/login",
            name: "login",
            component: Login
        },
        {
            path: "/registro",
            name: "registro",
            component: Registro
        },
        {
            path: "/choose",
            name: "choose",
            component: Choose
        }
    ]

})


export default router;