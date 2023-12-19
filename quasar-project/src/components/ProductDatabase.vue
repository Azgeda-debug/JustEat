<template>
  <q-dialog
    v-model="productStore.showProductDatabaseForm"
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="bg-white q-pa-lg">
      <q-card-section>
        <span class="text-h6 text-center"
          >In this window you can search for a product from the product
          database</span
        >
      </q-card-section>

      <q-card-section class="row q-gutter-md items-center justify-between">
        <q-input
          @keyup.enter="searchProductFromProductDatabase"
          rounded
          outlined
          dense
          v-model="searchProductContent"
          hint="You can search for many products at the same time, e.g. write banana, apple, orange"
          placeholder="Eg. apple"
          class="q-mt-md"
          style="width: 75%"
        >
          <template v-if="!searchProductContent" v-slot:append>
            <q-icon name="search" />
          </template>
          <template v-else v-slot:append>
            <q-btn
              @click="searchProductContent = ''"
              flat
              dense
              rounded
              icon="close"
            />
          </template>
        </q-input>

        <q-btn
          @click="searchProductFromProductDatabase"
          flat
          rounded
          no-caps
          label="Search"
          class="text-primary bg-blue-1 q-mb-lg"
        />
      </q-card-section>

      <q-card-section>
        <q-item-label class="q-my-sm">
          Macronutrients per 100 grams of product</q-item-label
        >

        <q-scroll-area
          :thumb-style="thumbStyle"
          :bar-style="barStyle"
          style="height: 50vh; max-width: 100%"
        >
          <q-list class="column col" v-show="productDatabaseItems.length">
            <q-item
              v-for="(item, index) in productDatabaseItems"
              @click="getMoreInformationAboutProduct(item)"
              :key="index"
              clickable
              v-ripple
              class="col-6"
            >
              <q-item-section>
                <q-item-label class="text-bold">{{ item.name }}</q-item-label>
                <q-item-label>Calories: {{ item.calories }}</q-item-label>
                <q-item-label
                  >Carbohydrates:
                  {{ item.carbohydrates_total_g }} g</q-item-label
                >
                <q-item-label>Fats: {{ item.fat_total_g }} g</q-item-label>
                <q-item-label>Proteins: {{ item.protein_g }} g</q-item-label>
                <q-item-label caption
                  >click to get more information</q-item-label
                >
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-card-section>

      <q-inner-loading
        :showing="loadingProducts"
        label="Loading products..."
        label-class="text-blue-7"
        color="blue-5"
        label-style="font-size: 1.1em"
      />

      <q-card-actions align="right">
        <q-btn flat v-close-popup no-caps label="Close" class="text-red" />
      </q-card-actions>
    </q-card>

    <q-dialog
      v-model="showSelectedProduct"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-white q-pa-lg">
        <q-card-section>
          <q-list>
            <q-item>
              <q-item-section class="q-gutter-sm">
                <q-item-label class="text-bold">{{
                  selectedProduct.name
                }}</q-item-label>
                <q-item-label
                  >Calories: {{ selectedProduct.calories }}</q-item-label
                >
                <q-item-label
                  >Carbohydrates:
                  {{ selectedProduct.carbohydrates_total_g }} g</q-item-label
                >
                <q-item-label
                  >Fats: {{ selectedProduct.fat_total_g }} g</q-item-label
                >
                <q-item-label
                  >Proteins: {{ selectedProduct.protein_g }} g</q-item-label
                >
                <q-item-label
                  >Cholesterol:
                  {{ selectedProduct.cholesterol_mg }} mg</q-item-label
                >
                <q-item-label
                  >Potassium:
                  {{ selectedProduct.potassium_mg }} mg</q-item-label
                >
                <q-item-label
                  >Sodium: {{ selectedProduct.sodium_mg }} mg</q-item-label
                >
                <q-item-label
                  >Sugar: {{ selectedProduct.sugar_g }} g</q-item-label
                >
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            @click="addProductToFirebase"
            flat
            no-caps
            label="Add Product"
            class="text-blue-5"
          />
          <q-btn flat v-close-popup no-caps label="Back" class="text-red" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-dialog>
</template>

<script setup>
import { onUnmounted, ref } from "vue";
import { useProductStore } from "stores/productStore.js";
import axios from "axios";
import { customScrollBar } from "src/composables/ScrollBar.js";
import { useQuasar } from "quasar";

const { thumbStyle, barStyle } = customScrollBar().useCustomScrollBar();

const $q = useQuasar();

const productStore = useProductStore();

const searchProductContent = ref("");
const productDatabaseItems = ref([]);
const loadingProducts = ref(false);

const searchProductFromProductDatabase = async () => {
  loadingProducts.value = true;
  const apiKey = "Iwe6s0snYLMbLTASHAxxzg==sKHY56WZfB89IZsK";

  const options = {
    method: "GET",
    url: `https://api.api-ninjas.com/v1/nutrition?query=${searchProductContent.value}`,
    headers: { "X-Api-Key": apiKey },
  };

  await axios.request(options).then((response) => {
    productDatabaseItems.value = response.data;
    loadingProducts.value = false;
  });
};

const selectedProduct = ref([]);
const showSelectedProduct = ref(false);
const getMoreInformationAboutProduct = (item) => {
  selectedProduct.value = item;
  showSelectedProduct.value = true;
};

const addProductToFirebase = () => {
  let checkProduct = 0;

  Object.keys(productStore.products).forEach((key) => {
    if (
      selectedProduct.value.name.toLowerCase() ==
      productStore.products[key].name.toLowerCase()
    ) {
    //   checkProduct = 0;
        console.log('nie przeszlo')
    } else {
    //   checkProduct = 1;
        console.log('przeszlo')
    }
  });

//   if (!checkProduct) {
//     $q.notify({
//       type: "negative",
//       message: "The product has already been added",
//     });
//   } else {
//     const productItem = {
//       name: selectedProduct.value.name,
//       calories: selectedProduct.value.calories,
//       proteins: selectedProduct.value.protein_g,
//       fats: selectedProduct.value.fat_total_g,
//       carbohydrates: selectedProduct.value.carbohydrates_total_g,
//     };

//     productStore.firebaseAddNewProduct(productItem);

//     $q.notify({
//       type: "positive",
//       message: "The product has been added successfully.",
//     });
//   }
};

onUnmounted(() => {
  productDatabaseItems.value = [];
});
</script>