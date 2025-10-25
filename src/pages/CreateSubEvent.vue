<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="text-h6 q-mb-md">➕ Create Sub Event</div>

    <q-form @submit.prevent="submitForm">
      <q-card flat class="q-pa-md bg-white">
        <!-- Event Fields -->
        <div class="row q-col-gutter-md">
          <q-input filled v-model="form.sub_event_name" label="Sub Event Name" dense class="col-12" required />
          <q-input filled v-model="form.description" label="Description" type="textarea" rows="2" dense class="col-12" />
          <q-input filled v-model="form.event_date" label="Event Date" type="date" dense class="col-md-6 col-12" required />
          <q-input filled v-model="form.start_time" label="Start Time" type="time" dense class="col-md-6 col-12" />
          <q-input filled v-model="form.end_time" label="End Time" type="time" dense class="col-md-6 col-12" />
          <q-input filled v-model="form.sub_event_venue_name" label="Venue Name" dense class="col-md-6 col-12" />
          <q-input filled v-model="form.sub_event_venue_address" label="Venue Address" type="textarea" rows="2" dense class="col-12" />
          <q-input filled v-model="form.contact_person_name" label="Contact Person Name" dense class="col-md-6 col-12" />
          <q-input filled v-model="form.contact_person_mobile" label="Contact Person Mobile No" dense class="col-md-6 col-12" />
          <q-input filled v-model="form.google_map_link" label="Google Map Link" type="url" dense class="col-12" />
        </div>

        <!-- Team Section -->
        <div class="q-mt-lg">
          <div class="text-subtitle1">Assign Team Members</div>
          <div v-for="(row, i) in teamAssignments" :key="i" class="row q-col-gutter-md q-mb-sm items-center">
            <q-select filled v-model="row.team_id" :options="teams" option-label="team_name" option-value="id" emit-value
                map-options label="Team" dense class="col-md-2 col-12" @update:model-value="() => loadTeamRelatedData(row)" />
            <q-select filled v-model="row.sub_category_id" :options="row.subCategories" option-label="name" option-value="id" label="Sub Category" dense class="col-md-2 col-12" />
            <q-select filled v-model="row.member_id" :options="row.members" option-label="name" option-value="id" label="Team Member" dense class="col-md-2 col-12" />
            <q-input filled v-model="row.team_note" label="Note" dense class="col-md-4 col-12" />
            <q-btn icon="delete" color="negative" flat dense @click="removeTeam(i)" class="col-md-2 col-12" />
          </div>
          <q-btn label="+ Add Team Member" color="primary" size="sm" @click="addTeam" />
        </div>

        <!-- Vendor Section -->
        <div class="q-mt-lg">
          <div class="text-subtitle1">Assign Vendors</div>
          <div v-for="(row, i) in vendorAssignments" :key="i" class="row q-col-gutter-md q-mb-sm items-center">
            <q-select filled v-model="row.vendor_id" :options="vendors" option-label="name" emit-value
                map-options option-value="id" label="Vendor" dense class="col-md-2 col-12" @update:model-value="() => loadVendorRelatedData(row)" />
            <q-select filled v-model="row.vendor_sub_category_id" :options="row.subCategories" option-label="name" option-value="id" label="Sub Category" dense class="col-md-2 col-12" />
            <q-select filled v-model="row.vendor_member_id" :options="row.members" option-label="name" option-value="id" label="Vendor Member" dense class="col-md-2 col-12" />
            <q-input filled v-model="row.vendor_note" label="Note" dense class="col-md-4 col-12" />
            <q-btn icon="delete" color="negative" flat dense @click="removeVendor(i)" class="col-md-2 col-12" />
          </div>
          <q-btn label="+ Add Vendor" color="secondary" size="sm" @click="addVendor" />
        </div>

        <!-- Submit -->
        <div class="q-mt-lg text-center">
          <q-btn label="Submit" color="primary" type="submit" />
        </div>
      </q-card>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import axios from 'axios'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const eventId = route.params.id

const form = ref({
  event_id: eventId,
  sub_event_name: '',
  description: '',
  event_date: '',
  start_time: '',
  end_time: '',
  sub_event_venue_name: '',
  sub_event_venue_address: '',
  contact_person_name: '',
  contact_person_mobile: '',
  google_map_link: ''
})

const teams = ref([])
const vendors = ref([])

const teamAssignments = ref([
  { team_id: '', sub_category_id: '', member_id: '', team_note: '', subCategories: [], members: [] }
])


const vendorAssignments = ref([
  { vendor_id: '', vendor_sub_category_id: '', vendor_member_id: '', vendor_note: '', subCategories: [], members: [] }
])

const addTeam = () => {
  teamAssignments.value.push({ team_id: '', sub_category_id: '', member_id: '', team_note: '', subCategories: [], members: [] })
}
const removeTeam = i => teamAssignments.value.splice(i, 1)

const addVendor = () => {
  vendorAssignments.value.push({ vendor_id: '', vendor_sub_category_id: '', vendor_member_id: '', vendor_note: '', subCategories: [], members: [] })
}
const removeVendor = i => vendorAssignments.value.splice(i, 1)

const loadTeamRelatedData = async (row) => {
console.log('row.team_id', row.team_id);
  if (!row.team_id) return;
  try {
    const [subs, members] = await Promise.all([
      axios.get(`/get-teamSubCategories/${row.team_id}`),
      axios.get(`/get-teamMemberByCategories/${row.team_id}`)
    ])
    row.subCategories = subs.data
    row.members = members.data
    row.sub_category_id = ''
    row.member_id = ''
  } catch (err) {
    console.error('Team subcategory/member fetch failed:', err)
  }
}

const loadVendorRelatedData = async (row) => {
  if (!row.vendor_id) return;
  try {
    const [subs, members] = await Promise.all([
      axios.get(`/get-vendorSubCategories/${row.vendor_id}`),
      axios.get(`/get-vendorMemberByCategories/${row.vendor_id}`)
    ])
    row.subCategories = subs.data
    row.members = members.data
    row.vendor_sub_category_id = ''
    row.vendor_member_id = ''
  } catch (err) {
    console.error('Vendor subcategory/member fetch failed:', err)
  }
}

const fetchCategories = async () => {
  try {
    const [teamRes, vendorRes] = await Promise.all([
      axios.get('/team-categories'),
      axios.get('/vendor-categories')
    ])
    teams.value = teamRes.data
    vendors.value = vendorRes.data
  } catch (err) {
    console.error('Initial categories load failed:', err)
  }
}

const submitForm = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('crm_user') || '{}')
    const user_id = user.user_id

    if (!user_id) {
      $q.notify({ type: 'negative', message: 'User not found. Please login again.' })
      return
    }

    const payload = {
      ...form.value,
      user_id,
      event_id: eventId,
      team_ids: teamAssignments.value.map(t => t.team_id?.id || t.team_id),
      team_sub_category_ids: teamAssignments.value.map(t => t.sub_category_id?.id || t.sub_category_id),
      member_ids: teamAssignments.value.map(t => t.member_id?.id || t.member_id),
      team_notes: teamAssignments.value.map(t => t.team_note),
      vendor_ids: vendorAssignments.value.map(v => v.vendor_id?.id || v.vendor_id),
      vendor_sub_category_ids: vendorAssignments.value.map(v => v.vendor_sub_category_id?.id || v.vendor_sub_category_id),
      vendor_member_ids: vendorAssignments.value.map(v => v.vendor_member_id?.id || v.vendor_member_id),
      vendor_notes: vendorAssignments.value.map(v => v.vendor_note)
    }

    console.log('🔍 Sending payload:', payload)

    const res = await axios.post('/add-sub-event', payload)

    console.log('API response:', res.data)

    if (res.data?.success) {
      $q.notify({ type: 'positive', message: res.data.message || 'Sub event created successfully!' })
      router.push(`/listingSubEvent/${res.data.event_id}`)  // ← NOTE THE `/` at beginning
    } else {
      $q.notify({ type: 'warning', message: res.data.message || 'Something went wrong.' })
    }
  } catch (err) {
    console.error('❌ Error during submitForm:', err)
    console.error('❌ Error response:', err?.response?.data)
    $q.notify({ type: 'negative', message: 'Failed to create sub event.' })
  }
}



onMounted(fetchCategories)
</script>

<style scoped>
.q-page {
  max-width: 1000px;
  margin: 0 auto;
}
</style>
