<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section class="text-h6">Add Vendor</q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submitForm">
          <q-input
            v-model="form.name"
            label="Vendor Name"
            outlined dense
            :error="!!errors.name"
            :error-message="errors.name"
            required
          />

          <q-select
            v-model="form.vendor_category_id"
            :options="categories"
            option-value="id"
            option-label="name"
            label="Vendor Category"
            outlined dense
            emit-value map-options
            :error="!!errors.vendor_category_id"
            :error-message="errors.vendor_category_id"
            @update:model-value="loadSubCategories"
          />

          <q-select
            v-model="form.vendor_sub_category_id"
            :options="subCategories"
            option-value="id"
            option-label="name"
            label="Vendor Sub-Category"
            outlined dense
            emit-value map-options
            :error="!!errors.vendor_sub_category_id"
            :error-message="errors.vendor_sub_category_id"
          />

          <q-input
            v-model="form.services_provided"
            label="Services Provided"
            type="textarea"
            outlined dense
            :error="!!errors.services_provided"
            :error-message="errors.services_provided"
          />

          <q-input
            v-model="form.salary"
            label="Salary (Rs.)"
            type="number"
            outlined dense
            :error="!!errors.salary"
            :error-message="errors.salary"
          />

          <q-input
            v-model="form.mobile_number"
            label="Mobile Number"
            outlined dense
            :error="!!errors.mobile_number"
            :error-message="errors.mobile_number"
          />

          <q-input
            v-model="form.email"
            label="Email"
            type="email"
            outlined dense
            :error="!!errors.email"
            :error-message="errors.email"
          />

          <q-input
            v-model="form.address"
            label="Address"
            type="textarea"
            outlined dense
            :error="!!errors.address"
            :error-message="errors.address"
          />

          <q-input
            v-model="form.notes"
            label="Notes"
            type="textarea"
            outlined dense
            :error="!!errors.notes"
            :error-message="errors.notes"
          />

          <q-btn
            type="submit"
            label="Create Vendor"
            color="primary"
            class="q-mt-md"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import axios from 'axios'

const router = useRouter()

const form = ref({
  name: '',
  vendor_category_id: '',
  vendor_sub_category_id: '',
  services_provided: '',
  salary: '',
  mobile_number: '',
  email: '',
  address: '',
  notes: ''
})

const errors = ref({})
const categories = ref([])
const subCategories = ref([])

const loadCategories = async () => {
  try {
    const res = await axios.get('/create-vendor')
    categories.value = res.data.categories
  } catch (err) {
    console.error(err)
    Notify.create({ type: 'negative', message: 'Failed to load categories' })
  }
}

const loadSubCategories = async (categoryId) => {
  try {
    const res = await axios.get(`/get-subCategoryByVendor/${categoryId}`)
    subCategories.value = res.data.subCategories || []
  } catch (err) {
    console.error(err)
    subCategories.value = []
    Notify.create({ type: 'negative', message: 'Error loading sub-categories' })
  }
}

const submitForm = async () => {
  errors.value = {}
  const user = JSON.parse(localStorage.getItem('crm_user') || '{}')
  const userId = user.user_id

  try {
    await axios.post('/store-vendor', {
      ...form.value,
      user_id: userId
    })
    Notify.create({ type: 'positive', message: 'Vendor created successfully' })
    router.push({ name: 'vendor-info' })
  } catch (err) {
    console.error(err)
    if (err.response?.data?.errors) {
      errors.value = err.response.data.errors
    } else {
      Notify.create({ type: 'negative', message: 'Something went wrong' })
    }
  }
}

onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.q-select,
.q-input {
  margin-bottom: 16px;
}
</style>
