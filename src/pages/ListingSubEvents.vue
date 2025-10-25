<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="text-h6 q-mb-md">📷 Sub Events</div>

    <q-btn
      label="Sub Event"
      icon="add"
      color="primary"
      class="q-mb-md"
      @click="goToCreate"
    />

    <q-table
      :rows="subEvents"
      :columns="columns"
      row-key="id"
      flat
      bordered
      separator="horizontal"
      dense
      wrap-cells
    >
      <!-- Sub Event Venue Name -->
      <template #body-cell-sub_event_venue_name="props">
        <q-td :props="props" class="single-line-cell">
          <span>{{ props.row.sub_event_venue_name }}</span>
          <q-tooltip>{{ props.row.sub_event_venue_name }}</q-tooltip>
        </q-td>
      </template>

      <!-- Contact Person -->
      <template #body-cell-contact_person="props">
        <q-td :props="props" class="single-line-cell">
          <span>{{ props.row.contact_person_name }} - {{ props.row.contact_person_mobile }}</span>
          <q-tooltip>{{ props.row.contact_person_name }} - {{ props.row.contact_person_mobile }}</q-tooltip>
        </q-td>
      </template>

      <!-- Team Members -->
      <template #body-cell-team_members="props">
        <q-td :props="props" class="single-line-cell">
          <span v-if="props.row.team_members.length">
            {{ props.row.team_members.map(m => `${m.team_member_name} (${m.member_role})`).join(', ') }}
            <q-tooltip>
              {{ props.row.team_members.map(m => `${m.team_member_name} (${m.member_role})`).join(', ') }}
            </q-tooltip>
          </span>
          <em v-else>No team</em>
        </q-td>
      </template>

      <!-- Actions -->
      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            label="Edit"
            color="primary"
            size="sm"
            @click="editSubEvent(props.row.event_id, props.row.id)"
            class="q-mr-sm"
          />
          <q-btn
            label="Delete"
            color="negative"
            size="sm"
            @click="deleteSubEvent(props.row.event_id, props.row.id)"
          />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const eventId = route.params.id

const subEvents = ref([])

const columns = [
  { name: 'id', label: '#', field: 'id', align: 'left', sortable: true },
  { name: 'sub_event_name', label: 'Sub Event Name', field: 'sub_event_name', align: 'left' },
  { name: 'event_date', label: 'Date', field: 'event_date', align: 'left' },
  { name: 'start_time', label: 'Start Time', field: 'start_time', align: 'left' },
  { name: 'sub_event_venue_name', label: 'Venue', field: 'sub_event_venue_name', align: 'left' },
  { name: 'contact_person', label: 'Contact', field: 'contact_person_name', align: 'left' },
  { name: 'team_members', label: 'Team Members', field: 'team_members', align: 'left' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' }
]

const loadSubEvents = async () => {
  try {
    const res = await axios.get(`/get-sub-event-details/${eventId}`)
    subEvents.value = res.data.sub_events || []
  } catch (err) {
    console.error('Failed to load sub-events:', err)
    $q.notify({ type: 'negative', message: 'Failed to load sub-event details' })
  }
}

const goToCreate = () => {
  router.push(`/createSubEvent/${eventId}`)
}

const editSubEvent = (eventId, subEventId) => {
  router.push(`/editSubEvent/${eventId}/${subEventId}`)
}

const deleteSubEvent = async (eventId, subEventId) => {
  if (!confirm('Are you sure you want to delete this sub-event?')) return

  const user = JSON.parse(localStorage.getItem('crm_user') || '{}')
  const userId = user.user_id

  try {
    await axios.delete(`/delete-sub-event/${eventId}/${subEventId}`, {
      data: { user_id: userId }
    })

    subEvents.value = subEvents.value.filter((sub) => sub.id !== subEventId)
    $q.notify({ type: 'positive', message: 'Sub-event deleted successfully' })
  } catch (err) {
    console.error('Delete error:', err)
    $q.notify({
      type: 'negative',
      message: err.response?.data?.error || 'Failed to delete sub-event'
    })
  }
}


onMounted(loadSubEvents)
</script>

<style scoped>
.single-line-cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
}
</style>
