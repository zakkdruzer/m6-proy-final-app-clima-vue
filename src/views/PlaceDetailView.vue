<template>
  <section v-if="lugar" class="detail">
    <header class="detail-header">
      <h2>
        {{ lugar.icono }} {{ lugar.nombre }}
      </h2>
      <button @click="volverHome">Volver a Home</button>
    </header>

    <p>{{ lugar.region }}</p>
    <p>
      Clima actual:
      <strong>{{ lugar.estadoActual }}</strong>
    </p>
    <p>
      Temperatura actual:
      <strong>{{ lugar.tempActual }} °C</strong>
    </p>
    <p>
      Humedad: <strong>{{ lugar.humedad }}%</strong> ·
      Viento: <strong>{{ lugar.viento }} km/h</strong>
    </p>

    <!-- Pronóstico semanal -->
    <section class="detail-section">
      <h3>Pronóstico semanal</h3>
      <ul class="forecast-list">
        <li v-for="dia in lugar.pronosticoSemanal" :key="dia.dia">
          <strong>{{ dia.dia }}:</strong>
          Min {{ dia.min }} °C - Max {{ dia.max }} °C · {{ dia.estado }}
        </li>
      </ul>
    </section>

    <!-- Estadísticas semanales calculadas -->
    <section class="detail-section" v-if="estadisticas">
      <h3>Estadísticas de la semana</h3>
      <ul class="stats-list">
        <li>Mínima semanal: {{ estadisticas.minSemana }} °C</li>
        <li>Máxima semanal: {{ estadisticas.maxSemana }} °C</li>
        <li>Promedio semanal: {{ estadisticas.promedioSemana.toFixed(1) }} °C</li>
      </ul>
    </section>
  </section>

  <section v-else class="detail">
    <p>No se encontró el lugar solicitado.</p>
    <button @click="volverHome">Volver a Home</button>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getLugarPorId } from '../data/lugares'

// Tomar :id desde la ruta actual
const route = useRoute()
const router = useRouter()

// Buscar el lugar según el id
const lugar = computed(() => {
  const id = route.params.id
  return getLugarPorId(id)
})

// Computed para calcular estadísticas semanales (min, max, promedio)
const estadisticas = computed(() => {
  if (!lugar.value || !lugar.value.pronosticoSemanal) return null

  const mins = lugar.value.pronosticoSemanal.map((d) => d.min)
  const maxs = lugar.value.pronosticoSemanal.map((d) => d.max)

  const minSemana = Math.min(...mins)
  const maxSemana = Math.max(...maxs)

  // Usamos el promedio de la media diaria ((min + max) / 2)
  const promedioDia = lugar.value.pronosticoSemanal.map(
    (d) => (d.min + d.max) / 2
  )
  const sumaPromedios = promedioDia.reduce((acc, valor) => acc + valor, 0)
  const promedioSemana = sumaPromedios / promedioDia.length

  return {
    minSemana,
    maxSemana,
    promedioSemana,
  }
})

// Volver a la ruta principal
function volverHome() {
  router.push({ name: 'home' })
}
</script>

<style scoped>
.detail {
  max-width: 800px;
  margin: 0 auto;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.detail-section {
  margin-top: 1rem;
}

.forecast-list,
.stats-list {
  list-style: none;
  padding: 0;
}
</style>