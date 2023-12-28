<template>
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
</template>

<script setup>
import { ref } from "vue";
import { useCurrentDayStore } from "src/stores/currentDayStore";
import { useQuasar } from "quasar";
import { customScrollBar } from "src/composables/ScrollBar.js";

// Scroll bar styles
const { thumbStyle, barStyle } = customScrollBar().useCustomScrollBar();

const $q = useQuasar();

const currentDayStore = useCurrentDayStore();

const macronutrientsHistory = ref({});
currentDayStore.$subscribe((mutation, state) => {
  macronutrientsHistory.value = currentDayStore.macronutrientsHistory;
});

const deleteProductFromToday = (id) => {
  delete macronutrientsHistory.value[id];
  currentDayStore.firebaseDeleteProductFromHistory(id);
};
</script>

<style lang="scss" scoped>
.q-scrollarea__thumb,
.q-scrollarea__bar {
  z-index: 2;
}
</style>