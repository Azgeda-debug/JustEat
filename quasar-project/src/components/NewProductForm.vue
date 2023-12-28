<template>
  <div class="row">
    <q-form
      @submit="addNewProduct"
      @keyup.enter="addNewProduct"
      class="q-gutter-md col-md-6 col-12"
      style="margin: 0 auto"
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
        step="0.1"
      />

      <q-input
        outlined
        dense
        step="0.1"
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
        step="0.1"
      />

      <q-input
        outlined
        v-model.number="newProduct.carbohydrates"
        type="number"
        placeholder="Carbohydrates per 100g of Product"
        dense
        step="0.1"
      />

      <div class="flex justify-end q-gutter-x-md">
        <q-btn flat padding="6px 35px" label="Add" type="submit" class="bg-primary text-white" />

        <q-btn  @click="productStore.showProductForm = false" flat padding="6px 35px" label="Close" class="bg-red-6 text-white" />
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useProductStore } from "src/stores/productStore";

const productStore = useProductStore();

const newProduct = ref({
  name: "",
  calories: null,
  proteins: null,
  fats: null,
  carbohydrates: null,
});

// Add a new product to the database
const addNewProduct = () => {
  productStore.firebaseAddNewProduct(newProduct.value);
  newProduct.value = {
    name: "",
    calories: null,
    proteins: null,
    fats: null,
    carbohydrates: null,
  };
};
</script>