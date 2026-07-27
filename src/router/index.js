import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PlaceDetailView from '../views/PlaceDetailView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView, // Ruta principal con listado de lugares
  },
  {
    path: '/place/:id',
    name: 'place-detail',
    component: PlaceDetailView, // Ruta dinámica para detalle
    props: true, // Permite recibir :id como prop
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router