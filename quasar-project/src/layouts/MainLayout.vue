<template>
  <q-layout view="lHh lpr lFf">
    <q-header bordered class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="text-center"> Just Eat </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-footer
      bordered
      class="q-py-xs bg-primary flex justify-evenly text-center text-white"
    >
      <span class="text-h5"
        >Kcal: {{ macronutrients.calories || 0 }} / 2800
      </span>
      <span class="text-h5">P: {{ macronutrients.proteins || 0 }} / 240 </span>
      <span class="text-h5">
        C: {{ macronutrients.carbohydrates || 0 }} / 320
      </span>
      <span class="text-h5"> F: {{ macronutrients.fats || 0 }} / 60</span>
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
