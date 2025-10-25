<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section class="text-h6">Edit Team Member</q-card-section>

      <q-card-section>
        <q-form @submit.prevent="submitForm">
          <q-input v-model="form.name" label="Name" outlined dense :error="!!errors.name" :error-message="errors.name" required />
          <q-input v-model="form.salary" label="Salary" type="number" outlined dense :error="!!errors.salary" :error-message="errors.salary" />
          <q-input v-model="form.mobile_number" label="Mobile Number" outlined dense :error="!!errors.mobile_number" :error-message="errors.mobile_number" required />
          <q-input v-model="form.role" label="Role" outlined dense :error="!!errors.role" :error-message="errors.role" required />

          <q-select
            v-model="form.status"
            :options="['active', 'inactive']"
            label="Status"
            outlined dense emit-value map-options
            :error="!!errors.status"
            :error-message="errors.status"
          />

          <q-select
            v-model="form.team_id"
            :options="teams"
            option-value="id"
            option-label="team_name"
            label="Team"
            outlined dense emit-value map-options
            :error="!!errors.team_id"
            :error-message="errors.team_id"
          />

          <q-select
            v-if="subCategories.length"
            v-model="form.team_sub_category_id"
            :options="subCategories"
            option-value="id"
            option-label="name"
            label="Team Sub Category"
            outlined dense emit-value map-options
            :error="!!errors.team_sub_category_id"
            :error-message="errors.team_sub_category_id"
          />

          <q-btn type="submit" label="Update Team Member" color="primary" class="q-mt-md" />
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
const memberId = route.params.id

const form = ref({
  name: '',
  salary: '',
  mobile_number: '',
  role: '',
  status: 'active',
  team_id: '',
  team_sub_category_id: ''
})

const errors = ref({})
const teams = ref([])
const subCategories = ref([])

const loadMember = async () => {
  try {
    const res = await axios.get(`/edit-team/${memberId}`)
    const data = res.data.member

    form.value = {
      name: data.name || '',
      salary: data.salary || '',
      mobile_number: data.mobile_number || '',
      role: data.role || '',
      status: data.status || 'active',
      team_id: data.team_category_id || '',
      team_sub_category_id: data.team_sub_category_id || ''
    }

    teams.value = res.data.teams

    if (form.value.team_id) {
      await loadSubCategories(form.value.team_id)

      // Validate the existing subcategory ID
      const ids = subCategories.value.map(item => item.id)
      if (!ids.includes(form.value.team_sub_category_id)) {
        form.value.team_sub_category_id = null
      }
    }
  } catch (err) {
    console.error(err)
    Notify.create({ type: 'negative', message: 'Failed to load team member' })
  }
}

const loadSubCategories = async (teamId) => {
  try {
    const res = await axios.get(`/get-subCategoryByTeam/${teamId}`)
    subCategories.value = res.data.subCategories || []

    // Reset team_sub_category_id if it's not found
    const ids = subCategories.value.map(item => item.id)
    if (!ids.includes(form.value.team_sub_category_id)) {
      form.value.team_sub_category_id = null
    }
  } catch (err) {
    console.error(err)
    subCategories.value = []
    Notify.create({ type: 'negative', message: 'Error loading subcategories' })
  }
}

const submitForm = async () => {
  errors.value = {}

  const user = JSON.parse(localStorage.getItem('crm_user') || '{}')
  const userId = user.user_id

  try {
    await axios.put(`/update-team/${memberId}`, {
      ...form.value,
      user_id: userId
    })

    Notify.create({ type: 'positive', message: 'Team member updated successfully' })
    router.push({ name: 'team-info' })
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
  loadMember()
})

// Watch for changes in team_id to reload subcategories
watch(() => form.value.team_id, async (newTeamId) => {
  if (newTeamId) {
    await loadSubCategories(newTeamId)
  } else {
    subCategories.value = []
    form.value.team_sub_category_id = null
  }
})
</script>

<style scoped>
.q-select,
.q-input {
  margin-bottom: 16px;
}
</style>
