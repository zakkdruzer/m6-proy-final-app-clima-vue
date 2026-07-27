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
      <strong>{{ formatearTemp(lugar.tempActual) }}</strong>
    </p>
    <p>
      Humedad: <strong>{{ lugar.humedad }}%</strong> ·
      Viento: <strong>{{ lugar.viento }} km/h</strong>
    </p>

    <!-- Pronóstico semanal -->
    <section class="detail-section" v-if="estadisticas">
      <h3>Estadísticas de la semana</h3>
      <ul class="stats-list">
        <li>Mínima semanal: {{ formatearTemp(estadisticas.minSemana) }}</li>
        <li>Máxima semanal: {{ formatearTemp(estadisticas.maxSemana) }}</li>
        <li>Promedio semanal: {{ formatearTemp(estadisticas.promedioSemana) }}</li>
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
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getLugarPorId } from '../data/lugares'
import { getSavedUnit, saveUnit } from '../config/temperatureConfig'

const route = useRoute()
const router = useRouter()

const temperatureUnit = ref(getSavedUnit())

const lugar = computed(() => {
  const id = route.params.id
  return getLugarPorId(id)
})

const estadisticas = computed(() => {
  if (!lugar.value || !lugar.value.pronosticoSemanal) return null

  const mins = lugar.value.pronosticoSemanal.map((d) => d.min)
  const maxs = lugar.value.pronosticoSemanal.map((d) => d.max)

  const minSemana = Math.min(...mins)
  const maxSemana = Math.max(...maxs)

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

// Formatear temperatura según unidad
function formatearTemp(tempC) {
  if (temperatureUnit.value === 'C') return `${tempC} °C`
  const tempF = tempC * 9 / 5 + 32
  return `${tempF.toFixed(1)} °F`
}

// Opcional: permitir cambiar unidad desde el detalle también
function cambiarUnidad(unidad) {
  temperatureUnit.value = unidad
  saveUnit(unidad)
}

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