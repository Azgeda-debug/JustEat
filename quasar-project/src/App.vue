<template>
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import { useCurrentDayStore } from "./stores/currentDayStore";
import { useUsersStore } from "./stores/usersStore";

const currentDayStore = useCurrentDayStore();
const usersStore = useUsersStore();

onMounted(() => {
  currentDayStore.firebaseGetProducts();
  usersStore.firebaseOnAuthStateChanged();
});
</script>
