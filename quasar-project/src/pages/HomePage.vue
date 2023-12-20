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

    <q-dialog v-model="currentDayStore.showHistoryToday">
      <q-card v-if="macronutrientsHistory" class="bg-white q-pa-sm">
        <q-card-section class="text-center">
          <span class="text-h6">
            Here you can check which products you have added today.
          </span>
        </q-card-section>

        <q-card-section>
          <q-scroll-area
            :thumb-style="thumbStyle"
            :bar-style="barStyle"
            style="width: 100%; height: 50vh"
          >
            <q-list separator class="today-list">
              <q-item
                v-for="(product, key) in macronutrientsHistory"
                :key="key"
                class="q-py-sm row justify-between items-end"
              >
                <q-item-section
                  :class="$q.screen.width < 600 ? 'full-width' : ''"
                >
                  <q-item-label class="text-bold">{{
                    product.name
                  }}</q-item-label>
                  <q-item-label>
                    Product Quantity: {{ product.quantity }}g
                  </q-item-label>
                  <q-item-label caption>
                    Proteins: {{ product.proteins }}g Carbohydrates:
                    {{ product.carbohydrates }}g Fats: {{ product.fats }}g
                  </q-item-label>
                  <q-item-label
                    class="text-bold row justify-between items-center"
                    ><span class="">Kcal: {{ product.calories }}</span>

                    <q-btn
                      @click="deleteProductFromToday(key)"
                      size="12px"
                      flat
                      round
                      icon="delete"
                      title="delete"
                      class="text-grey-8 lt-sm"
                  /></q-item-label>
                </q-item-section>
                <q-item-section side class="gt-xs">
                  <div class="text-grey-8">
                    <q-btn
                      @click="deleteProductFromToday(key)"
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
        </q-card-section>

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
    </q-dialog>

    <q-dialog v-model="currentDayStore.showHistoryTotal">
      <q-card
        v-if="currentDayStore.macronutrientsHistoryTotal"
        class="bg-white q-pa-sm"
      >
        <q-card-section class="text-center">
          <span class="text-h6">
            Here you can check your history from the beginning.
          </span>
        </q-card-section>

        <q-card-section>
          <q-scroll-area
            :thumb-style="thumbStyle"
            :bar-style="barStyle"
            style="width: 100%; height: 50vh"
          >
            <q-list
              v-show="
                Object.keys(currentDayStore.macronutrientsHistoryTotal)
                  .length && !currentDayStore.loadingHistoryTotal
              "
              separator
            >
              <q-item
                v-for="(
                  product, key
                ) in currentDayStore.macronutrientsHistoryTotal"
                :key="key"
                class="q-py-sm row"
              >
                <q-item-section>
                  <q-item-label class="text-h6">{{ key }}</q-item-label>
                  <q-item-label caption>
                    Proteins: {{ product.proteins }}g Carbohydrates:
                    {{ product.carbohydrates }}g Fats: {{ product.fats }}g
                  </q-item-label>
                  <q-item-label class="text-bold"
                    >Kcal: {{ product.calories }}</q-item-label
                  >
                </q-item-section>
              </q-item>
            </q-list>
            <div
              v-show="
                !currentDayStore.loadingHistoryTotal &&
                !Object.keys(currentDayStore.macronutrientsHistoryTotal).length
              "
              class="text-center"
            >
              <span class="text-h6 text-bold"
                >Your history is empty. Add any product to start recording your
                history.</span
              >
            </div>
            <div>
              <q-inner-loading
                :showing="currentDayStore.loadingHistoryTotal"
                label="Loading history..."
                label-class="text-blue-7"
                color="blue-5"
                label-style="font-size: 1.1em"
              />
            </div>
          </q-scroll-area>
        </q-card-section>

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
    </q-dialog>

    <q-dialog v-model="usersStore.showChangeMacronutrientsForm">
      <div class="bg-white q-pa-lg">
        <div class="text-center">
          <span class="text-h6">
            Here you can change your macronutrient targets.
          </span>
        </div>

        <q-form class="q-gutter-md q-mt-md">
          <q-input
            outlined
            rounded
            dense
            type="number"
            v-model="usersStore.userDetails.macronutrients.calories"
            hint="Calories"
          />

          <q-input
            outlined
            rounded
            dense
            type="number"
            v-model="usersStore.userDetails.macronutrients.proteins"
            hint="Proteins"
          />

          <q-input
            outlined
            rounded
            dense
            type="number"
            v-model="usersStore.userDetails.macronutrients.fats"
            hint="Fats"
          />

          <q-input
            outlined
            rounded
            dense
            type="number"
            v-model="usersStore.userDetails.macronutrients.carbohydrates"
            hint="Carbohydrates"
          />

          <div class="flex justify-end q-gutter-x-md">
            <q-btn
              v-close-popup
              @click.prevent="usersStore.firebaseChangeMacronutrients"
              label="Change"
              type="submit"
              color="primary"
            />

            <q-btn v-close-popup label="Close" color="red-5" />
          </div>
        </q-form>
      </div>
    </q-dialog>

    <q-dialog v-model="currentDayStore.showAddMacronutrientsForm">
      <div class="bg-white q-pa-lg">
        <div class="text-center">
          <span class="text-h6">
            Add macronutrients here. This is useful when you don't want to add a
            new product to your product list.
          </span>
        </div>

        <q-form class="q-gutter-md q-mt-md">
          <q-input
            outlined
            rounded
            dense
            type="number"
            v-model="macronutrients.calories"
            min="0"
            hint="Calories"
          />

          <q-input
            outlined
            rounded
            dense
            type="number"
            v-model="macronutrients.proteins"
            min="0"
            hint="Proteins"
          />

          <q-input
            outlined
            rounded
            dense
            type="number"
            v-model="macronutrients.fats"
            min="0"
            hint="Fats"
          />

          <q-input
            outlined
            rounded
            dense
            type="number"
            v-model="macronutrients.carbohydrates"
            min="0"
            hint="Carbohydrates"
          />

          <div class="flex justify-end q-gutter-x-md">
            <q-btn
              v-close-popup
              @click.prevent="AddMacronutrients"
              label="Add"
              type="submit"
              color="primary"
            />

            <q-btn v-close-popup label="Close" color="red-5" />
          </div>
        </q-form>
      </div>
    </q-dialog>

    <ProductDatabase />
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useQuasar } from "quasar";
import NewProductForm from "src/components/NewProductForm";
import CurrentProducts from "src/components/CurrentProducts";
import ProductDatabase from "src/components/ProductDatabase";
import { useCurrentDayStore } from "src/stores/currentDayStore";
import { useUsersStore } from "src/stores/usersStore";
import { useProductStore } from "src/stores/productStore";
import { customScrollBar } from "src/composables/ScrollBar.js";
import { useRouter } from "vue-router";

const loadingHistoryTotal = ref(true);

// Scroll Bar Styles
const { thumbStyle, barStyle } = customScrollBar().useCustomScrollBar();

const router = useRouter();

const $q = useQuasar();

const usersStore = useUsersStore();
const currentDayStore = useCurrentDayStore();
const productStore = useProductStore();

// Holds today's products data obtained from the store
const macronutrientsHistory = ref({});
currentDayStore.$subscribe((mutation, state) => {
  macronutrientsHistory.value = currentDayStore.macronutrientsHistory;
});

// Removes the product from today's history and Firebase
const deleteProductFromToday = (id) => {
  delete macronutrientsHistory.value[id];
  currentDayStore.firebaseDeleteProductFromHistory(id);
};

const macronutrients = ref({
  calories: 0,
  proteins: 0,
  fats: 0,
  carbohydrates: 0,
});
const AddMacronutrients = () => {
  currentDayStore.firebaseAddMacronutrients(macronutrients.value);
};

watch(productStore.products, (newVal) => {
  if (newVal) {
    productStore.loadingProducts = false;
  }
});

watch(currentDayStore.macronutrientsHistoryTotal, (newVal) => {
  if (newVal) {
    currentDayStore.loadingHistoryTotal = false;
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

<style lang="scss">
// .today-list {
//   margin-top: 60px;
//   margin-bottom: 18px;

//   @media (max-width: $breakpoint-xs-max) {
//     margin-top: 70px;
//   }

//   @media screen and (max-width: 500px) {
//     margin-top: 90px;
//   }
// }

.q-scrollarea__thumb,
.q-scrollarea__bar {
  z-index: 2;
}
</style>