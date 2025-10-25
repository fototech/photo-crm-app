<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="text-h6 q-mb-md">📋 Team & Vendor Info – {{ eventDetails?.event_name }}</div>

    <q-banner v-if="message" :class="bannerClass" class="q-mb-md">
      {{ message }}
    </q-banner>

    <div v-if="!subEventAssignments.length" class="text-subtitle2 text-grey-7">
      No sub-events or team/vendor assignments found for this event.
    </div>

    <div v-else>
      <q-card
        v-for="(subEvent, index) in subEventAssignments"
        :key="subEvent.sub_event_id"
        class="q-mb-lg"
        bordered
      >
        <q-card-section class="bg-light">
          <div class="text-subtitle1">
            Sub Event {{ index + 1 }}: {{ subEvent.sub_event_name }}
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <!-- Team Members -->
          <div class="text-primary text-subtitle2 q-mb-sm">Team Members</div>
          <div v-if="subEvent.team_members.length">
            <q-markup-table dense flat bordered>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Category</th>
                  <th>Sub Category</th>
                  <th>Data Received</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(member, i) in subEvent.team_members"
                  :key="member.assignment_id"
                >
                  <td>{{ i + 1 }}</td>
                  <td>{{ member.member_name }}</td>
                  <td>{{ member.member_mobile }}</td>
                  <td>{{ member.team_category || '-' }}</td>
                  <td>{{ member.team_sub_category || '-' }}</td>
                  <td>
                    <q-btn
                      :label="(member.team_data_received || 'no').toUpperCase()"
                      :color="member.team_data_received === 'yes' ? 'green' : 'grey-6'"
                      size="sm"
                      @click="toggleStatus(member.assignment_id, 'team', 'team_data_received', 'yes')"
                      :disable="member.team_data_received === 'yes'"
                    />
                  </td>
                  <td>
                    <q-btn
                      :label="(member.team_payment_done || 'no').toUpperCase()"
                      :color="member.team_payment_done === 'yes' ? 'green' : 'grey-6'"
                      size="sm"
                      @click="toggleStatus(member.assignment_id, 'team', 'team_payment_done', 'yes')"
                      :disable="member.team_payment_done === 'yes'"
                    />
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
          <div v-else class="text-caption text-grey">No team members assigned.</div>

          <!-- Vendor Members -->
          <div class="text-success text-subtitle2 q-mt-md q-mb-sm">Vendors</div>
          <div v-if="subEvent.vendor_members.length">
            <q-markup-table dense flat bordered>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Category</th>
                  <th>Sub Category</th>
                  <th>Data Received</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(vendor, j) in subEvent.vendor_members"
                  :key="vendor.assignment_id"
                >
                  <td>{{ j + 1 }}</td>
                  <td>{{ vendor.vendor_name }}</td>
                  <td>{{ vendor.vendor_mobile }}</td>
                  <td>{{ vendor.vendor_category || '-' }}</td>
                  <td>{{ vendor.vendor_sub_category || '-' }}</td>
                  <td>
                    <q-btn
                      :label="(vendor.vendor_data_received || 'no').toUpperCase()"
                      :color="vendor.vendor_data_received === 'yes' ? 'green' : 'grey-6'"
                      size="sm"
                      @click="toggleStatus(vendor.assignment_id, 'vendor', 'vendor_data_received', 'yes')"
                      :disable="vendor.vendor_data_received === 'yes'"
                    />
                  </td>
                  <td>
                    <q-btn
                      :label="(vendor.vendor_payment_done || 'no').toUpperCase()"
                      :color="vendor.vendor_payment_done === 'yes' ? 'green' : 'grey-6'"
                      size="sm"
                      @click="toggleStatus(vendor.assignment_id, 'vendor', 'vendor_payment_done', 'yes')"
                      :disable="vendor.vendor_payment_done === 'yes'"
                    />
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </div>
          <div v-else class="text-caption text-grey">No vendors assigned for this sub-event.</div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { axios } from 'boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const route = useRoute()
const eventId = route.params.event_id

const eventDetails = ref({})
const subEventAssignments = ref([])
const message = ref('')
const bannerClass = ref('bg-green-2 text-green-9')

const fetchData = async () => {
  try {
    const res = await axios.get(`/event-sub_event-data-info/${eventId}`)
    eventDetails.value = res.data.event
    subEventAssignments.value = res.data.sub_event_assignments
  } catch (err) {
    message.value = 'Failed to load event information.'
    bannerClass.value = 'bg-red-2 text-red-9'
    console.error(err)
  }
}

const toggleStatus = async (assignmentId, type, field, value) => {
  // Instant local UI update
  for (const subEvent of subEventAssignments.value) {
    const list = type === 'team' ? subEvent.team_members : subEvent.vendor_members
    const member = list.find(m => m.assignment_id === assignmentId)
    if (member) {
      member[field] = value
    }
  }

  try {
    const res = await axios.post('/update-toggle-status', {
      id: assignmentId,
      type,
      field,
      value,
    })

    if (res.data.success) {
      $q.notify({
        type: 'positive',
        message: `${field.replace(/_/g, ' ')} updated successfully.`,
      })
    } else {
      $q.notify({ type: 'negative', message: 'Toggle update failed!' })
    }
  } catch (err) {
    $q.notify({ type: 'negative', message: 'Server error!' })
    console.error(err)
  }
}

onMounted(fetchData)
</script>

<style scoped>
.q-page {
  max-width: 1000px;
  margin: auto;
}
</style>
