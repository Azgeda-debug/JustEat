<template>
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import { useUsersStore } from "./stores/usersStore";

const usersStore = useUsersStore();

onMounted(() => {
  usersStore.firebaseOnAuthStateChanged();
});
</script>
