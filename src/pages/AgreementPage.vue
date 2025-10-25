<template>
  <q-page class="q-pa-md bg-grey-2">
    <q-card v-if="loaded">

      <!-- Header Section -->
      <div class="row q-pa-md q-col-gutter-md items-center">
        <!-- Logo -->
        <div class="col-12 col-md-4">
          <img :src="`/icons/photoparivar_logo.png`" alt="Company Logo" style="max-width: 100%; border-radius: 8px;" />
        </div>

        <!-- Company Info -->
        <div class="col-12 col-md-4">
          <div class="text-h5 text-bold">
            {{ company.company_name }}
            <img src="/icons/verified.png" style="width: 20px; vertical-align: middle;" />
          </div>
          <div class="text-body2 text-grey-9 q-mt-xs">Address: {{ company.company_address }}</div>
          <div class="q-mt-sm">
            <div class="q-mb-xs"><img src="/icons/phone.png" width="16" class="q-mr-xs" />{{ company.company_mobile }}</div>
            <div class="q-mb-xs"><img src="/icons/email.png" width="16" class="q-mr-xs" />{{ company.company_email_id }}</div>
            <div class="q-mb-xs"><img src="/icons/web.png" width="16" class="q-mr-xs" />{{ company.company_website }}</div>
            <div class="q-mb-xs"><img src="/icons/tax.png" width="16" class="q-mr-xs" />GSTN no: {{ company.company_tax }}</div>
          </div>
          <div class="q-mt-md">
            <img src="/icons/facebook.png" width="20" class="q-mx-xs" />
            <img src="/icons/whatsapp.png" width="20" class="q-mx-xs" />
            <img src="/icons/youtube.png" width="20" class="q-mx-xs" />
            <img src="/icons/instagram.png" width="20" class="q-mx-xs" />
          </div>
        </div>

        <!-- Buttons -->
        <div class="col-12 col-md-4">
          <q-btn color="red" label="Send enquiry" class="full-width q-mb-sm" />
          <q-btn color="primary" label="Call now" class="full-width q-mb-sm" :href="`tel:${company.company_mobile}`" />
          <q-btn color="green" label="WhatsApp" class="full-width" :href="`https://wa.me/${company.company_whatsapp}`" target="_blank" />
        </div>
      </div>

      <q-separator spaced color="grey" />

      <!-- Message -->
      <q-card class="q-mt-md q-pa-md bg-grey-1 text-center">
        <div class="text-h6">Dear Sir/Madam,</div>
        <div class="q-mt-sm text-subtitle2">
          <strong>This formal agreement outlines our company’s core values and service policies.</strong>
        </div>
        <div class="q-mt-sm">
          Thank you for trusting us with your special event. We’re excited to work with you and create lasting, beautiful memories together!
          Below is the list of promised photography services. Please read carefully, and if any correction is needed, please let us know. Tick ✓ to confirm and submit.
        </div>
      </q-card>

      <!-- Event Details -->
      <q-card flat class="q-mt-md bg-white q-pa-md">
        <div class="text-h6 text-center q-mb-md" style="font-family: 'Segoe UI', sans-serif;">Event Details</div>
        <div class="row q-col-gutter-md">
          <div class="col-md-4"><q-input v-model="event.event_name" label="Event Name" readonly outlined /></div>
          <div class="col-md-4"><q-input v-model="event.client_name" label="Client Name" readonly outlined /></div>
          <div class="col-md-4"><q-input v-model="event.client_mobile" label="Client Mobile" readonly outlined /></div>
          <div class="col-md-4"><q-input v-model="event.main_shoot_date" label="Shoot Date" readonly outlined /></div>
          <div class="col-md-4"><q-input v-model="agreementAmount" label="Agreement Amount" readonly outlined /></div>
        </div>
      </q-card>

      <!-- Sub Events -->
      <q-card flat class="q-mt-md bg-grey-1 q-pa-md">
        <div class="text-h6 text-center">Sub / Parallel Events</div>
        <div class="row q-col-gutter-md q-mt-sm">
          <div v-for="(sub, i) in subEvents" :key="i" class="col-12 row q-col-gutter-md q-mb-sm">
            <div class="col-md-6">
              <q-input :model-value="sub.sub_event_name" label="Sub Event Name" outlined readonly />
            </div>
            <div class="col-md-6">
              <q-input :model-value="sub.event_date" label="Event Date" outlined readonly />
            </div>
          </div>
        </div>
      </q-card>

      <!-- Deliverables -->
      <q-card flat class="q-mt-md bg-white q-pa-md">
        <div class="text-h6 text-center" style="font-family: 'Segoe UI' ">Your Memories Delivered</div>
        <div class="q-mt-sm">
          <div v-for="(d, i) in deliverables" :key="i" class="q-pa-md q-mb-sm bg-grey-2 rounded-borders">
            <div class="text-subtitle2 q-mb-md text-bold">Deliverable : {{ i + 1 }}</div>
            <div class="row q-col-gutter-md">
              <div class="col-md-4">
                <q-input :model-value="d.work_type_name" label="Deliverable" outlined readonly />
              </div>
              <div class="col-md-2">
                <q-input :model-value="d.cost_type" label="Cost Type" outlined readonly />
              </div>
              <div class="col-md-2">
                <q-input :model-value="d.cost ?? 'N/A'" label="Cost" outlined readonly />
              </div>
              <div class="col-md-2">
                <q-input :model-value="d.quantity" label="Quantity" outlined readonly />
              </div>
              <div class="col-md-2">
                <q-input :model-value="d.note" label="Note" outlined readonly />
              </div>
            </div>
          </div>
        </div>
      </q-card>

      <q-card flat class="q-mt-md bg-grey-1 q-pa-md">
        <div class="text-h6 text-center text-bold q-mb-md" style="font-family: 'Segoe UI' ">Payment Summary</div>
        <div class="row q-col-gutter-md">
          <div class="col-md-4">
            <q-input :model-value="currencyFormat(agreementAmount)" label="Agreement Amount:" readonly outlined />
          </div>
          <div class="col-md-4">
            <q-input :model-value="currencyFormat(receivedAmount)" label="Received Amount:" readonly outlined />
          </div>
          <div class="col-md-4">
            <q-input :model-value="currencyFormat(balanceAmount)" label="Balance Amount:" readonly outlined />
          </div>
        </div>
      </q-card>

      <!-- Terms & Conditions -->
      <q-card flat class="q-mt-md bg-grey-1 q-pa-md">
        <div class="text-h6 text-bold text-center q-mb-md" style="font-family: 'Segoe UI' ">
            Wedding / Event Photography – Terms & Conditions
        </div>

        <div class="text-body2 q-gutter-y-sm" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 12px; line-height: 1.5; color: #333;">
            <p>
            <b>Booking Confirmation:</b> A minimum of <b>25%</b> advance is required to confirm the booking.
            <b>50%</b> must be paid before the shoot, and the remaining <b>25%</b> after the shoot.
            </p>

            <p>
            <b>Travel & Stay:</b> For outstation events, travel and accommodation must be arranged or reimbursed by the client.
            </p>

            <p>
            <b>Cancellation Policy:</b> Cancellations made less than <b>30 days</b> before the event are non-refundable.
            </p>

            <p>
            <b>Timings:</b> Standard shoot duration is up to <b>6 hours</b> per event. Additional charges will apply for extended coverage.
            </p>

            <p>
            <b>Permissions:</b> All required permissions for locations, drones, etc., are the client’s responsibility.
            </p>

            <p>
            <b>Data Security:</b> In rare cases of technical failure or data loss, our liability is limited to a re-shoot or a refund of the respective event charges.
            </p>

            <p>
            <b>Guest & Group Photo Coordination:</b> We request that <b>one person</b> from your side be assigned to coordinate with our team to help identify and organize important group photos of your guests and close family/friends.
            </p>

            <p class="text-italic">
            <b>Note:</b> Many guests prefer taking selfies. Our team will take guest photos only if they are interested. We won’t insist or interrupt anyone. Photos will be taken only with our cameras and only for you.
            </p>

            <p>
            <b>Albums & Deliverables:</b> Delivery timelines for albums and other deliverables are as per mutual agreement. Post-production timelines depend on the selected package and designer availability.
            </p>

            <p>
            <b>Third-Party Services:</b> We are not responsible for any issues related to third-party services such as web live streaming or LED walls arranged by other vendors.
            </p>

            <p>
            <b>Privacy Policy:</b> Private and dining moments are captured with discretion to respect the comfort of guests.
            </p>

            <p>
            <b>Jurisdiction & Dispute Resolution:</b> In case of any legal dispute, jurisdiction will be limited to our city only. We recommend resolving any issues amicably with the State/local photography association before initiating legal action.
            </p>
        </div>
    </q-card>


      <!-- Agreement Form -->
      <q-card-section class="text-center">
        <q-form @submit.prevent="submitAgreement">
          <div class="row q-col-gutter-md">
            <div class="col-md-6">  
              <q-input v-model="form.client_name" label="Client Name" outlined class="q-mb-sm" />
            </div>
            <div class="col-md-6">
              <q-input v-model="form.client_mobile" label="Mobile Number" outlined class="q-mb-sm" />
            </div>
          </div>

          <div class="row justify-center q-mt-md">
            <q-checkbox 
              v-model="form.agreed" 
              label="We happily agree to proceed with your team to beautifully capture our event and preserve our memories." 
              class="text-green text-bold"
              :disable="isAgreedAlready"
            />
          </div>

          <div class="row justify-center q-mt-md">
            <q-btn 
              v-if="!isAgreedAlready"
              label="Submit Agreement" 
              color="green" 
              type="submit"
              :disable="!form.agreed || submitting" 
              :loading="submitting"
            />
            <q-btn 
              v-else 
              label="You have already submitted the agreement" 
              color="grey-7" 
              flat 
              disable
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <q-inner-loading :showing="!loaded" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { Notify } from 'quasar'

const route = useRoute()
const eventId = route.params.event_id

const loaded = ref(false)
const submitting = ref(false)
const event = ref({})
const company = ref({})
const subEvents = ref([])
const deliverables = ref([])
const agreementAmount = ref(0)
const receivedAmount = ref(0)
const balanceAmount = ref(0)
const isAgreedAlready = ref(false)

const form = ref({
  client_name: '',
  client_mobile: '',
  agreed: false
})

onMounted(async () => {
  try {
    const res = await axios.get(`/photo-crm-agreement/${eventId}`)
    const data = res.data
    event.value = data.event
    company.value = data.company
    subEvents.value = data.sub_events
    deliverables.value = data.deliverables
    agreementAmount.value = data.agreement_amount
    isAgreedAlready.value = data.agreement_exists ?? false

    form.value.client_name = data.event.client_name
    form.value.client_mobile = data.event.client_mobile
    receivedAmount.value = data.received_amount
    balanceAmount.value = data.balance_amount
    form.value.agreed = isAgreedAlready.value
    loaded.value = true
  } catch (err) {
    console.error(err)
    Notify.create({ type: 'negative', message: 'Error loading agreement data.' })
  }
})

const currencyFormat = (val) => {
  if (!val && val !== 0) return '₹0';
  return '₹' + Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 });
}


const submitAgreement = async () => {
  submitting.value = true
  try {
    await axios.post('/photo-crm-agreement-pass', {
      event_id: event.value.id,
      client_name: form.value.client_name,
      client_mobile: form.value.client_mobile
    })

    isAgreedAlready.value = true
    form.value.agreed = true

    Notify.create({ type: 'positive', message: 'Agreement submitted successfully!' })
  } catch (err) {
    console.error(err)
    Notify.create({ type: 'negative', message: 'Error submitting agreement.' })
  } finally {
    submitting.value = false
  }
}

</script>

<style scoped>
ul {
  list-style-type: disc;
}
</style>
