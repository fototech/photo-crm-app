<template>
  <q-page class="q-pa-md bg-grey-2">
  <q-card flat bordered class="q-pa-md">

    <!-- Section Header -->
    <q-card-section>
      <div class="text-h6">📊 PhotoParivar CRM Dashboard</div>
    </q-card-section>

    <!-- Section Loader -->
    <q-card-section v-if="loading">
      <q-spinner color="primary" />
      <span class="q-ml-sm">Loading dashboard...</span>
    </q-card-section>

    <!-- Section Content -->
    <q-card-section v-else>

      <!-- Cards -->
      <div class="q-gutter-md row wrap justify-start">
        <router-link
          v-for="card in cards"
          :key="card.title"
          :to="card.link"
          class="no-decoration"
        >
          <q-card class="dashboard-card hoverable">
            <q-img :src="card.image" contain class="dashboard-thumb" />
            <div class="dashboard-title">{{ card.title }}</div>
            <div class="dashboard-value">{{ card.value }}</div>
          </q-card>
        </router-link>
      </div>

      <!-- Charts -->
      <div class="q-mt-xl">
        <div class="text-subtitle2 q-mb-md">📈 Reports</div>
        <div class="chart-row">
          <div class="chart-box"><h5>Payment Summary</h5><canvas ref="paymentChartRef"></canvas></div>
          <div class="chart-box"><h5>Turnover</h5><canvas ref="turnoverChartRef"></canvas></div>
          <div class="chart-box"><h5>Assignments</h5><canvas ref="assignmentChartRef"></canvas></div>
        </div>
      </div>

    </q-card-section>

  </q-card>
</q-page>

</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import axios from 'axios'

// Chart.js imports
import {
  Chart,
  PieController,
  BarController,
  DoughnutController,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(
  PieController,
  BarController,
  DoughnutController,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
)

const dashboard = ref({})
const loading = ref(true)
const cards = ref([])

// Refs to canvas elements
const paymentChartRef = ref(null)
const turnoverChartRef = ref(null)
const assignmentChartRef = ref(null)

const loadDashboard = async () => {

  const user = JSON.parse(localStorage.getItem('crm_user') || '{}')
  const userId = user.user_id

  try {
    const res = await axios.get('/dashboard', {
      params: { user_id: userId }
    })

    dashboard.value = res.data

    cards.value = [
      {
        title: 'All Assignments',
        value: res.data.assignments?.length ?? 0,
        image: '/statics/events.jpg',
        link: '/assignments'
      },
      {
        title: 'All Members',
        value: res.data.team_details?.length ?? 0,
        image: '/statics/taskc.jpg',
        link: '/team-info'
      },
      {
        title: 'All Vendors',
        value: res.data.vendor_details?.length ?? 0,
        image: '/statics/not_started.jpg',
        link: '/vendor-info'
      }
    ]
  } catch (err) {
    console.error('Failed to load dashboard', err)
  } finally {
    loading.value = false
  }
}

const drawCharts = () => {
  // Payment Chart
  if (paymentChartRef.value) {
    new Chart(paymentChartRef.value, {
      type: 'pie',
      data: {
        labels: ['Received', 'Balance'],
        datasets: [{
          data: [
            dashboard.value.received_amount ?? 0,
            dashboard.value.balance_amount ?? 0
          ],
          backgroundColor: ['#0d6efd', '#dc3545']
        }]
      }
    })
  }

  // Turnover Chart
  if (turnoverChartRef.value) {
    new Chart(turnoverChartRef.value, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Turnover',
          data: [1000, 1500, 1800, 2200, 2500, dashboard.value.turn_over ?? 0],
          backgroundColor: ['#fab13e', '#0d6efd', '#198754', '#6610f2', '#ffc107', '#dc3545']
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    })
  }

  // Assignment Chart
  if (assignmentChartRef.value) {
    new Chart(assignmentChartRef.value, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Pending'],
        datasets: [{
          data: [
            dashboard.value.completed_assignments ?? 0,
            dashboard.value.not_completed_assignments ?? 0
          ],
          backgroundColor: ['#198754', '#ffc107']
        }]
      }
    })
  }
}

onMounted(loadDashboard)

watch(loading, async (val) => {
  if (val === false) {
    await nextTick()
    drawCharts()
  }
})
</script>

<style scoped>
.dashboard-card {
  width: 260px;
  height: 240px;
  background: #fab13e42;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
}
.dashboard-thumb {
  width: 80px;
  height: 80px;
  border-radius: 20%;
  object-fit: cover;
  margin-bottom: 10px;
}
.dashboard-title {
  font-size: 14px;
  font-weight: 600;
  color: #444;
}
.dashboard-value {
  font-size: 18px;
  font-weight: bold;
  color: #0d6efd;
  margin-top: 5px;
}
.chart-row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: start;
}

.chart-box {
  background: #fab13e42;
  padding: 15px;
  border-radius: 10px;
  width: 300px;
  height: 280px; /* Slightly more height */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
}

.chart-box h5 {
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: 600;
}

.chart-box canvas {
  width: 100% !important;
  height: 200px !important;
}

.no-decoration {
  text-decoration: none;
  color: inherit;
  display: inline-block;
}
.hoverable {
  transition: transform 0.2s;
}
.hoverable:hover {
  transform: scale(1.03);
}


</style>
