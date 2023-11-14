<template>
  <q-page class="q-pa-sm overflow-hidden">
    <div class="q-gutter-md text-center">
      <q-btn
        @click="showProductForm = !showProductForm"
        unelevated
        rounded
        :color="showProductForm ? 'red-13' : 'primary'"
        no-caps
        :label="showProductForm ? 'Close' : 'Add a new product'"
      />

      <q-btn
        @click="resetDay"
        unelevated
        rounded
        color="primary"
        no-caps
        label="Reset day"
      />

      <q-btn
        @click="checkCurrentDay"
        unelevated
        rounded
        color="primary"
        no-caps
        label="Check current day"
      />

      <q-btn
        @click="checkHistory"
        unelevated
        rounded
        color="primary"
        no-caps
        label="Check history"
      />
    </div>

    <q-dialog v-model="showHistoryToday">
      <div
        v-if="macronutrientsHistory"
        class="bg-white q-pa-sm"
        style="width: 70vw; height: 60vh"
      >
        <q-scroll-area
          :thumb-style="thumbStyle"
          :bar-style="barStyle"
          style="width: 100%; height: 100%"
        >
          <div class="q-mx-sm text-center text-h6 fixed bg-white today-header">
            Kcal: {{ totalToday.calories || 0 }} Proteins:
            {{ totalToday.proteins || 0 }}g Carbohydrates:
            {{ totalToday.carbohydrates || 0 }}g Fats:
            {{ totalToday.fats || 0 }}g
          </div>
          <q-separator />
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
                <q-item-label class="text-bold row justify-between items-center"
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
            <div class="q-pa-xs fixed-bottom-right bg-white history-date">
              {{ new Date().toLocaleDateString() }}
            </div>
          </q-list>
        </q-scroll-area>
      </div>
    </q-dialog>

    <q-dialog v-model="showHistoryTotal">
      <div
        v-if="currentDayStore.macronutrientsHistoryTotal"
        class="bg-white q-pa-sm"
        style="width: 70vw; height: 60vh"
      >
        <q-scroll-area
          :thumb-style="thumbStyle"
          :bar-style="barStyle"
          style="width: 100%; height: 100%"
        >
          <q-list separator>
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
        </q-scroll-area>
      </div>
    </q-dialog>

    <transition
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <NewProductForm v-show="showProductForm" />
    </transition>

    <CurrentProducts :showProductForm="showProductForm" />
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import NewProductForm from "src/components/NewProductForm";
import CurrentProducts from "src/components/CurrentProducts";
import { useCurrentDayStore } from "src/stores/currentDayStore";
import { customScrollBar } from "src/composables/ScrollBar.js";

const { thumbStyle, barStyle } = customScrollBar().useCustomScrollBar();

const $q = useQuasar();

const currentDayStore = useCurrentDayStore();

const totalToday = ref({});
const macronutrientsHistory = ref({});
currentDayStore.$subscribe((mutation, state) => {
  totalToday.value = currentDayStore.macronutrients;
  macronutrientsHistory.value = currentDayStore.macronutrientsHistory;
});

const showProductForm = ref(false);

const resetDay = () => {
  currentDayStore.resetDay();
};

const showHistoryTotal = ref(false);
const checkHistory = () => {
  showHistoryTotal.value = true;
  currentDayStore.firebaseCheckHistoryTotal();
};

const showHistoryToday = ref(false);
const checkCurrentDay = () => {
  showHistoryToday.value = true;
};

const deleteProductFromToday = (id) => {
  delete macronutrientsHistory.value[id];
  currentDayStore.firebaseDeleteProductFromHistory(id);
};
</script>

<style lang="scss">
.today-header,
.history-date {
  z-index: 2;
}

.history-date {
  right: 20px;
}

.today-list {
  margin-top: 60px;
  margin-bottom: 18px;

  @media (max-width: $breakpoint-xs-max) {
    margin-top: 70px;
  }

  @media screen and (max-width: 500px) {
    margin-top: 90px;
  }
}

.q-scrollarea__thumb,
.q-scrollarea__bar {
  z-index: 2;
}
</style>