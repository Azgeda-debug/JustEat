<template>
  <div>
    <q-form
      @submit="addNewProduct"
      @keyup.enter="addNewProduct"
      class="q-gutter-md text-center"
      style="max-width: 60%; margin: 0 auto"
    >
      <q-input
        outlined
        v-model="newProduct.name"
        type="text"
        placeholder="Name of the Product"
        dense
      />

      <q-input
        outlined
        v-model.number="newProduct.calories"
        type="number"
        placeholder="Calories per 100g of Product"
        dense
      />

      <q-input
        outlined
        dense
        v-model.number="newProduct.proteins"
        type="number"
        placeholder="Protein per 100g of Product"
      />

      <q-input
        outlined
        v-model.number="newProduct.fats"
        type="number"
        placeholder="Fat per 100g of Product"
        dense
      />

      <q-input
        outlined
        v-model.number="newProduct.carbohydrates"
        type="number"
        placeholder="Carbohydrates per 100g of Product"
        dense
      />

      <q-btn
        flat
        no-caps
        label="Add"
        type="submit"
        class="bg-primary text-white q-px-xl"
      />
    </q-form>
    <q-separator class="q-mt-sm q-mb-xs" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useProductStore } from "src/stores/productStore";

const store = useProductStore();

const newProduct = ref({
  name: "",
  calories: null,
  proteins: null,
  fats: null,
  carbohydrates: null,
});

// Adding a new product to the database
const addNewProduct = () => {
  store.firebaseAddNewProduct(newProduct.value);
  newProduct.value = {
    name: "",
    calories: null,
    proteins: null,
    fats: null,
    carbohydrates: null,
  };
};
</script>