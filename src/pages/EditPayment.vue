<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="text-h6 q-mb-md">✏️ Edit Event Payment - {{ eventDetails?.event_name }}</div>

    <q-banner v-if="message" :class="bannerClass" class="q-mb-md">
      {{ message }}
    </q-banner>

    <q-form @submit.prevent="updatePayment">
      <!-- Event Name & Agreement Amount (readonly) -->
      <q-input v-model="form.event_name" label="Event Name" readonly class="q-mb-md" />
      <q-input v-model="form.agreement_amount" label="Agreement Amount" readonly class="q-mb-md" />

      <!-- Editable Fields -->
      <q-input v-model="form.payment_date" label="Payment Date" type="date" class="q-mb-md" required />

      <q-input
        v-model.number="form.paid_amount"
        label="Paid Amount (₹)"
        type="number"
        step="0.01"
        class="q-mb-md"
        required
      />

      <q-select
        v-model="form.payment_type"
        label="Payment Type"
        :options="['advance', 'full', 'partial']"
        class="q-mb-md"
        outlined
      />

      <q-select
        v-model="form.payment_mode"
        label="Payment Mode"
        :options="['cash', 'credit_card', 'debit_card', 'bank_transfer', 'cheque', 'upi', 'online_gateway']"
        class="q-mb-md"
        outlined
      />

      <q-input v-model="form.transaction_id" label="Transaction ID" class="q-mb-md" />

      <q-input
        v-model="form.payment_notes"
        label="Payment Notes"
        type="textarea"
        rows="3"
        class="q-mb-md"
      />

      <q-select
        v-model="form.status"
        label="Status"
        :options="['pending', 'completed', 'failed']"
        class="q-mb-md"
        outlined
      />

      <q-btn label="Update Payment" color="primary" type="submit" />
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { axios } from 'boot/axios'

const route = useRoute()
const router = useRouter()
const paymentId = route.params.id

const eventDetails = ref({})
const message = ref('')
const bannerClass = ref('bg-green-2 text-green-9')

const form = ref({
  event_name: '',
  agreement_amount: '',
  payment_date: '',
  paid_amount: '',
  payment_type: '',
  payment_mode: '',
  transaction_id: '',
  payment_notes: '',
  status: 'pending'
})

const fetchPayment = async () => {
  try {
    const res = await axios.get(`/get-single-payment/${paymentId}`)
    const payment = res.data.payment
    const event = res.data.event

    eventDetails.value = event

    form.value = {
      event_name: event?.event_name || '',
      agreement_amount: event?.agreement_amount || '',
      payment_date: payment?.payment_date || '',
      paid_amount: payment?.paid_amount || '',
      payment_type: payment?.payment_type || '',
      payment_mode: payment?.payment_mode || '',
      transaction_id: payment?.transaction_id || '',
      payment_notes: payment?.payment_notes || '',
      status: payment?.status || 'pending'
    }
  } catch (err) {
    message.value = 'Failed to load payment details.'
    bannerClass.value = 'bg-red-2 text-red-9'
    console.error(err)
  }
}

const updatePayment = async () => {
  try {
    await axios.post(`/update-event-payment/${paymentId}`, form.value)
    message.value = 'Payment updated successfully!'
    bannerClass.value = 'bg-green-2 text-green-9'

    router.push({ name: 'event-payment-list', params: { event_id: eventDetails.value.id } })
  } catch (err) {
    message.value = 'Failed to update payment.'
    bannerClass.value = 'bg-red-2 text-red-9'
    console.error(err)
  }
}

onMounted(fetchPayment)
</script>

<style scoped>
.q-page {
  max-width: 700px;
  margin: auto;
}
</style>
