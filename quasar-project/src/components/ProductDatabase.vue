<template>
  <q-dialog
    v-model="productStore.showProductDatabaseForm"
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card class="bg-white q-pa-xs">
      <q-card-section class="text-center">
        <span class="text-h6"
          >In this window you can search for a product from the product
          database</span
        >
      </q-card-section>

      <q-card-section class="row items-center justify-between">
        <q-input
          @keyup.enter="searchProductFromProductDatabase"
          rounded
          outlined
          dense
          v-model="searchProductContent"
          hint="You can search for many products at the same time, e.g. write banana, apple, orange"
          placeholder="Eg. apple"
          class="q-mt-xs col-8"
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
          class="text-primary bg-blue-1 q-mb-md col-3"
        />
      </q-card-section>

      <q-card-section>
        <q-item-label class="q-my-sm">
          Macronutrients per 100 grams of products</q-item-label
        >

        <q-scroll-area
          :thumb-style="thumbStyle"
          :bar-style="barStyle"
          style="height: 40vh; max-width: 100%"
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
        <q-btn
          flat
          v-close-popup
          no-caps
          label="Close"
          class="text-white bg-red-5"
        />
      </q-card-actions>
    </q-card>

    <q-dialog
      v-model="showSelectedProduct"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-white q-pa-sm" style="max-width: max-content">
        <q-card-section>
          <q-list>
            <q-item>
              <q-item-section class="q-gutter-sm flex flex-center">
                <q-markup-table>
                  <thead>
                    <tr>
                      <th class="text-left">Name</th>
                      <th class="text-right">{{ selectedProduct.name }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="text-left">Calories</td>
                      <td class="text-right">{{ selectedProduct.calories }}</td>
                    </tr>
                  </tbody>
                  <tbody>
                    <tr>
                      <td class="text-left">Carbohydrates (g)</td>
                      <td class="text-right">
                        {{ selectedProduct.carbohydrates_total_g }}
                      </td>
                    </tr>
                  </tbody>
                  <tbody>
                    <tr>
                      <td class="text-left">Fats (g)</td>
                      <td class="text-right">
                        {{ selectedProduct.fat_total_g }}
                      </td>
                    </tr>
                  </tbody>
                  <tbody>
                    <tr>
                      <td class="text-left">Proteins (g)</td>
                      <td class="text-right">
                        {{ selectedProduct.protein_g }}
                      </td>
                    </tr>
                  </tbody>
                  <tbody>
                    <tr>
                      <td class="text-left">Sodium (mg)</td>
                      <td class="text-right">
                        {{ selectedProduct.sodium_mg }}
                      </td>
                    </tr>
                  </tbody>
                  <tbody>
                    <tr>
                      <td class="text-left">Potassium (mg)</td>
                      <td class="text-right">
                        {{ selectedProduct.potassium_mg }}
                      </td>
                    </tr>
                  </tbody>

                  <tbody>
                    <tr>
                      <td class="text-left">Cholesterol (mg)</td>
                      <td class="text-right">
                        {{ selectedProduct.cholesterol_mg }}
                      </td>
                    </tr>
                  </tbody>
                  <tbody>
                    <tr>
                      <td class="text-left">Sugar (g)</td>
                      <td class="text-right">{{ selectedProduct.sugar_g }}</td>
                    </tr>
                  </tbody>
                </q-markup-table>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn
            @click="addProductToFirebase"
            flat
            no-caps
            label="Add Product"
            class="text-white bg-primary"
          />
          <q-btn
            flat
            v-close-popup
            no-caps
            label="Close"
            class="text-white bg-red-5"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-dialog>
</template>

<script setup>
import { ref } from "vue";
import { useProductStore } from "stores/productStore.js";
import axios from "axios";
import { customScrollBar } from "src/composables/ScrollBar.js";
import { useQuasar } from "quasar";

// Scroll bar styles
const { thumbStyle, barStyle } = customScrollBar().useCustomScrollBar();

const $q = useQuasar();

const productStore = useProductStore();

const searchProductContent = ref("");
const productDatabaseItems = ref([]);
const loadingProducts = ref(false);

// Use the Nutrition Ninjas API to retrieve macronutrients information for the product
const searchProductFromProductDatabase = async () => {
  loadingProducts.value = true;
  const apiKey = "Iwe6s0snYLMbLTASHAxxzg==sKHY56WZfB89IZsK";

  const requestOptions = {
    method: "GET",
    url: `https://api.api-ninjas.com/v1/nutrition?query=${searchProductContent.value}`,
    headers: { "X-Api-Key": apiKey },
  };

  await axios.request(requestOptions).then((response) => {
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

// Check if the product is already added, if not, add it to the database 
const addProductToFirebase = () => {
  let checkProduct = 1;

  Object.keys(productStore.products).forEach((key) => {
    if (
      selectedProduct.value.name.toLowerCase() ==
      productStore.products[key].name.toLowerCase()
    ) {
      checkProduct = 0;
    }
  });

  if (!checkProduct) {
    $q.notify({
      type: "negative",
      message: "The product has already been added",
    });
  } else {
    const productItem = {
      name: selectedProduct.value.name,
      calories: selectedProduct.value.calories,
      proteins: selectedProduct.value.protein_g,
      fats: selectedProduct.value.fat_total_g,
      carbohydrates: selectedProduct.value.carbohydrates_total_g,
    };

    productStore.firebaseAddNewProduct(productItem);

    $q.notify({
      type: "positive",
      message: "The product has been added successfully.",
    });
  }
};
</script>