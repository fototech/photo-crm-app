<template>
  <q-page class="q-pa-md bg-grey-1">
    <q-card>
      <q-card-section>
        <div class="text-h5 text-bold">Vendors List</div>

        <q-btn
          label="Add Vendor"
          color="primary"
          class="q-mt-sm"
          :to="{ name: 'create-vendor' }"
        />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="vendors"
          :columns="columns"
          row-key="id"
          flat
          bordered
          :loading="loading"
          no-data-label="No vendors found"
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
                @click="editVendor(props.row.id)"
              />
              <q-btn
                dense
                flat
                size="sm"
                icon="delete"
                color="negative"
                class="q-ml-sm"
                @click="confirmDelete(props.row.id)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="deleteDialog">
      <q-card>
        <q-card-section class="text-h6">Confirm Deletion</q-card-section>
        <q-card-section>Are you sure you want to delete this vendor?</q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn flat label="Delete" color="red" @click="deleteVendor" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { Notify } from 'quasar'

const router = useRouter()

const vendors = ref([])
const loading = ref(false)
const deleteDialog = ref(false)
const vendorToDelete = ref(null)

const columns = [
  { name: 'index', label: '#', align: 'left', field: 'index', sortable: false },
  { name: 'name', label: 'Name', field: 'name', align: 'left' },
  { name: 'category_name', label: 'Category', field: 'category_name', align: 'left' },
  { name: 'sub_category_name', label: 'Sub-Category', field: row => row.sub_category_name || 'N/A', align: 'left' },
  { name: 'services_provided', label: 'Services Provided', field: 'services_provided', align: 'left' },
  { name: 'mobile_number', label: 'Mobile Number', field: row => row.mobile_number || 'N/A', align: 'left' },
  { name: 'salary', label: 'Salary', field: 'salary', align: 'left' },
  { name: 'notes', label: 'Notes', field: 'notes', align: 'left' },
  { name: 'created_at', label: 'Created At', field: row => formatDate(row.created_at), align: 'left' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' }
]

const fetchVendors = async () => {
  loading.value = true
  try {
    const res = await axios.get('/vendor-info') // adjust route if needed
    vendors.value = res.data.vendors
  } catch (err) {
    console.error(err)
    Notify.create({ type: 'negative', message: 'Failed to load vendors' })
  } finally {
    loading.value = false
  }
}

const editVendor = (id) => {
  router.push({ name: 'edit-vendor', params: { id } })
}

const confirmDelete = (id) => {
  vendorToDelete.value = id
  deleteDialog.value = true
}

const deleteVendor = async () => {
  try {
    await axios.delete(`/delete-vendor/${vendorToDelete.value}`)
    vendors.value = vendors.value.filter(v => v.id !== vendorToDelete.value)
    Notify.create({ type: 'positive', message: 'Vendor deleted successfully' })
  } catch (err) {
    console.error(err)
    Notify.create({ type: 'negative', message: 'Failed to delete vendor' })
  } finally {
    deleteDialog.value = false
  }
}

const formatDate = (dateString) => {
  const d = new Date(dateString)
  return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

onMounted(fetchVendors)
</script>
