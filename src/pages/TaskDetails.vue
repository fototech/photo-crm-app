<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="text-h6 q-mb-md">📋 Deliverable Tasks – {{ event?.event_name }}</div>

    <q-banner v-if="message" class="q-mb-md bg-green-2 text-green-9">
      {{ message }}
    </q-banner>

    <q-btn
      label="Add New Task"
      color="primary"
      icon="add"
      class="q-mb-md"
      :to="{ name: 'create-deliverable-task', params: { event_id: event.id } }"
    />

    <q-table
      v-if="tasks.length"
      :rows="tasks"
      :columns="columns"
      row-key="id"
      flat
      bordered
      class="bg-white"
    >
        <template v-slot:body-cell-index="props">
            <q-td :props="props">
                {{ props.pageIndex + 1 }}
            </q-td>
        </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip
            :color="statusColor(props.row.status)"
            text-color="white"
            dense
            class="q-mr-sm"
          >
            {{ props.row.status.replace('_', ' ') }}
          </q-chip>

          <q-btn
            v-if="props.row.status !== 'completed'"
            size="sm"
            dense
            flat
            :label="props.row.status === 'not_started' ? 'Start' : 'Complete'"
            :color="props.row.status === 'not_started' ? 'info' : 'positive'"
            @click="toggleStatus(props.row)"
          />
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            size="sm"
            icon="edit"
            color="primary"
            @click="$router.push({ name: 'edit-deliverable-task', params: { id: props.row.id } })"
          />
          <q-btn
            flat
            size="sm"
            icon="delete"
            color="negative"
            @click="deleteTask(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>

    <div v-else class="text-grey text-center q-mt-md">
      No deliverable tasks found for this event.
    </div>
  </q-page>
</template>

<script>
import axios from 'axios'
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'

export default {
  setup() {
    const route = useRoute()
    const eventId = route.params.event_id

    const tasks = ref([])
    const event = ref({})
    const message = ref('')

    const formatDate = (date) => {
      const parsed = dayjs(date)
      return parsed.isValid() ? parsed.format('DD MMM YYYY') : '-'
    }

    const columns = [
        { name: 'index', label: '#', align: 'left' },
        { name: 'work_type', align: 'left', label: 'Work Type', field: row => row.work_type_name || 'N/A' },
        { name: 'task_name', align: 'left', label: 'Task Name', field: 'task_name' },
        { name: 'assigned_to', align: 'left', label: 'Assigned To', field: row => row.assigned_member?.name || 'N/A' },
        { name: 'mobile', align: 'left', label: 'Mobile', field: row => row.assigned_member?.mobile_number || 'N/A' },
        { name: 'timeline', align: 'left', label: 'Due Date', field: row => formatDate(row.timeline) },
        { name: 'note', align: 'left', label: 'Note', field: row => row.note || '-' },
        { name: 'status', align: 'left', label: 'Status', field: 'status' },
        { name: 'actions', align: 'center', label: 'Action', field: 'id', sortable: false }
    ]


    const fetchTasks = () => {
      axios.get(`/get-deliverable-task/${eventId}`)
        .then(res => {
          tasks.value = res.data.tasks
          event.value = res.data.event
        })
        .catch(() => {
          message.value = 'Failed to fetch task data.'
        })
    }

    const toggleStatus = (task) => {
      axios.post(`/toggle-deliverable-task-status/${task.id}`).then(() => {
        fetchTasks()
      })
    }

    const deleteTask = (id) => {
      if (confirm('Are you sure you want to delete this task?')) {
        axios.delete(`/delete-deliverable-task/${id}`).then(() => {
          message.value = 'Task deleted successfully!'
          fetchTasks()
        })
      }
    }

    const statusColor = (status) => {
      switch (status) {
        case 'not_started': return 'orange'
        case 'in_progress': return 'info'
        case 'completed': return 'positive'
        default: return 'grey'
      }
    }

    onMounted(fetchTasks)

    return {
      tasks,
      event,
      message,
      columns,
      formatDate,
      toggleStatus,
      deleteTask,
      statusColor
    }
  }
}
</script>

<style scoped>
.q-table .q-btn {
  margin-right: 4px;
}
</style>
