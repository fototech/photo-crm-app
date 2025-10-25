<template>
  <q-page class="q-pa-md bg-grey-1">
    <q-card>
      <q-card-section>
        <div class="text-h5 text-bold">Add New Contact</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit.prevent="submitForm">
          <q-input v-model="form.client_name" label="Client Name" dense outlined required class="q-mb-sm" />
          <q-input v-model="form.mobile_number" label="Mobile Number" dense outlined required class="q-mb-sm" />
          <q-input v-model="form.email" label="Email" dense outlined class="q-mb-sm" />

          <!-- State Dropdown -->
          <q-select
            v-model="form.state_id"
            label="State"
            :options="states"
            option-label="state_name"
            option-value="state_id"
            emit-value
            map-options
            dense
            outlined
            class="q-mb-sm"
            @update:model-value="filterCities"
            required
          />

          <!-- City Dropdown -->
          <q-select
            v-model="form.city_id"
            label="City"
            :options="filteredCities"
            option-label="city_name"
            option-value="city_id"
            emit-value
            map-options
            dense
            outlined
            class="q-mb-sm"
            required
          />

          <!-- Contact Type -->
          <q-select
            v-model="form.contact_type"
            label="Contact Type"
            :options="['New', 'Old', 'Reference', 'Friends or Relatives']"
            dense
            outlined
            class="q-mb-sm"
            required
          />

          <!-- Before Event -->
          <q-select
            v-model="form.before_event"
            label="Before Any Event?"
            :options="['Yes', 'No']"
            dense
            outlined
            class="q-mb-md"
            required
          />

          <q-btn label="Save Contact" type="submit" color="primary" />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'

const router = useRouter()

const states = ref([])
const cities = ref([])
const filteredCities = ref([])

const form = ref({
  client_name: '',
  mobile_number: '',
  email: '',
  state_id: null,
  city_id: null,
  contact_type: '',
  before_event: '',
  user_id: JSON.parse(localStorage.getItem('crm_user') || '{}').user_id
})

onMounted(async () => {
  try {
    const [stateRes, cityRes] = await Promise.all([
      axios.get('/states'),
      axios.get('/cities')
    ])
    states.value = stateRes.data.states
    cities.value = cityRes.data.cities
  } catch (err) {
    console.error(err)
    Notify.create({ type: 'negative', message: 'Failed to load states/cities.' })
  }
})

function filterCities(stateId) {
  filteredCities.value = cities.value.filter(city => city.state_id === stateId)
  form.value.city_id = null // reset city if state changes
}

async function submitForm() {
  try {
    await axios.post('/store-contact', form.value) // use your real endpoint
    Notify.create({ type: 'positive', message: 'Contact saved successfully!' })
    router.push({ name: 'contact-details' })
  } catch (err) {
    console.error(err)
    Notify.create({ type: 'negative', message: 'Failed to save contact.' })
  }
}
</script>

