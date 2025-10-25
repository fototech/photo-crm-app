<template>
  <q-page class="q-pa-md bg-grey-1">
    <q-card>
      <q-card-section>
        <div class="text-h5 text-bold">My Contacts</div>

        <q-btn
            label="Add New Contact"
            color="primary"
            class="q-mt-sm"
            @click="() => {
                router.push('/create-contact')
            }"
        />

      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          flat
          bordered
          :rows="contacts"
          :columns="columns"
          row-key="id"
          :loading="loading"
          class="q-mt-sm"
        >
        <template v-slot:body-cell-index="props">
            <q-td>
                {{ props.pageIndex + 1 }}
            </q-td>
        </template>
          <template v-slot:body-cell-actions="props">
            <q-td align="center">
              <q-btn size="sm" color="info" icon="edit" dense @click="editContact(props.row.id)" />
              <q-btn size="sm" color="negative" icon="delete" dense class="q-ml-sm" @click="deleteContact(props.row.id)" />
            </q-td>
          </template>
        </q-table>

        <div v-if="contacts.length === 0" class="text-subtitle2 q-mt-md text-grey-7 text-center">
          No Contacts Available..
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { Notify, Dialog } from 'quasar'

const router = useRouter()
const contacts = ref([])
const loading = ref(false)

const columns = [
  { name: 'index', label: '#', align: 'left',field: 'index', sortable: false },
  { name: 'client_name', label: 'Client Name', field: 'client_name', sortable: true },
  { name: 'mobile_number', label: 'Mobile', field: 'mobile_number', sortable: true },
  { name: 'email', label: 'Email', field: 'email', sortable: true },
  { name: 'location', label: 'Location', field: row => `${row.city_name}, ${row.state_name}` },
  { name: 'contact_type', label: 'Type', field: 'contact_type', sortable: true },
  { name: 'before_event', label: 'Before Event', field: 'before_event', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', sortable: false },
]

onMounted(async () => {
  loading.value = true

  const user = JSON.parse(localStorage.getItem('crm_user') || '{}')
  const userId = user.user_id
  try {
    const res = await axios.get('/get-contact-details', {
      params: { user_id: userId }
    })
    contacts.value = res.data.data
  } catch (err) {
    console.error(err)
    Notify.create({ type: 'negative', message: 'Failed to load contacts.' })
  } finally {
    loading.value = false
  }
})

function editContact(id) {
  router.push({ name: 'edit-contact', params: { id } })
}

function deleteContact(id) {
  Dialog.create({
    title: 'Confirm',
    message: 'Are you sure you want to delete this contact?',
    cancel: true,
    persistent: true
  }).onOk(async () => {

    const user = JSON.parse(localStorage.getItem('crm_user') || '{}')
    const userId = user.user_id
    try {
      await axios.delete(`/delete-contact/${id}`, {
      params: { user_id: userId }
    })
      contacts.value = contacts.value.filter(contact => contact.id !== id)
      Notify.create({ type: 'positive', message: 'Contact deleted successfully.' })
    } catch (err) {
      console.error(err)
      Notify.create({ type: 'negative', message: 'Failed to delete contact.' })
    }
  })
}
</script>
