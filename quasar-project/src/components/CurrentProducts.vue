<template>
  <div>
    <q-scroll-area
      class="q-pa-md"
      :style="
        !props.showProductForm
          ? 'height: 80vh; max-width: 100%'
          : 'height: 50vh; max-width: 100%'
      "
    >
      <q-list bordered separator>
        <div class="flex items-center justify-between">
          <q-item-label header>Name</q-item-label>
          <q-item-label header>Calories per 100g</q-item-label>
          <q-item-label header>Options</q-item-label>
        </div>
        <q-separator />

        <q-item
          v-for="(product, key) in products"
          :key="key"
          clickable
          v-ripple
          class="flex items-center justify-between"
        >
          <q-item-section top>
            <q-item-label class="text-h6">{{ product.name }}</q-item-label>
          </q-item-section>

          <q-item-section top class="absolute-center">
            <q-item-label>
              <span class="text-weight-medium"
                >kcal: {{ product.calories }}</span
              >
              <span class="text-grey-8"> Proteins: {{ product.proteins }}</span>
              <span class="text-grey-8"
                > Carbohydrates: {{ product.carbohydrates }}</span
              >
              <span class="text-grey-8"> Fats: {{ product.fats }}</span>
            </q-item-label>
          </q-item-section>

          <q-item-section top side>
            <div class="text-grey-8 q-gutter-xs">
              <q-btn
                @click="addProduct(key)"
                size="12px"
                flat
                dense
                round
                icon="done"
                title="add"
              />
              <q-btn
                @click="updateProduct(key)"
                size="12px"
                flat
                dense
                round
                icon="update"
                title="update"
              />
              <q-btn
                @click="deleteProduct(key)"
                size="12px"
                flat
                dense
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

const addProduct = (id) => {
  currentDayStore.addProductToFirebase(products.value[id]);
};
const updateProduct = (id) => {};

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
    persistent: true,
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