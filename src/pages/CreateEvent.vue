<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="text-h6 q-mb-md">📸 Create New Assignment</div>

    <q-form @submit.prevent="submitForm">
      <q-card flat class="q-pa-md bg-white">
        <div class="row q-col-gutter-md">
          <!-- Event Name -->
          <q-input filled v-model="form.event_name" label="Event Name" dense required class="col-12" />

          <!-- Event Image -->
          <q-file filled v-model="form.event_image" label="Event Image" dense accept="image/*" class="col-12" />

          <!-- Category & Subcategory -->
          <q-select filled v-model="form.event_category_id" :options="categories" option-label="category_name" option-value="id" label="Event Category" dense emit-value map-options class="col-md-6 col-12" @update:model-value="fetchSubcategories" />

          <q-select filled v-model="form.event_sub_category_id" :options="subcategories" option-label="sub_category_name" option-value="id" label="Event Subcategory" dense emit-value map-options class="col-md-6 col-12" />

          <!-- Client Details -->
          <q-input filled v-model="form.client_name" label="Client Name" dense required class="col-md-6 col-12" />
          <q-input filled v-model="form.client_mobile" label="Client Mobile" dense required class="col-md-6 col-12" />

          <!-- Bride & Groom Fields -->
          <div v-if="showBrideGroomFields" class="row q-col-gutter-md">
            <q-input
                filled
                v-model="form.bride_name"
                label="Bride Name"
                dense
                class="col-md-6 col-12"
            />
            <q-input
                filled
                v-model="form.bride_mobile"
                label="Bride Mobile"
                dense
                class="col-md-6 col-12"
            />
            <q-input
                filled
                v-model="form.groom_name"
                label="Groom Name"
                dense
                class="col-md-6 col-12"
            />
            <q-input
                filled
                v-model="form.groom_mobile"
                label="Groom Mobile"
                dense
                class="col-md-6 col-12"
            />
        </div>


          <!-- Amount & Date -->
          <q-input filled v-model.number="form.agreement_amount" label="Agreement Amount" type="number" dense class="col-md-6 col-12" />
          <q-input filled v-model="form.main_shoot_date" label="Main Shoot Date" type="date" dense required class="col-md-6 col-12" />

          <!-- Venue Info -->
          <q-input filled v-model="form.venue_name" label="Venue Name" dense required class="col-md-6 col-12" />
          <q-select filled v-model="form.state_id" :options="states" option-label="state_name" option-value="state_id" label="State" dense emit-value map-options class="col-md-6 col-12" @update:model-value="filterCities" />

          <q-select filled v-model="form.city_id" :options="filteredCities" option-label="city_name" option-value="city_id" label="City" dense emit-value map-options class="col-md-6 col-12" />

          <q-select filled v-model="form.status" :options="statuses" label="Status" dense required class="col-md-6 col-12" />

          <q-input filled v-model="form.venue_address" label="Venue Address" type="textarea" dense required class="col-12" />
        </div>

        <div class="q-mt-md">
          <q-btn label="Submit" color="primary" type="submit" />
        </div>
      </q-card>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()

const showBrideGroomFields = computed(() => {
  const selected = categories.value.find(c => c.id === form.value.event_category_id)
  return selected?.category_name?.toLowerCase() === 'wedding'
})


const form = ref({
  event_name: '',
  event_image: null,
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

const statuses = ['not started', 'in_progress', 'completed', 'cancelled']
const categories = ref([])
const subcategories = ref([])
const states = ref([])
const cities = ref([])

const filteredCities = computed(() =>
  cities.value.filter(c => c.state_id === form.value.state_id)
)

const fetchFormOptions = async () => {
  const [catRes, stateRes, cityRes] = await Promise.all([
    axios.get('/add-event'),
    axios.get('/states'),
    axios.get('/cities')
  ])
  categories.value = catRes.data.categories
  states.value = stateRes.data.states
  cities.value = cityRes.data.cities
}

const fetchSubcategories = async (categoryId) => {
  if (!categoryId) return
  const res = await axios.get(`/get-subcategories/${categoryId}`)
  subcategories.value = res.data
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
    await axios.post('/store-event', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    $q.notify({ type: 'positive', message: 'Event Created Successfully!' })
    router.push('/assignments')
  } catch (err) {
    console.error('Create Event Error:', err)
    $q.notify({ type: 'negative', message: 'Failed to create event.' })
  }
}



onMounted(fetchFormOptions)
</script>

<style scoped>
.q-page {
  max-width: 800px;
  margin: 0 auto;
}
</style>