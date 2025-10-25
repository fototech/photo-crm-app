<template>
  <q-item
    :to="to"
    clickable
    v-ripple
    :exact="!external"
    class="q-my-xs"
  >
    <q-item-section avatar>
      <q-icon :name="icon" :color="iconColor || 'primary'" />
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-weight-medium">{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
defineProps({
  title: String,
  caption: String,
  icon: String,
  to: String,
  external: Boolean,
  iconColor: String
})
</script>
