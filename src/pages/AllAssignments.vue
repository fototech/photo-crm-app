<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="text-h6 q-mb-md">📷 All Assignments</div>

    <q-btn
      label="Add New Assignment"
      color="primary"
      icon="add"
      class="q-mb-lg"
      @click="goToCreatePage"
    />

    <q-spinner v-if="loading" color="primary" size="lg" />

    <div v-else-if="assignments.length === 0">
      <q-banner class="bg-grey-3 text-black">
        No photo assignments found.
      </q-banner>
    </div>

    <div v-else class="assignment-grid">
      <q-card
        v-for="event in assignments"
        :key="event.id"
        class="assignment-card"
      >
        <!-- Top right Edit/Delete -->
        <!-- Top right Edit/Delete styled as buttons -->
        <div class="top-actions">
          <q-btn
            label="EDIT"
            color="warning"
            size="sm"
            class="mini-btn"
            @click="editEvents(event.id)"
          />
          <q-btn
            label="DELETE"
            color="negative"
            size="sm"
            class="mini-btn"
            @click="deleteEvent(event.id)"
          />
        </div>



        <!-- Image -->
        <div class="image-wrapper">
          <router-link :to="`/view-assignment/${event.id}`" class="image-link">
            <template v-if="event.event_image_url">
              <img :src="event.event_image_url" alt="Event" class="event-img" />
            </template>
            <template v-else>
              <div class="img-placeholder">No Image</div>
            </template>
            <div class="event-name-overlay">{{ event.event_name }}</div>
          </router-link>
          <div class="event-name-overlay">{{ event.event_name }}</div>
        </div>

        <!-- Buttons -->
        <div class="button-wrapper">
          <q-btn
            label="SUB ASSIGNMENT"
            color="primary"
            size="sm"
            class="w-btn"
            @click="goTo(`listingSubEvent/${event.id}`)"
          />

          <q-btn
            label="DELIVERABLES"
            color="accent"
            size="sm"
            class="w-btn"
            @click="goTo(`listingDeliverables/${event.id}`)"
          />
          <q-btn
            label="PAYMENT"
            color="positive"
            size="sm"
            class="w-btn"
            @click="goTo(`event-payments/${event.id}`)"
          />
          <q-btn
            label="DATA"
            color="warning"
            size="sm"
            class="w-btn"
            @click="goTo(`event-sub-event-data-info/${event.id}`)"
          />
          <q-btn
            label="TASK"
            color="info"
            size="sm"
            class="w-btn"
            @click="goTo(`deliverable-task-details/${event.id}`)"
          />
          <q-btn
            label="AGREEMENT"
            color="deep-purple"
            size="sm"
            class="w-btn"
            @click="goTo(`photo-crm-agreement/${event.id}`)"
          />
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// import axios from 'axios'
import { axios } from 'boot/axios'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const assignments = ref([])
const loading = ref(true)
const router = useRouter()
const $q = useQuasar()

const loadAssignments = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('crm_user') || '{}')
    const user_id = user.user_id

    if (!user_id) {
      $q.notify({ type: 'negative', message: 'User not found. Please login again.' })
      return
    }

    const res = await axios.get('/all-assignments', {
      params: { user_id }
    })
    assignments.value = res.data.assignments ?? []
  } catch (err) {
    console.error('Failed to load assignments:', err)
    $q.notify({ type: 'negative', message: 'Failed to load assignments' })
  } finally {
    loading.value = false
  }
}


const goToCreatePage = () => {
  router.push('/createEvents')
}

const editEvents = (id) => {
  router.push(`/editEvents/${id}`)
}

const deleteEvent = async (id) => {
  const confirm = window.confirm('Are you sure you want to delete this assignment?')
  if (!confirm) return

  const user = JSON.parse(localStorage.getItem('crm_user') || '{}')
  const userId = user.user_id

  try {
    await axios.delete(`/delete-event/${id}`, {
      params: { user_id: userId }
    })

    assignments.value = assignments.value.filter((a) => a.id !== id)
    $q.notify({ type: 'positive', message: 'Assignment deleted' })
  } catch (err) {
    console.error('Failed to delete assignment:', err)
    $q.notify({ type: 'negative', message: 'Failed to delete assignment' })
  }
}



const goTo = (path) => {
  router.push(`/${path}`)
}

onMounted(loadAssignments)
</script>

<style scoped>
.assignment-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}
.assignment-card {
  width: 230px;
  background: #fafafa;
  border: 1px solid #ddd;
  border-radius: 10px;
  position: relative;
  padding-bottom: 10px;
}
.top-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  flex-direction: row;
  gap: 6px;
  z-index: 10;
}

.mini-btn {
  width: 60px;
  font-size: 10px;
  padding: 4px 0;
  text-align: center;
}

.image-wrapper {
  height: 150px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.event-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.img-placeholder {
  width: 100%;
  height: 100%;
  background: #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  font-size: 14px;
}
.event-name-overlay {
  position: absolute;
  bottom: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  max-width: 90%;
  text-align: center;
}
.button-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 buttons per row */
  gap: 6px;
  padding: 4px;
}

.w-btn {
  width: 100%;
  font-size: 4px;
  padding: 3px 2px;
}
.image-link {
  display: block;
  position: relative;
  width: 100%;
  height: 150px;
  overflow: hidden;
}

</style>
