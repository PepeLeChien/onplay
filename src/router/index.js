import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Registro from "../views/Registro.vue";
import Choose from "../views/Choose.vue";
import Home from "../views/Home.vue";
import Catalogo from "../components/Catalogo.vue";
import CatalogoPelis from "../components/CatalogoPelis.vue";
import CatalogoShows from "../components/CatalogoShows.vue";
import CatalogAll from "../components/CatalogAll.vue";
import Pagos from "../components/Pagos.vue";
import Account from "../components/Account.vue";
import Search from "../components/Search.vue";
import VideoPlayer from "../components/VideoPlayer.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            redirect: "/login"   
        },
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
        },
        {
            path: "/home",
            name: "home",
            component: Home,
            children: [
                {
                    path: "", // ruta por defecto de /home
                    name: "catalogo",
                    component: Catalogo,
                    children: [
                        {
                            path: "", // /home/all
                            name: "all",
                            component: CatalogAll,
                        },
                        {
                            path: "movies", // /home/movies
                            name: "movies",
                            component: CatalogoPelis,
                        },
                        {
                            path: "shows", // /home/shows
                            name: "shows",
                            component: CatalogoShows,
                        },
                        // {
                        //     path: "", // si entras a /home, redirige a /home/all
                        //     redirect: "all",
                        // },
                    ],
                },
                {
                    path: 'search',
                    name: 'search',
                    component: Search
                },
                {
                   path: 'pagos',
                   name: 'pagos',
                   component: Pagos 
                },
                {
                    path: 'account',
                    name: 'account',
                    component: Account
                },
                {
                    path: 'video/:path?',
                    name: 'video',
                    component: VideoPlayer,
                    props: true
                }
            ],
        }
    ]

})


export default router;