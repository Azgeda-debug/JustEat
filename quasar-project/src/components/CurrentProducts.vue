<template>
  <div>
    <q-scroll-area
      :thumb-style="thumbStyle"
      :bar-style="barStyle"
      class="q-pa-md"
      :class="!productStore.showProductForm ? 'q-mt-md' : ''"
      :style="
        !productStore.showProductForm
          ? 'height: 81vh; max-width: 100%'
          : 'height: 41vh; max-width: 100%'
      "
    >
      <q-list
        v-show="
          Object.keys(filteredProducts).length || Object.keys(products).length
        "
        bordered
        separator
      >
        <div class="flex items-center justify-between">
          <q-item-label header>Name</q-item-label>
          <q-item-label header class="gt-xs">Calories per 100g</q-item-label>
          <q-item-label header>Options</q-item-label>
        </div>
        <q-separator />

        <q-item
          v-for="(product, key) in searchProductContent
            ? filteredProducts
            : products"
          :key="key"
          @click="showProduct(product)"
          clickable
          v-ripple
          class="flex items-center justify-between"
        >
          <q-item-section top class="col-sm-3 col-xs-7">
            <q-item-label class="text-bold">{{ product.name }}</q-item-label>
          </q-item-section>

          <q-item-section top class="gt-xs text-center absolute-center col-6">
            <q-item-label>
              <span class="text-weight-medium"
                >kcal: {{ product.calories }}</span
              >
              <span class="text-grey-8">
                Proteins: {{ product.proteins }}g</span
              >
              <span class="text-grey-8">
                Carbohydrates: {{ product.carbohydrates }}g</span
              >
              <span class="text-grey-8"> Fats: {{ product.fats }}g</span>
            </q-item-label>
          </q-item-section>

          <q-item-section top side class="col-sm-3 col-xs-5">
            <div class="text-grey-8 q-gutter-xs">
              <q-btn
                @click.stop="addProduct(key)"
                size="12px"
                flat
                round
                icon="done"
                title="add"
              />
              <q-btn
                @click.stop="deleteProduct(key)"
                size="12px"
                flat
                round
                icon="delete"
                title="delete"
              />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useProductStore } from "src/stores/productStore";
import { useCurrentDayStore } from "src/stores/currentDayStore";
import { useQuasar } from "quasar";
import { customScrollBar } from "src/composables/ScrollBar.js";

// Scroll Bar Styles
const { thumbStyle, barStyle } = customScrollBar().useCustomScrollBar();

const $q = useQuasar();

const productStore = useProductStore();
const currentDayStore = useCurrentDayStore();

// Holds the product data obtained from the store
const products = ref({});
const searchProductContent = ref("");
productStore.$subscribe((mutation, state) => {
  products.value = productStore.products;
  searchProductContent.value = productStore.searchProductContent;
});

// Observing the input search and filtering the products
const filteredProducts = ref({});
watch(searchProductContent, (newVal) => {
  if (newVal) {
    filteredProducts.value = {};
    Object.keys(products.value).forEach((key) => {
      if (
        products.value[key].name
          .toLowerCase()
          .includes(newVal.toLowerCase().trim())
      ) {
        filteredProducts.value[key] = products.value[key];
      }
    });
  }
});

//  Displays information about the product (more useful for the mobile version)
const showProduct = (product) => {
  $q.dialog({
    dark: true,
    title: `${product.name}`,
    message: `Kcal: ${product.calories}, Proteins: ${product.proteins}, Carbohydrates: ${product.carbohydrates}, Fats: ${product.fats}`,
    ok: {
      push: true,
      color: "primary",
    },
    persistent: false,
  });
};

// Add the product to the database
const addProduct = (id) => {
  $q.dialog({
    dark: true,
    message: "Enter Quantity (grams)",
    prompt: {
      model: "",
      type: "number",
    },
    cancel: {
      push: true,
      color: "negative",
    },
    ok: {
      push: true,
      color: "primary",
    },
    persistent: false,
  }).onOk((quantity) => {
    currentDayStore.addProductToFirebase(products.value[id], quantity);
  });
};

// Delete the product from the database
const deleteProduct = (id) => {
  $q.dialog({
    dark: true,
    title: "Confirm",
    message: "Are you sure?",
    cancel: {
      push: true,
      color: "negative",
    },
    ok: {
      push: true,
      color: "primary",
    },
    persistent: false,
  }).onOk(() => {
    productStore.firebaseDeleteProduct(id);
    delete products.value[id];
  });
};

</script>

<style lang="scss">
.q-item__section--main {
  flex: none;
}
</style>