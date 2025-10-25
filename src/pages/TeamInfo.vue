<template>
  <q-page class="q-pa-md bg-grey-1">
    <q-card>
        <q-card-section>
        <div class="text-h5 text-bold">Team Members</div>

        <q-btn
            label="Add New Contact"
            color="primary"
            class="q-mt-sm"
            :to="{ name: 'create-team' }"
        />

      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-table
          :rows="teamMembers"
          :columns="columns"
          row-key="id"
          flat
          bordered
          :loading="loading"
          no-data-label="No team members found"
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
                @click="editMember(props.row.id)"
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
        <q-card-section>Are you sure you want to delete this member?</q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn flat label="Delete" color="red" @click="deleteMember" />
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

const teamMembers = ref([])
const loading = ref(false)
const deleteDialog = ref(false)
const memberToDelete = ref(null)

const columns = [
    { name: 'index', label: '#', align: 'left',field: 'index', sortable: false },
    { name: 'name', label: 'Name', field: 'name', align: 'left' },
    { name: 'mobile_number', label: 'Mobile Number', field: 'mobile_number', align: 'left' },
    { name: 'role', label: 'Role', field: 'role', align: 'left' },
    { name: 'salary', label: 'Salary', field: 'salary', align: 'left' },
    { name: 'team_name', label: 'Team Name', field: 'team_name', align: 'left' },
    { name: 'sub_category_name', label: 'Sub Category', field: 'sub_category_name', align: 'left' },
    { name: 'actions', label: 'Actions', field: 'actions', align: 'center' }
]

const fetchTeamMembers = async () => {
  loading.value = true
  try {
    const res = await axios.get('/team-info')
    teamMembers.value = res.data.members
  } catch (err) {
    console.error(err)
    Notify.create({ type: 'negative', message: 'Failed to load team members' })
  } finally {
    loading.value = false
  }
}

const editMember = (id) => {
  router.push({ name: 'edit-team', params: { id } })
}

const confirmDelete = (id) => {
  memberToDelete.value = id
  deleteDialog.value = true
}

const deleteMember = async () => {
  try {
    await axios.delete(`/delete-team/${memberToDelete.value}`)
    teamMembers.value = teamMembers.value.filter(m => m.id !== memberToDelete.value)
    Notify.create({ type: 'positive', message: 'Member deleted successfully' })
  } catch (err) {
    console.error(err)
    Notify.create({ type: 'negative', message: 'Failed to delete member' })
  } finally {
    deleteDialog.value = false
  }
}

onMounted(fetchTeamMembers)
</script>
