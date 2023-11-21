<template>
  <q-layout view="lHh lpr lFf">
    <q-header
      bordered
      class="q-pa-xs bg-primary row items-center justify-between text-white"
    >
      <q-toolbar>
        <q-btn-dropdown
          v-if="!route.path.includes('/auth')"
          flat
          dense
          class="absolute-left text-white"
          label="Menu"
          transition-show="scale"
          transition-hide="scale"
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

            <q-item
              clickable
              v-close-popup
              @click="
                usersStore.showMacronutrientsForm =
                  !usersStore.showMacronutrientsForm
              "
            >
              <q-item-section>
                <q-item-label>Change macronutrients</q-item-label>
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

            <q-item
              clickable
              v-close-popup
              @click="usersStore.firebaseLogoutUser"
            >
              <q-item-section>
                <q-item-label>Logout</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <q-toolbar-title
          class="absolute-center"
          :class="userDetails.id ? 'gt-xs' : ''"
        >
          {{ pageTitle }}
        </q-toolbar-title>

        <q-input
          v-if="!route.path.includes('/auth')"
          @keyup="searchProduct"
          class="header-search"
          bg-color="white"
          dense
          rounded
          outlined
          v-model="searchProductContent"
          label="Search"
          type="text"
        >
          <template v-slot:append>
            <q-btn
              @click.left="searchProduct"
              flat
              dense
              rounded
              size="12px"
              icon="close"
            />
          </template>
        </q-input>
      </q-toolbar>
    </q-header>

    <q-footer
      v-if="!route.path.includes('/auth')"
      bordered
      class="q-py-xs bg-primary text-white text-center row"
    >
      <span class="text-h6 col-6"
        >Kcal: {{ macronutrients.calories || 0 }} /
        {{ userDetails.macronutrients.calories }}
      </span>
      <span class="text-h6 col-6"
        >P: {{ macronutrients.proteins || 0 }}g /
        {{ userDetails.macronutrients.proteins }} g
      </span>
      <span class="text-h6 col-6">
        C: {{ macronutrients.carbohydrates || 0 }}g /
        {{ userDetails.macronutrients.carbohydrates }} g
      </span>
      <span class="text-h6 col-6">
        F: {{ macronutrients.fats || 0 }}g /
        {{ userDetails.macronutrients.fats }} g</span
      >
    </q-footer>

    <q-page-container>
      <router-view :showProductForm="showProductForm" />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, ref } from "vue";
import { useCurrentDayStore } from "src/stores/currentDayStore";
import { useProductStore } from "src/stores/productStore";
import { useUsersStore } from "src/stores/usersStore";
import { useRoute } from "vue-router";

const route = useRoute();

const productStore = useProductStore();
const currentDayStore = useCurrentDayStore();
const usersStore = useUsersStore();

const macronutrients = ref({});
currentDayStore.$subscribe((mutation, state) => {
  macronutrients.value = currentDayStore.macronutrients;
});

const userDetails = computed(() => {
  return usersStore.userDetails;
});

const pageTitle = computed(() => {
  if (userDetails.value && userDetails.value.id) {
    return userDetails.value.name;
  } else {
    return "JustEat";
  }
});

const searchProductContent = ref("");
const searchProduct = (e) => {
  if (e.type == "click") {
    searchProductContent.value = "";
  }
  productStore.searchProductContent = searchProductContent.value;
};

const showProductForm = ref(false);

const checkHistory = () => {
  currentDayStore.showHistoryTotal = true;
  currentDayStore.firebaseCheckHistoryTotal();
};

const changeMacronutrients = () => {};
</script>

<style lang="scss">
.header-search {
  position: absolute;
  right: 0;
  width: 120px;
}
</style>