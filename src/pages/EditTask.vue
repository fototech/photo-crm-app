<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="text-h6 q-mb-md">✏️ Edit Deliverable Task</div>

    <q-form @submit.prevent="submitForm" class="q-gutter-md">
      <div class="row items-center q-col-gutter-sm bg-white q-pa-sm shadow-1 rounded-borders">
        
        <!-- Deliverable -->
        <div class="col">
          <q-select
            v-model="form.deliverable_id"
            :options="deliverableOptions"
            option-label="label"
            option-value="id"
            emit-value
            map-options
            label="Deliverable"
            dense
            outlined
            :rules="[val => !!val || 'Required']"
          />
        </div>

        <!-- Task Name -->
        <div class="col">
          <q-input
            v-model="form.task_name"
            label="Task (Qty)"
            dense
            outlined
            readonly
          />
        </div>

        <!-- Team Member -->
        <div class="col">
          <q-select
            v-model="form.assigned_team_id"
            :options="teamMemberOptions"
            option-label="label"
            option-value="id"
            emit-value
            map-options
            label="Team Member"
            dense
            outlined
          />
        </div>

        <!-- Timeline -->
        <div class="col">
          <q-input
            v-model="form.timeline"
            type="date"
            label="Timeline"
            dense
            outlined
          />
        </div>

        <!-- Status -->
        <div class="col">
          <q-select
            v-model="form.status"
            :options="statusOptions"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            label="Status"
            dense
            outlined
            :rules="[val => !!val || 'Required']"
          />
        </div>

        <!-- Notes -->
        <div class="col">
          <q-input
            v-model="form.notes"
            label="Notes"
            dense
            outlined
          />
        </div>
      </div>

      <q-btn
        type="submit"
        color="positive"
        label="Update Task"
        class="q-mt-md"
      />
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { axios } from 'boot/axios'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const taskId = route.params.id

const form = reactive({
    event_id: null,
    deliverable_id: null,
    task_name: '',
    assigned_team_id: null,
    timeline: '',
    status: '',
    notes: ''
})

const deliverableOptions = ref([])
const teamMemberOptions = ref([])
const statusOptions = ref([
  { label: 'Not Started', value: 'not_started' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' }
])

const fetchInitialData = async () => {
  try {
    const res = await axios.get(`/edit-single-deliverable-task/${taskId}`)

    if (res.data.status === 'success') {
      const task = res.data.task

      // Set form data
      form.event_id = task.event_id 
      form.deliverable_id = task.deliverable_id
      form.task_name = task.task_name
      form.assigned_team_id = task.assigned_team_id
      form.timeline = task.timeline
      form.status = task.status
      form.notes = task.note ?? ''

      // Options
      deliverableOptions.value = res.data.deliverables.map(d => ({
        id: d.id,
        label: d.work_type_name,
        quantity: d.quantity
      }))

      teamMemberOptions.value = res.data.team_members.map(t => ({
        id: t.id,
        label: `${t.name} - ${t.mobile_number}`
      }))
    } else {
      $q.notify({ type: 'negative', message: res.data.message })
    }
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Failed to load task data.' })
  }
}

watch(() => form.deliverable_id, (val) => {
  const selected = deliverableOptions.value.find(opt => opt.id === val)
  form.task_name = selected ? selected.quantity.toString() : ''
})

const submitForm = async () => {
  try {
    const res = await axios.post(`/update-deliverable-task/${taskId}`, form)
    if (res.data.status === 'success') {
      $q.notify({ type: 'positive', message: 'Task updated successfully!' })
      router.push({ name: 'deliverable-task-details', params: { event_id: res.data.event_id } })
    } else {
      $q.notify({ type: 'negative', message: res.data.message || 'Update failed!' })
    }
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Server error. Please try again later.' })
  }
}

onMounted(fetchInitialData)
</script>

<style scoped>
.q-field {
  margin-bottom: 0 !important;
}
.q-input, .q-select {
  height: 38px;
}
</style>
