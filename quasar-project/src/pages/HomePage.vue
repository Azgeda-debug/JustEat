<template>
  <q-page class="q-pa-sm overflow-hidden">
    <div class="q-gutter-md">
      <q-btn
        @click="showProductForm = !showProductForm"
        unelevated
        rounded
        :color="showProductForm ? 'red-13' : 'primary'"
        no-caps
        :label="showProductForm ? 'Close' : 'Add a new product'"
      />

      <q-btn
        @click="nextDay"
        unelevated
        rounded
        color="primary"
        no-caps
        label="Next day"
      />
    </div>

    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <NewProductForm v-show="showProductForm" />
    </transition>

    <CurrentProducts :showProductForm="showProductForm" />
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import NewProductForm from "src/components/NewProductForm";
import CurrentProducts from "src/components/CurrentProducts";
import { useCurrentDayStore } from "src/stores/currentDayStore";

const currentDayStore = useCurrentDayStore();

const showProductForm = ref(false);

const nextDay = () => {
  currentDayStore.nextDay();
};
</script>
