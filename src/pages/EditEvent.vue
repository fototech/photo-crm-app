<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="text-h6 q-mb-md">✏️ Edit Assignment</div>

    <q-form @submit.prevent="submitForm">
      <q-card flat class="q-pa-md bg-white">
        <div class="row q-col-gutter-md">
          <q-input filled v-model="form.event_name" label="Event Name" dense required class="col-12" />

          <q-select filled v-model="form.event_category_id" :options="categories" option-label="category_name" option-value="id" label="Event Category" dense emit-value map-options class="col-md-6 col-12" @update:model-value="fetchSubcategories" />

          <q-select filled v-model="form.event_sub_category_id" :options="subcategories" option-label="sub_category_name" option-value="id" label="Event Subcategory" dense emit-value map-options class="col-md-6 col-12" />

          <q-input filled v-model="form.client_name" label="Client Name" dense required class="col-md-6 col-12" />
          <q-input filled v-model="form.client_mobile" label="Client Mobile" dense required class="col-md-6 col-12" />

          <div v-if="showBrideGroomFields" class="row q-col-gutter-md">
            <q-input filled v-model="form.bride_name" label="Bride Name" dense class="col-md-6 col-12" />
            <q-input filled v-model="form.bride_mobile" label="Bride Mobile" dense class="col-md-6 col-12" />
            <q-input filled v-model="form.groom_name" label="Groom Name" dense class="col-md-6 col-12" />
            <q-input filled v-model="form.groom_mobile" label="Groom Mobile" dense class="col-md-6 col-12" />
          </div>

          <q-input filled v-model.number="form.agreement_amount" label="Agreement Amount" type="number" dense class="col-md-6 col-12" />
          <q-input filled v-model="form.main_shoot_date" label="Main Shoot Date" type="date" dense required class="col-md-6 col-12" />

          <q-input filled v-model="form.venue_name" label="Venue Name" dense required class="col-md-6 col-12" />
          <q-select filled v-model="form.state_id" :options="states" option-label="state_name" option-value="state_id" label="State" dense emit-value map-options class="col-md-6 col-12" @update:model-value="filterCities" />
          <q-select filled v-model="form.city_id" :options="filteredCities" option-label="city_name" option-value="city_id" label="City" dense emit-value map-options class="col-md-6 col-12" />

          <q-select filled v-model="form.status" :options="statuses" label="Status" dense required class="col-md-6 col-12" />
          <q-input filled v-model="form.venue_address" label="Venue Address" type="textarea" dense required class="col-12" />
        </div>

        <div class="q-mt-md">
          <q-btn label="Update" color="primary" type="submit" />
        </div>
      </q-card>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const eventId = route.params.id

// Reactive form object
const form = ref({
  event_name: '',
  event_category_id: '',
  event_sub_category_id: '',
  client_name: '',
  client_mobile: '',
  bride_name: '',
  bride_mobile: '',
  groom_name: '',
  groom_mobile: '',
  agreement_amount: '',
  main_shoot_date: '',
  venue_name: '',
  state_id: '',
  city_id: '',
  venue_address: '',
  status: 'not started'
})

const categories = ref([])
const subcategories = ref([])
const states = ref([])
const cities = ref([])
const statuses = ['not started', 'in_progress', 'completed', 'cancelled']

const showBrideGroomFields = computed(() => {
  const selected = categories.value.find(c => c.id === form.value.event_category_id)
  return selected?.category_name?.toLowerCase() === 'wedding'
})

const filteredCities = computed(() =>
  cities.value.filter(c => c.state_id === form.value.state_id)
)

const fetchSubcategories = async (categoryId) => {
  if (!categoryId) return
  try {
    const res = await axios.get(`/get-subcategories/${categoryId}`)
    subcategories.value = res.data.map(sub => ({
      id: parseInt(sub.id),
      sub_category_name: sub.sub_category_name
    }))
  } catch (err) {
    console.error('Failed to load subcategories:', err)
  }
}

const fetchEventDetails = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('crm_user') || '{}')
    const userId = user.user_id

    if (!userId) {
      $q.notify({ type: 'negative', message: 'User not found. Please login again.' })
      return
    }

    const res = await axios.get(`/edit-event/${eventId}`, {
      params: { user_id: userId }
    })

    console.log('Fetched event:', res.data.event)
    Object.assign(form.value, {
       ...res.data.event,
        event_category_id: parseInt(res.data.event.photo_event_category_id),
        event_sub_category_id: parseInt(res.data.event.photo_event_sub_category_id),
        state_id: parseInt(res.data.event.state_id),
        city_id: parseInt(res.data.event.city_id),
    })

    await fetchSubcategories(form.value.event_category_id)
  } catch (err) {
    console.error('Error loading event data:', err)
    $q.notify({ type: 'negative', message: 'Failed to load event data.' })
  }
}

const fetchFormOptions = async () => {
  try {
    const [catRes, stateRes, cityRes] = await Promise.all([
      axios.get('/add-event'),
      axios.get('/states'),
      axios.get('/cities')
    ])
    categories.value = catRes.data.categories
    states.value = stateRes.data.states
    cities.value = cityRes.data.cities
  } catch (err) {
    console.error('Failed to load form options:', err)
    $q.notify({ type: 'negative', message: 'Failed to load form options.' })
  }
}

const submitForm = async () => {
  const formData = new FormData()
  Object.entries(form.value).forEach(([key, val]) => {
    if (val !== null && val !== undefined) {
      formData.append(key, val)
    }
  })

  const user = JSON.parse(localStorage.getItem('crm_user') || '{}')
  const userId = user.user_id

  if (!userId) {
    $q.notify({ type: 'negative', message: 'User not found. Please login again.' })
    return
  }

  formData.append('user_id', userId)

  try {
    await axios.post(`/update-event/${eventId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    $q.notify({ type: 'positive', message: 'Event updated successfully!' })
    router.push('/assignments')
  } catch (err) {
    console.error('Update error:', err)
    $q.notify({ type: 'negative', message: 'Failed to update event.' })
  }
}

onMounted(async () => {
  await fetchFormOptions()
  await fetchEventDetails()
})
</script>


<style scoped>
.q-page {
  max-width: 800px;
  margin: 0 auto;
}
</style>