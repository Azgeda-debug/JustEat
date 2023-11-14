<template>
  <q-layout view="lHh lpr lFf">
    <q-header
      bordered
      class="q-pa-xs bg-primary row items-center justify-between text-white"
    >
      <q-toolbar>
        <q-btn-dropdown
          flat
          dense
          class="absolute-left text-white"
          label="Options"
        >
          <q-list>
            <q-item
              clickable
              v-close-popup
              @click="showProductForm = !showProductForm"
            >
              <q-item-section>
                <q-item-label>Add a New Product</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="currentDayStore.resetDay()">
              <q-item-section>
                <q-item-label>Reset Day</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-close-popup
              @click="currentDayStore.showHistoryToday = true"
            >
              <q-item-section>
                <q-item-label>Check Current Day</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="checkHistory">
              <q-item-section>
                <q-item-label>Check History</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <q-toolbar-title class="absolute-center gt-xs">
          Just Eat
        </q-toolbar-title>

        <q-input
          @keyup="searchProduct"
          class="header-search"
          bg-color="white"
          dense
          rounded
          outlined
          v-model="searchProductContent"
          label="Search"
          type="text"
        />
      </q-toolbar>
    </q-header>

    <q-footer bordered class="q-py-xs bg-primary text-white text-center row">
      <span class="text-h6 col-6"
        >Kcal: {{ macronutrients.calories || 0 }} / 2800
      </span>
      <span class="text-h6 col-6"
        >P: {{ macronutrients.proteins || 0 }}g / 240g
      </span>
      <span class="text-h6 col-6">
        C: {{ macronutrients.carbohydrates || 0 }}g / 320g
      </span>
      <span class="text-h6 col-6">
        F: {{ macronutrients.fats || 0 }}g / 60g</span
      >
    </q-footer>

    <q-page-container>
      <router-view :showProductForm="showProductForm" />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import { useCurrentDayStore } from "src/stores/currentDayStore";
import { useProductStore } from "src/stores/productStore";

const productStore = useProductStore();
const currentDayStore = useCurrentDayStore();

const macronutrients = ref({});
currentDayStore.$subscribe((mutation, state) => {
  macronutrients.value = currentDayStore.macronutrients;
});

const searchProductContent = ref("");
const searchProduct = () => {
  productStore.searchProductContent = searchProductContent.value;
};

const showProductForm = ref(false);

const checkHistory = () => {
  currentDayStore.showHistoryTotal = true;
  currentDayStore.firebaseCheckHistoryTotal();
};
</script>

<style lang="scss">
.header-search {
  position: absolute;
  right: 0;
  width: 120px;
}
</style>