<template>
  <div>
    <q-scroll-area
      class="q-pa-md"
      :style="
        !props.showProductForm
          ? 'height: 75vh; max-width: 100%'
          : 'height: 48vh; max-width: 100%'
      "
    >
      <q-list bordered separator>
        <div class="flex items-center justify-between">
          <q-item-label header>Name</q-item-label>
          <q-item-label header class="gt-xs">Calories per 100g</q-item-label>
          <q-item-label header>Options</q-item-label>
        </div>
        <q-separator />

        <q-item
          v-for="(product, key) in products"
          :key="key"
          @click="showProduct(product)"
          clickable
          v-ripple
          class="flex items-center justify-between"
        >
          <q-item-section top class="col-sm-3 col-xs-6">
            <q-item-label class="text-h6">{{ product.name }}</q-item-label>
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

          <q-item-section top side class="col-sm-3 col-xs-6">
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
import { defineProps, onMounted, ref } from "vue";
import { useProductStore } from "src/stores/productStore";
import { useCurrentDayStore } from "src/stores/currentDayStore";
import { useQuasar } from "quasar";

const $q = useQuasar();

const props = defineProps({
  showProductForm: Boolean,
});

const productsStore = useProductStore();
const currentDayStore = useCurrentDayStore();

const products = ref({});
productsStore.$subscribe((mutation, state) => {
  products.value = productsStore.products;
});

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
    productsStore.firebaseDeleteProduct(id);
    delete products.value[id];
  });
};

onMounted(() => {
  productsStore.firebaseGetProducts();
});
</script>

<style lang="scss">
.q-item__section--main {
  flex: none;
}
</style>