<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="text-h6 q-mb-md">➕ Add Deliverables</div>

    <q-form @submit.prevent="submitForm" class="q-gutter-md">

      <div
        v-for="(item, index) in deliverables"
        :key="index"
        class="row items-center q-col-gutter-sm bg-white q-pa-sm shadow-1 rounded-borders"
        style="margin-bottom: 10px"
      >
        <!-- Work Type -->
        <div class="col">
            <q-select
                v-model="item.work_type_id"
                :options="workTypeOptions"
                option-label="name"
                option-value="id" 
                emit-value          
                map-options 
                label="Work Type"
                dense
                outlined
                :rules="[val => !!val || 'Required']"
                class="full-height-input"
            />
        </div>

        <!-- Cost Type -->
        <div class="col">
          <q-select
            v-model="item.cost_type"
            :options="['include', 'exclude']"
            label="Cost Type"
            dense
            outlined
            :rules="[val => !!val || 'Required']"
            class="full-height-input"
          />
        </div>

        <!-- Cost -->
        <div class="col">
          <q-input
            v-if="item.cost_type === 'exclude'"
            v-model.number="item.cost"
            type="number"
            label="Cost"
            dense
            outlined
            :rules="[val => item.cost_type === 'exclude' ? (!!val && val >= 0) || 'Required' : true]"
            class="full-height-input"
          />
          <q-input
            v-else-if="item.cost_type === 'include'"
            disable
            dense
            outlined
            label="Included"
            class="full-height-input bg-grey-3"
          />
          <div v-else class="text-grey text-caption q-ml-sm">Select cost type</div>
        </div>

        <!-- Quantity -->
        <div class="col">
          <q-input
            v-model.number="item.quantity"
            type="number"
            label="Qty"
            dense
            outlined
            :rules="[val => !!val || 'Required']"
            class="full-height-input"
          />
        </div>

        <!-- Note -->
        <div class="col">
          <q-input
            v-model="item.note"
            type="text"
            label="Note"
            dense
            outlined
            class="full-height-input"
          />
        </div>

        <!-- Remove -->
        <div class="col-auto">
          <q-btn
            icon="delete"
            color="negative"
            flat
            round
            dense
            @click="removeRow(index)"
            v-if="deliverables.length > 1"
          />
        </div>

        <!-- Add -->
        <div class="col-auto">
          <q-btn
            icon="add"
            color="primary"
            flat
            round
            dense
            @click="addRow"
            v-if="index === deliverables.length - 1"
          />
        </div>
      </div>

      <!-- Submit -->
      <q-btn
        type="submit"
        color="positive"
        label="Save Deliverables"
        class="q-mt-md"
      />
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import { axios } from 'boot/axios'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const eventId = route.params.event_id || route.query.event_id

const deliverables = ref([
  {
    work_type_id: null,
    cost_type: null,
    cost: null,
    quantity: null,
    note: ''
  }
])

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


const addRow = () => {
  deliverables.value.push({
    work_type_id: null,
    cost_type: null,
    cost: null,
    quantity: null,
    note: ''
  })
}

const removeRow = (index) => {
  deliverables.value.splice(index, 1)
}

const submitForm = async () => {
  try {
    const payload = { deliverables: deliverables.value }

    const res = await axios.post(`/store-deliverable/${eventId}`, payload)

    if (res.data?.success || res.status === 200) {
      $q.notify({ type: 'positive', message: 'Deliverables saved!' })
      router.push({ path: `/listingDeliverables/${eventId}` })
    } else {
      $q.notify({ type: 'negative', message: 'Save failed. Please try again.' })
    }
  } catch (err) {
    console.error('Error submitting:', err)
    $q.notify({ type: 'negative', message: 'Server error. Try again later.' })
  }
}

onMounted(fetchWorkTypes)
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

.q-input, .q-select {
  height: 38px;
}
</style>

