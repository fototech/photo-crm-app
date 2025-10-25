<template>
  <q-page class="q-pa-md bg-grey-1">
    <q-card>
      <q-card-section class="text-h5 text-bold">
        Edit Lead
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit="updateLead" class="q-gutter-md">
          <q-input v-model="form.name" label="Name *" outlined dense :rules="[val => !!val || 'Name is required']" />
          <q-input v-model="form.email" label="Email" outlined dense type="email" />
          <q-input v-model="form.mobile" label="Mobile *" outlined dense :rules="[val => !!val || 'Mobile is required']" />
          <q-input v-model="form.event_name" label="Event Name *" outlined dense :rules="[val => !!val || 'Event Name is required']" />
          <q-input v-model="form.event_date" label="Event Date" outlined dense type="date" />
          <q-input v-model="form.event_city" label="City" outlined dense />
          <q-input v-model="form.budget" label="Budget" outlined dense />
          <q-input v-model="form.note" label="Note" outlined dense type="textarea" />

          <div class="row q-gutter-sm">
            <q-btn label="Update" color="primary" type="submit" />
            <q-btn label="Back" flat @click="router.back()" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { Notify } from 'quasar'

const route = useRoute()
const router = useRouter()

const form = ref({
  name: '',
  email: '',
  mobile: '',
  event_name: '',
  event_date: '',
  event_city: '',
  budget: '',
  note: ''
})

const fetchLead = async () => {
  try {
    const res = await axios.get(`/edit-leads/${route.params.id}`)
    if (res.data.status && res.data.lead) {
      form.value = { ...res.data.lead }
    } else {
      Notify.create({ type: 'negative', message: 'Lead not found' })
      router.back()
    }
  } catch (err) {
    console.error(err)
    Notify.create({ type: 'negative', message: 'Failed to load lead' })
    router.back()
  }
}

const updateLead = async () => {
  try {
    await axios.put(`/update-leads/${route.params.id}`, form.value)
    Notify.create({ type: 'positive', message: 'Lead updated successfully!' })

    const user = JSON.parse(localStorage.getItem('crm_user') || '{}')
    router.push({ name: 'lead-details', params: { id: user.user_id }, query: { success: 'Lead updated' } })
  } catch (err) {
    console.error(err)
    Notify.create({ type: 'negative', message: 'Failed to update lead' })
  }
}

onMounted(() => {
  fetchLead()
})
</script>
