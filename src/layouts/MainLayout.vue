<template>
  <q-layout view="lHh Lpr lFf">
    <!-- HEADER -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          flat dense round icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          class="q-mr-sm"
        />
        <q-toolbar-title>
          <q-icon name="photo_camera" class="q-mr-sm" />
          PhotoParivar CRM
        </q-toolbar-title>
        <div class="text-caption text-weight-bold">v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <!-- DRAWER -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-grey-1 text-dark"
    >
      <q-list padding>

        <q-item-label class="text-h6 q-mb-sm text-primary">📁</q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <!-- MAIN CONTENT -->
    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const linksList = [
  {
    title: 'CRM Dashboard',
    caption: 'dashboard',
    icon: 'dashboard',
    iconColor: 'blue-7',
    to: '/dashboard'
  },
  {
    title: 'My Contact',
    caption: 'contacts',
    icon: 'contacts',
    iconColor: 'purple-6',
    to: '/contact-details'
  },
  {
    title: 'My Lead',
    caption: 'leads',
    icon: 'supervisor_account',
    iconColor: 'deep-orange-6',
    to: '/lead-details'
  },
  {
    title: 'My Event',
    caption: 'events',
    icon: 'calendar_today',
    iconColor: 'green-6',
    to: '/assignments'
  },
  {
    title: 'My Team',
    caption: 'teams',
    icon: 'people_alt',
    iconColor: 'pink-5',
    to: '/team-info'
  },
  {
    title: 'My Vendor',
    caption: 'vendors',
    icon: 'business',
    iconColor: 'indigo-6',
    to: '/vendor-info'
  }
]
</script>

<style scoped>
.q-drawer {
  min-width: 230px;
}

.q-item:hover {
  background-color: #e0f7fa !important;
  color: #006064 !important;
}

.q-item__section--avatar .q-icon {
  transition: transform 0.3s ease;
}

.q-item__section--avatar .q-icon:hover {
  transform: scale(1.2);
}
</style>
