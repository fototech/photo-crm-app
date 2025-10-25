<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="text-h6 q-mb-md">➕ Add Deliverable Tasks</div>

    <q-form @submit.prevent="submitForm" class="q-gutter-md">
      <div
        v-for="(task, index) in tasks"
        :key="index"
        class="row items-center q-col-gutter-sm bg-white q-pa-sm shadow-1 rounded-borders"
        style="margin-bottom: 10px"
      >
        <!-- Deliverable -->
        <div class="col">
          <q-select
            v-model="task.deliverable_id"
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

        <!-- Task Name (Qty Auto-filled) -->
        <div class="col">
          <q-input
            v-model="task.task_name"
            label="Task (Qty)"
            dense
            outlined
            readonly
          />
        </div>

        <!-- Team Member -->
        <div class="col">
          <q-select
            v-model="task.assigned_team_id"
            :options="teamMembers"
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
            v-model="task.timeline"
            type="date"
            label="Timeline"
            dense
            outlined
            
          />
        </div>

        <!-- Status -->
        <div class="col">
          <q-select
            v-model="task.status"
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
            v-model="task.notes"
            label="Notes"
            dense
            outlined
          />
        </div>

        <!-- Remove Button -->
        <div class="col-auto">
          <q-btn
            icon="delete"
            color="negative"
            flat
            round
            dense
            @click="removeRow(index)"
            v-if="tasks.length > 1"
          />
        </div>

        <!-- Add Button -->
        <div class="col-auto">
          <q-btn
            icon="add"
            color="primary"
            flat
            round
            dense
            @click="addRow"
            v-if="index === tasks.length - 1"
          />
        </div>
      </div>

      <q-btn
        type="submit"
        color="positive"
        label="Save Tasks"
        class="q-mt-md"
      />
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import { axios } from 'boot/axios'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const eventId = route.params.event_id

const tasks = ref([
  {
    deliverable_id: null,
    task_name: '',
    assigned_team_id: null,
    timeline: '',
    status: 'not_started',
    notes: ''
  }
])

const deliverableOptions = ref([])
const teamMembers = ref([])
const statusOptions = ref([])

const fetchInitialData = async () => {
  try {
    const res = await axios.get(`/create-deliverable-task/${eventId}`)

    // Populate dropdowns
    deliverableOptions.value = (res.data.deliverables || []).map(item => ({
      id: item.id,
      label: item.work_type_name,
      quantity: item.quantity
    }))

    teamMembers.value = (res.data.team_members || []).map(member => ({
      id: member.id,
      label: `${member.name} - ${member.mobile_number}`
    }))

    statusOptions.value = [
      { label: 'Not Started', value: 'not_started' },
      { label: 'In Progress', value: 'in_progress' },
      { label: 'Completed', value: 'completed' }
    ]

    // Pre-fill existing tasks if present
    if (res.data.tasks && res.data.tasks.length) {
      tasks.value = res.data.tasks.map(t => ({
        deliverable_id: t.deliverable_id ?? t.deliverable?.id ?? null,
        task_name: t.task_name ?? t.deliverable?.quantity ?? '',
        assigned_team_id: t.assigned_team_id ?? t.assigned_member?.id ?? null,
        timeline: t.timeline ?? '',
        status: t.status ?? 'not_started',
        notes: t.note ?? t.notes ?? ''
      }))
    }

  } catch (err) {
    console.error('Error loading data:', err)
    $q.notify({ type: 'negative', message: 'Failed to load data.' })
  }
}


const addRow = () => {
  tasks.value.push({
    deliverable_id: null,
    task_name: '',
    assigned_team_id: null,
    timeline: '',
    status: 'not_started',
    notes: ''
  })
}

const removeRow = (index) => {
  if (tasks.value.length > 1) {
    tasks.value.splice(index, 1)
  }
}

const submitForm = async () => {
  try {
    const payload = { tasks: tasks.value }
    const res = await axios.post(`/store-deliverable-task`, {
        ...payload,
        event_id: eventId
    })

    if (res.data?.success) {
      $q.notify({ type: 'positive', message: 'Tasks saved!' })
      router.push({ name: 'deliverable-task-details', params: { event_id: eventId } })
    } else {
      $q.notify({ type: 'negative', message: 'Save failed!' })
    }
  } catch (err) {
    console.error(err)
    $q.notify({ type: 'negative', message: 'Server error. Try again later.' })
  }
}

// Auto-fill task_name when deliverable is selected
watch(tasks, (newTasks) => {
  newTasks.forEach(task => {
    const selected = deliverableOptions.value.find(opt => opt.id === task.deliverable_id)
    task.task_name = selected ? String(selected.quantity) : ''
  })
}, { deep: true })

onMounted(fetchInitialData)
</script>

<style scoped>
.full-height-input .q-field__control {
  height: 38px !important;
  min-height: 38px !important;
  align-items: center !important;
}

.q-field {
  margin-bottom: 0 !important;
}

.q-input,
.q-select {
  height: 38px;
}
</style>
