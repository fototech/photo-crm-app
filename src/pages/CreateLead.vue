<template>
  <q-page class="q-pa-md bg-grey-1">
    <q-card>
      <q-card-section class="text-h5 text-bold">
        Create New Lead
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit="submitLead" class="q-gutter-md">
          <q-input v-model="form.name" label="Name *" outlined dense :rules="[val => !!val || 'Name is required']" />
          <q-input v-model="form.email" label="Email" outlined dense type="email" />
          <q-input v-model="form.mobile" label="Mobile *" outlined dense :rules="[val => !!val || 'Mobile is required']" />
          <q-input v-model="form.event_name" label="Event Name *" outlined dense :rules="[val => !!val || 'Event Name is required']" />
          <q-input v-model="form.event_date" label="Event Date" outlined dense type="date" />
          <q-input v-model="form.event_city" label="City" outlined dense />
          <q-input v-model="form.budget" label="Budget" outlined dense />
          <q-input v-model="form.note" label="Note" outlined dense type="textarea" />

          <div class="row q-gutter-sm">
            <q-btn label="Submit" color="primary" type="submit" />
            <q-btn label="Back" flat @click="router.back()" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { Notify } from 'quasar'

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

const submitLead = async () => {
  const user = JSON.parse(localStorage.getItem('crm_user') || '{}')
  const userId = user.user_id

  try {
    await axios.post('/store-leads', {
      ...form.value,
      user_id: userId
    })

    Notify.create({ type: 'positive', message: 'Lead created successfully!' })
    router.push({ name: 'lead-details', params: { id: userId }, query: { success: 'Lead created successfully' } })
  } catch (err) {
    console.error(err)
    Notify.create({ type: 'negative', message: 'Failed to create lead' })
  }
}
</script>
