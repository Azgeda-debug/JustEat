<template>
  <q-layout view="lHh lpr lFf">
    <q-header
      bordered
      class="q-pa-xs bg-primary row items-center justify-between text-white"
    >
      <q-toolbar>
        <q-btn-dropdown
          v-if="route.name == 'HomePage'"
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
              @click="
                productStore.showProductForm = !productStore.showProductForm
              "
            >
              <q-item-section>
                <q-item-label>Add a New Product</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-close-popup
              @click="
                productStore.showProductDatabaseForm =
                  !productStore.showProductDatabaseForm
              "
            >
              <q-item-section>
                <q-item-label
                  >Add a New Product Using the Product Database</q-item-label
                >
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-close-popup
              @click="
                usersStore.showChangeMacronutrientsForm =
                  !usersStore.showChangeMacronutrientsForm
              "
            >
              <q-item-section>
                <q-item-label>Change Macronutrients</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              clickable
              v-close-popup
              @click="
                currentDayStore.showAddMacronutrientsForm =
                  !currentDayStore.showAddMacronutrientsForm
              "
            >
              <q-item-section>
                <q-item-label>Add Macronutrients</q-item-label>
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

            <q-item clickable v-close-popup @click="currentDayStore.resetDay()">
              <q-item-section>
                <q-item-label>Reset Day</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="router.push('/about')">
              <q-item-section>
                <q-item-label>App Information</q-item-label>
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

        <q-btn
          v-if="route.name == 'AboutPage'"
          @click="router.go(-1)"
          icon="arrow_back"
          flat
          rounded
        />

        <q-toolbar-title class="absolute-center">
          <span
            v-show="route.name != 'AboutPage'"
            :class="userDetails.id ? 'gt-xs' : ''"
          >
            {{ pageTitle }}</span
          >
          <span v-show="route.name == 'AboutPage'">JustEat</span>
        </q-toolbar-title>

        <q-input
          v-if="route.name == 'HomePage'"
          @keyup="searchProduct"
          class="header-search"
          bg-color="white"
          dense
          rounded
          outlined
          v-model="searchProductContent"
          label="Search"
          type="text"
          ref="inputSearch"
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
      v-if="
        route.name == 'HomePage' &&
        macronutrients &&
        userDetails &&
        userDetails.macronutrients
      "
      bordered
      class="q-pa-xs bg-primary text-white text-center row"
    >
      <span class="text-body1 text-bold col-6"
        >Kcal: {{ macronutrients.calories || 0 }} /
        {{ userDetails.macronutrients.calories }}
      </span>
      <span class="text-body1 text-bold col-6"
        >P: {{ macronutrients.proteins || 0 }}g /
        {{ userDetails.macronutrients.proteins }} g
      </span>
      <span class="text-body1 text-bold col-6">
        C: {{ macronutrients.carbohydrates || 0 }}g /
        {{ userDetails.macronutrients.carbohydrates }} g
      </span>
      <span class="text-body1 text-bold col-6">
        F: {{ macronutrients.fats || 0 }}g /
        {{ userDetails.macronutrients.fats }} g</span
      >
    </q-footer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useCurrentDayStore } from "src/stores/currentDayStore";
import { useProductStore } from "src/stores/productStore";
import { useUsersStore } from "src/stores/usersStore";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

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
    return userDetails.value.userName;
  } else {
    return "JustEat";
  }
});

const searchProductContent = ref("");
const inputSearch = ref("");

const searchProduct = (e) => {
  if (e.type == "click") {
    searchProductContent.value = "";
    inputSearch.value.focus();
  }
  productStore.searchProductContent = searchProductContent.value;
};

// Display the user's history from the beginning
const checkHistory = () => {
  currentDayStore.showHistoryTotal = true;
  currentDayStore.firebaseCheckHistoryTotal();
};

// Clear the search bar when the user logs in or switches to a different user.
watch(route, (newVal) => {
  if (newVal.params.userId != undefined) {
    searchProductContent.value = "";
  }
});
</script>

<style lang="scss" scoped>
.header-search {
  position: absolute;
  right: 0;
  width: 120px;
}
</style>