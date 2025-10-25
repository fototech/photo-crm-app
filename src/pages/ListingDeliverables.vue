<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="text-h6 q-mb-md">📦 Event Deliverables</div>

    <q-btn
      label="Add Deliverable"
      color="primary"
      icon="add"
      class="q-mb-lg"
      @click="goToCreate"
    />

    <q-spinner v-if="loading" color="primary" size="lg" />

    <div v-else-if="deliverables.length === 0">
      <q-banner class="bg-grey-3 text-black">
        No deliverables found for this event.
      </q-banner>
    </div>

    <q-table
      v-else
      :rows="deliverables"
      :columns="columns"
      row-key="id"
      flat
      bordered
      dense
      class="q-mt-md"
    >
      <!-- Cost Column -->
      <template v-slot:body-cell-cost="props">
        <q-td>
          {{ props.row.cost_type === 'include' ? 'Included' : '₹' + props.row.cost }}
        </q-td>
      </template>

      <!-- Cost Type Formatting -->
      <template v-slot:body-cell-cost_type="props">
        <q-td>
          {{ props.row.cost_type.charAt(0).toUpperCase() + props.row.cost_type.slice(1) }}
        </q-td>
      </template>

      <!-- Actions -->
      <template v-slot:body-cell-actions="props">
        <q-td class="text-center">
          <q-btn
            dense
            color="warning"
            icon="edit"
            size="sm"
            @click="goToEdit(props.row.id)"
          />
          <q-btn
            dense
            color="negative"
            icon="delete"
            size="sm"
            class="q-ml-sm"
            @click="deleteDeliverable(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { axios } from 'boot/axios'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

// Correct way: params (NOT query) since your route uses /listingDeliverables/:event_id
const eventId = route.params.event_id
const loading = ref(true)
const deliverables = ref([])

const columns = [
  { name: 'id', label: '#', field: 'id', align: 'left', style: 'width: 50px' },
  { name: 'work_type_name', label: 'Work Type', field: 'work_type_name' },
  { name: 'cost_type', label: 'Cost Type', field: 'cost_type',align: 'left', style: 'width: 100px' },
  { name: 'cost', label: 'Cost', field: 'cost',align: 'left', style: 'width: 100px' },
  { name: 'quantity', label: 'Qty', field: 'quantity', align: 'center', style: 'width: 60px' },
  { name: 'note', label: 'Note', field: 'note' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center', style: 'width: 100px' }
]


const loadDeliverables = async () => {
  if (!eventId) {
    $q.notify({ type: 'negative', message: 'Event ID is missing in the route!' })
    return
  }

  try {
    const res = await axios.get(`/get-deliverableDetails/${eventId}`)
    deliverables.value = res.data.deliverables || []
  } catch (err) {
    console.error('Failed to load deliverables:', err)
    $q.notify({ type: 'negative', message: 'Failed to load deliverables' })
  } finally {
    loading.value = false
  }
}

const goToCreate = () => {
  router.push({ name: 'create-deliverable', params: { event_id: eventId } })
}

const goToEdit = (id) => {
  router.push({ name: 'edit-deliverable', params: { id } })
}

const deleteDeliverable = async (id) => {
  const confirm = window.confirm('Are you sure you want to delete this deliverable?')
  if (!confirm) return

  try {
    await axios.delete(`/delete-deliverable/${id}`)
    deliverables.value = deliverables.value.filter((d) => d.id !== id)
    $q.notify({ type: 'positive', message: 'Deliverable deleted successfully' })
  } catch (err) {
    console.error('Failed to delete deliverable:', err)
    $q.notify({ type: 'negative', message: 'Failed to delete deliverable' })
  }
}

onMounted(loadDeliverables)
</script>

<style scoped>
.q-table {
  background: #fff;
  border-radius: 8px;
}
</style>
