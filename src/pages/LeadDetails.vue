<template>
  <q-page class="q-pa-md bg-grey-1">
    <q-card>
      <q-card-section>
        <div class="text-h5 text-bold">My Leads</div>

        <q-btn
          label="Add New Lead"
          color="primary"
          class="q-mt-sm"
          :to="{ name: 'create-lead', params: { id: userId } }"
        />
      </q-card-section>

      <q-separator color="grey-4" />

      <q-card-section>
        <q-banner
          v-if="successMessage"
          class="bg-green-3 text-white q-mb-md"
          rounded
        >
          {{ successMessage }}
        </q-banner>

        <q-table
          :rows="leads"
          :columns="columns"
          row-key="id"
          flat
          bordered
          dense
          :loading="loading"
          no-data-label="No Leads Available"
        >
            <template v-slot:body-cell-index="props">
                <q-td>
                    {{ props.pageIndex + 1 }}
                </q-td>
            </template>
          <template v-slot:body-cell-actions="props">
            <q-td align="center">
              <q-btn
                dense
                flat
                size="sm"
                icon="edit"
                color="primary"
                @click="goToEdit(props.row.id)"
              />
              <q-btn
                dense
                flat
                size="sm"
                icon="delete"
                color="negative"
                @click="confirmDelete(props.row.id)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Delete Confirm Dialog -->
    <q-dialog v-model="deleteDialog">
      <q-card>
        <q-card-section class="text-h6">Confirm Deletion</q-card-section>
        <q-card-section>Are you sure you want to delete this lead?</q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn flat label="Delete" color="red" @click="deleteLead" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { Notify } from 'quasar'

const router = useRouter()
const route = useRoute()

const user = JSON.parse(localStorage.getItem('crm_user') || '{}')
const userId = user.user_id

const leads = ref([])
const loading = ref(false)
const successMessage = ref('')
const deleteDialog = ref(false)
const leadToDelete = ref(null)

const columns = [
    { name: 'index', label: '#', align: 'left',field: 'index', sortable: false },
    { name: 'name', label: 'Name', field: 'name' },
    { name: 'email', label: 'Email', field: 'email', format: val => val || '-' },
    { name: 'mobile', label: 'Mobile', field: 'mobile' },
    { name: 'event_name', label: 'Event', field: 'event_name' },
    { name: 'event_date', label: 'Date', field: 'event_date' },
    { name: 'event_city', label: 'City', field: 'event_city' },
    { name: 'budget', label: 'Budget', field: 'budget' },
    { name: 'note', label: 'Note', field: 'note' },
    { name: 'actions', label: 'Actions', field: 'actions', align: 'center' }
]

const fetchLeads = async () => {
  loading.value = true
  try {
    const res = await axios.get('/leads', {
      params: { user_id: userId }
    })
    leads.value = res.data.leads || []
  } catch (err) {
    console.error(err)
    Notify.create({ type: 'negative', message: 'Failed to load leads' })
  } finally {
    loading.value = false
  }
}

const goToEdit = id => {
  router.push({ name: 'edit-lead', params: { id } })
}

const confirmDelete = id => {
  leadToDelete.value = id
  deleteDialog.value = true
}

const deleteLead = async () => {
  try {
    await axios.delete(`/delete-leads/${leadToDelete.value}`)
    Notify.create({ type: 'positive', message: 'Lead deleted successfully' })
    leads.value = leads.value.filter(l => l.id !== leadToDelete.value)
  } catch (err) {
    console.error(err)
    Notify.create({ type: 'negative', message: 'Delete failed' })
  } finally {
    deleteDialog.value = false
  }
}

onMounted(() => {
  if (route.query.success) {
    successMessage.value = route.query.success
  }
  fetchLeads()
})
</script>
