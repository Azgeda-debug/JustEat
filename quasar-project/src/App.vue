<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import { useCurrentDayStore } from './stores/currentDayStore';

const currentDayStore = useCurrentDayStore()

onMounted(() => {
  currentDayStore.firebaseGetProducts()
})
</script>
