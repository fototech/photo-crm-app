<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section class="text-h6">Edit Vendor</q-card-section>

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
          />

          <q-select
            v-if="subCategories.length"
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
            label="Salary"
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

          <q-btn type="submit" label="Update Vendor" color="primary" class="q-mt-md" />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Notify } from 'quasar'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const vendorId = route.params.id

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

const loadVendor = async () => {
  try {
    const res = await axios.get(`/edit-vendor/${vendorId}`)
    const data = res.data.vendor

    form.value = {
      name: data.name || '',
      vendor_category_id: data.vendor_category_id || '',
      vendor_sub_category_id: data.vendor_sub_category_id || '',
      services_provided: data.services_provided || '',
      salary: data.salary || '',
      mobile_number: data.mobile_number || '',
      email: data.email || '',
      address: data.address || '',
      notes: data.notes || ''
    }

    categories.value = res.data.categories

    if (form.value.vendor_category_id) {
      await loadSubCategories(form.value.vendor_category_id)

      // Validate the existing sub-category
      const ids = subCategories.value.map(s => s.id)
      if (!ids.includes(form.value.vendor_sub_category_id)) {
        form.value.vendor_sub_category_id = null
      }
    }
  } catch (err) {
    console.error(err)
    Notify.create({ type: 'negative', message: 'Failed to load vendor' })
  }
}

const loadSubCategories = async (categoryId) => {
  try {
    const res = await axios.get(`/get-subCategoryByVendor/${categoryId}`)
    subCategories.value = res.data.subCategories || []

    // Reset if current selected ID doesn't exist anymore
    const ids = subCategories.value.map(s => s.id)
    if (!ids.includes(form.value.vendor_sub_category_id)) {
      form.value.vendor_sub_category_id = null
    }
  } catch (err) {
    console.error(err)
    subCategories.value = []
    Notify.create({ type: 'negative', message: 'Failed to load sub-categories' })
  }
}

const submitForm = async () => {
  errors.value = {}
  const user = JSON.parse(localStorage.getItem('crm_user') || '{}')
  const userId = user.user_id

  try {
    await axios.put(`/update-vendor/${vendorId}`, {
      ...form.value,
      user_id: userId
    })

    Notify.create({ type: 'positive', message: 'Vendor updated successfully' })
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
  loadVendor()
})

watch(() => form.value.vendor_category_id, async (newId) => {
  if (newId) {
    await loadSubCategories(newId)
  } else {
    subCategories.value = []
    form.value.vendor_sub_category_id = null
  }
})
</script>

<style scoped>
.q-select,
.q-input {
  margin-bottom: 16px;
}
</style>
