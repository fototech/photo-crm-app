<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="text-h6 q-mb-md">💰 Event Payments - {{ eventDetails?.event_name }}</div>

    <q-banner v-if="message" :class="bannerClass" class="q-mb-md">
      {{ message }}
    </q-banner>

    <div class="row justify-between q-mb-md">
      <q-btn
        label="Add New Payment"
        color="primary"
        icon="add"
        @click="goToAdd"
      />
      <div class="text-subtitle2">
        <q-badge color="primary">Agreement: ₹{{ formatCurrency(eventDetails?.agreement_amount) }}</q-badge>
        <q-badge color="orange" class="q-ml-sm">Balance: ₹{{ formatCurrency(balanceAmount) }}</q-badge>
      </div>
    </div>

    <q-spinner v-if="loading" color="primary" size="md" />

    <q-table
      v-else
      flat
      bordered
      dense
      :rows="payments"
      :columns="columns"
      row-key="id"
      separator="horizontal"
      class="bg-white shadow-1"
    >
      <template v-slot:body-cell-payment_date="props">
        <q-td>{{ formatDate(props.row.payment_date) }}</q-td>
      </template>

      <template v-slot:body-cell-paid_amount="props">
        <q-td>₹{{ formatCurrency(props.row.paid_amount) }}</q-td>
      </template>

      <template v-slot:body-cell-balance="props">
        <q-td>₹{{ formatCurrency(props.row.balance) }}</q-td>
      </template>

      <template v-slot:body-cell-status="props">
        <q-td>
          <q-badge color="info" align="middle">{{ props.row.status }}</q-badge>
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td>
          <q-btn flat round dense color="warning" icon="edit" @click="goToEdit(props.row.id)" />
          <q-btn
            flat round dense color="negative" icon="delete"
            class="q-ml-sm"
            @click="deletePayment(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { axios } from 'boot/axios'
import dayjs from 'dayjs'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const eventId = route.params.event_id
const loading = ref(true)
const eventDetails = ref(null)
const payments = ref([])
const message = ref('')
const bannerClass = ref('bg-green-2 text-green-9')

const columns = [
  { name: 'id', label: '#', field: 'id', align: 'left', style: 'width: 40px' },
  { name: 'event_name', label: 'Event Name', field: 'event_name' },
  { name: 'agreement_amount', label: 'Agreement', field: 'agreement_amount', format: val => `₹${val}` },
  { name: 'payment_date', label: 'Date',align: 'left', field: 'payment_date' },
  { name: 'paid_amount', label: 'Paid Amount',align: 'left', field: 'paid_amount' },
  { name: 'balance', label: 'Balance',align: 'left', field: 'balance' },
  { name: 'payment_type', label: 'Type',align: 'left', field: 'payment_type' },
  { name: 'payment_mode', label: 'Mode',align: 'left', field: 'payment_mode' },
  { name: 'status', label: 'Status',align: 'left', field: 'status' },
  { name: 'transaction_id', label: 'Txn ID', field: 'transaction_id' },
  { name: 'payment_notes', label: 'Notes', field: 'payment_notes' },
  { name: 'actions', label: 'Action', field: 'actions', align: 'center', style: 'width: 80px' }
]

const balanceAmount = computed(() => {
  const totalPaid = payments.value.reduce((sum, p) => sum + p.paid_amount, 0)
  return (eventDetails.value?.agreement_amount || 0) - totalPaid
})

const formatCurrency = amount => Number(amount).toFixed(2)
const formatDate = date => dayjs(date).format('DD-MMM-YYYY')

const goToAdd = () => router.push({ name: 'create-event-payment', params: { event_id: eventId } })
const goToEdit = id => router.push({ name: 'edit-event-payment', params: { id } })

const fetchPayments = async () => {
  try {
    const res = await axios.get(`/get-event-payment-details/${eventId}`)
    eventDetails.value = res.data.event
    eventDetails.value = res.data.event

    const rawPayments = [...res.data.payments].sort((a, b) => new Date(a.payment_date) - new Date(b.payment_date))
    const agreementAmount = res.data.event.agreement_amount
    let runningPaid = 0

    payments.value = rawPayments.map((p) => {
    const paidAmount = Number(p.paid_amount)
    runningPaid += paidAmount

        return {
            ...p,
            paid_amount: paidAmount,  // optional: normalize
            event_name: res.data.event.event_name,
            agreement_amount: agreementAmount,
            balance: agreementAmount - runningPaid
        }
    })

  } catch (err) {
    message.value = 'Failed to load payment records.'
    bannerClass.value = 'bg-red-2 text-red-9'
    console.error(err)
  } finally {
    loading.value = false
  }
}

const deletePayment = async id => {
  const confirm = window.confirm('Are you sure you want to delete this payment?')
  if (!confirm) return

  try {
    await axios.delete(`/delete-event-payment/${id}`)
    await fetchPayments()
    $q.notify({ type: 'positive', message: 'Payment deleted successfully' })
  } catch (err) {
    console.error('Failed to delete payment:', err)
    $q.notify({ type: 'negative', message: 'Failed to delete payment' })
  }
}

onMounted(fetchPayments)
</script>

<style scoped>
.q-table {
  border-radius: 10px;
}
</style>
