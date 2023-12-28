<template>
  <q-page class="q-pa-sm">
    <q-inner-loading
      :showing="productStore.loadingProducts"
      label="Loading products..."
      label-class="text-blue-7"
      color="blue-5"
      label-style="font-size: 1.1em"
    />

    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <NewProductForm v-show="productStore.showProductForm" />
    </transition>

    <div
      v-show="
        Object.keys(productStore.products).length &&
        !productStore.loadingProducts
      "
    >
      <CurrentProducts />
    </div>

    <div
      v-show="
        !Object.keys(productStore.products).length &&
        !productStore.loadingProducts
      "
    >
      <div class="text-center text-h6">
        Start tracking your calories and macronutrients by adding your first
        product.
      </div>
    </div>

    <HistoryToday />
    <HistoryTotal />
    <ChangeMacronutrientsForm />
    <AddMacronutrientsForm />
    <ProductDatabase />
  </q-page>
</template>

<script setup>
import { onMounted, watch } from "vue";
import { useQuasar } from "quasar";
import NewProductForm from "src/components/NewProductForm";
import CurrentProducts from "src/components/CurrentProducts";
import ProductDatabase from "src/components/ProductDatabase";
import HistoryToday from "src/components/HistoryToday";
import HistoryTotal from "src/components/HistoryTotal";
import ChangeMacronutrientsForm from "src/components/ChangeMacronutrientsForm";
import AddMacronutrientsForm from "src/components/AddMacronutrientsForm";
import { useCurrentDayStore } from "src/stores/currentDayStore";
import { useUsersStore } from "src/stores/usersStore";
import { useProductStore } from "src/stores/productStore";
import { useRouter } from "vue-router";

const router = useRouter();

const $q = useQuasar();

const usersStore = useUsersStore();
const currentDayStore = useCurrentDayStore();
const productStore = useProductStore();

// Hide the loading component once products are loaded
watch(productStore.products, (newVal) => {
  if (newVal) {
    productStore.loadingProducts = false;
  }
});

onMounted(() => {
  if (!usersStore.userDetails.id) {
    router.push("/auth");
  }

  $q.loading.hide();

  currentDayStore.firebaseGetProducts();
  productStore.firebaseGetProducts();
});
</script>