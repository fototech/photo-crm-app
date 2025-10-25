<template>
  <q-page class="q-pa-md">
    <q-form @submit.prevent="login">
      <q-input v-model="mobile_number" label="Mobile" outlined />
      <q-input v-model="password" label="Password" type="password" outlined class="q-mt-md" />
      <q-btn type="submit" label="Login" color="primary" class="q-mt-md" />
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const mobile_number = ref('')
const password = ref('')
const router = useRouter()

const login = async () => {
  try {
    const res = await axios.post('/login', {
      mobile_number: mobile_number.value,
      password: password.value
    })

     //Save token and user separately
    localStorage.setItem('crm_token', res.data.token)
    localStorage.setItem('crm_user', JSON.stringify(res.data.user))

    //Optionally set default Authorization header for axios
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`

    console.log('Login successful', res.data)

    // Navigate to dashboard page
    router.push('/dashboard')
  } catch (err) {
    console.error('Login failed', err.response?.data || err.message)
  }
}
</script>

