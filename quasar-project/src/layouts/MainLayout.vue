<template>
  <q-layout view="lHh lpr lFf">
    <q-header bordered class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="text-center"> Just Eat </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-footer
      bordered
      class="q-py-xs bg-primary text-white text-center row"
    >
      <span class="text-h5 col-6"
        >Kcal: {{ macronutrients.calories || 0 }} / 2800
      </span>
      <span class="text-h5 col-6">P: {{ macronutrients.proteins || 0 }}g / 240g </span>
      <span class="text-h5 col-6">
        C: {{ macronutrients.carbohydrates || 0 }}g / 320g
      </span>
      <span class="text-h5 col-6"> F: {{ macronutrients.fats || 0 }}g / 60g</span>
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useCurrentDayStore } from "src/stores/currentDayStore";

const currentDayStore = useCurrentDayStore();

const macronutrients = ref({});
currentDayStore.$subscribe((mutation, state) => {
  macronutrients.value = currentDayStore.macronutrients;
});
</script>
<!-- flex justify-evenly text-center -->