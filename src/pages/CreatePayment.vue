<template>
  <q-page class="q-pa-md">
    <div class="text-h6 q-mb-md">➕ Add Event Payment</div>

    <q-form @submit.prevent="submitPayment">
      <q-card flat bordered class="q-pa-md">

        <q-input
          label="Event Name"
          v-model="eventDetails.event_name"
          filled
          readonly
          class="q-mb-md"
        />

        <q-input
          label="Agreement Amount (₹)"
          v-model="eventDetails.agreement_amount"
          filled
          readonly
          class="q-mb-md"
        />

        <q-input
          label="Payment Date"
          v-model="form.payment_date"
          type="date"
          filled
          required
          class="q-mb-md"
        />

        <q-input
          label="Paid Amount (₹)"
          v-model="form.paid_amount"
          type="number"
          step="0.01"
          filled
          required
          class="q-mb-md"
        />

        <q-select
          label="Payment Type"
          v-model="form.payment_type"
          :options="['advance', 'full', 'partial']"
          filled
          class="q-mb-md"
        />

        <q-select
          label="Payment Mode"
          v-model="form.payment_mode"
          :options="paymentModes"
          filled
          class="q-mb-md"
        />

        <q-input
          label="Transaction ID"
          v-model="form.transaction_id"
          filled
          class="q-mb-md"
        />

        <q-input
          label="Payment Notes"
          v-model="form.payment_notes"
          type="textarea"
          filled
          class="q-mb-md"
        />

        <q-select
          label="Status"
          v-model="form.status"
          :options="['pending', 'completed', 'failed']"
          filled
          class="q-mb-md"
        />

        <q-btn type="submit" label="Save Payment" color="primary" class="q-mt-md" />
      </q-card>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { axios } from 'boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const event_id = route.params.event_id

const eventDetails = ref({})
const form = ref({
  event_id,
  payment_date: '',
  paid_amount: '',
  payment_type: 'advance',
  payment_mode: '',
  transaction_id: '',
  payment_notes: '',
  status: 'completed',
})

const paymentModes = [
  'cash',
  'credit_card',
  'debit_card',
  'bank_transfer',
  'cheque',
  'upi',
  'online_gateway'
]

const fetchEventDetails = async () => {
  try {
    const res = await axios.get(`/create-event-payment/${event_id}`)
    eventDetails.value = res.data.event
  } catch (err) {
    console.error('Error fetching event:', err)
    $q.notify({ type: 'negative', message: 'Failed to fetch event details' })
  }
}

const submitPayment = async () => {
  try {
    await axios.post('/store-event-payment', form.value)
    $q.notify({ type: 'positive', message: 'Payment saved successfully' })
    router.push(`/event-payments/${event_id}`)
  } catch (err) {
    console.error('Submit failed:', err)
    $q.notify({ type: 'negative', message: 'Failed to save payment' })
  }
}

onMounted(fetchEventDetails)
</script>
