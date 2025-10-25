<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="text-h6 q-mb-md">✏️ Edit Deliverable</div>

    <q-form @submit.prevent="submitForm" class="q-gutter-md">
      <div
        class="row items-center q-col-gutter-sm bg-white q-pa-sm shadow-1 rounded-borders"
        style="margin-bottom: 10px"
      >
        <!-- Work Type -->
        <div class="col">
          <q-select
            v-model="form.work_type_id"
            :options="workTypeOptions"
            option-label="name"
            option-value="id"
            emit-value          
            map-options 
            label="Work Type"
            dense outlined
            :rules="[val => !!val || 'Required']"
            class="full-height-input"
          />
        </div>

        <!-- Cost Type -->
        <div class="col">
          <q-select
            v-model="form.cost_type"
            :options="['include', 'exclude']"
            label="Cost Type"
            dense outlined
            :rules="[val => !!val || 'Required']"
            class="full-height-input"
          />
        </div>

        <!-- Cost -->
        <div class="col">
          <q-input
            v-if="form.cost_type === 'exclude'"
            v-model.number="form.cost"
            type="number"
            label="Cost"
            dense outlined
            :rules="[val => !!val || 'Required']"
            class="full-height-input"
          />
          <q-input
            v-else-if="form.cost_type === 'include'"
            disable
            dense outlined
            label="Included"
            class="full-height-input bg-grey-3"
          />
          <div v-else class="text-grey text-caption q-ml-sm">Select cost type</div>
        </div>

        <!-- Quantity -->
        <div class="col">
          <q-input
            v-model.number="form.quantity"
            type="number"
            label="Qty"
            dense outlined
            :rules="[val => !!val || 'Required']"
            class="full-height-input"
          />
        </div>

        <!-- Note -->
        <div class="col">
          <q-input
            v-model="form.note"
            type="text"
            label="Note"
            dense outlined
            class="full-height-input"
          />
        </div>
      </div>

      <!-- Submit -->
      <q-btn
        type="submit"
        color="positive"
        label="Update Deliverable"
        class="q-mt-md"
      />
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { axios } from 'boot/axios'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

// FIX: Use query.id if you're passing ?id=xx in URL
const deliverableId = route.query.id || route.params.id

const form = ref({
  work_type_id: null,
  cost_type: null,
  cost: null,
  quantity: null,
  note: ''
})

const workTypeOptions = ref([])

const fetchWorkTypes = async () => {
  try {
    const res = await axios.get('/work-types')
    workTypeOptions.value = res.data.work_types || []
  } catch (err) {
    console.error('Failed to fetch work types:', err)
    $q.notify({ type: 'negative', message: 'Failed to load work types' })
  }
}

const fetchDeliverable = async () => {
  try {
    const res = await axios.get(`/get-single-deliverable/${deliverableId}`)
    const data = res.data.deliverable

    // Ensure you are using just the ID (number) for dropdown
    form.value = {
      work_type_id: Number(data.work_type_id),
      cost_type: data.cost_type,
      cost: data.cost,
      quantity: data.quantity,
      note: data.note
    }
  } catch (err) {
    console.error('Failed to fetch deliverable:', err)
    $q.notify({ type: 'negative', message: 'Error loading deliverable data' })
  }
}

const submitForm = async () => {
  try {
    const payload = { ...form.value }

    const res = await axios.put(`/update-deliverable/${deliverableId}`, payload)

    if (res.data?.success || res.status === 200) {
      $q.notify({ type: 'positive', message: 'Deliverable updated successfully!' })
      router.push({ path: `/listingDeliverables/${res.data.event_id || ''}` })
    } else {
      $q.notify({ type: 'negative', message: 'Update failed. Please try again.' })
    }
  } catch (err) {
    console.error('Error updating:', err)
    $q.notify({ type: 'negative', message: 'Server error. Try again later.' })
  }
}

onMounted(() => {
  fetchWorkTypes()
  fetchDeliverable()
})
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
