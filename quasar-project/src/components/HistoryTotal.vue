<template>
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
</template>

<script setup>
import { ref, watch } from "vue";
import { useCurrentDayStore } from "src/stores/currentDayStore";
import { useQuasar } from "quasar";
import { customScrollBar } from "src/composables/ScrollBar.js";

// Scroll bar styles
const { thumbStyle, barStyle } = customScrollBar().useCustomScrollBar();

const $q = useQuasar();

const currentDayStore = useCurrentDayStore();

// Display the user's history from the beginning
const loadingHistoryTotal = ref(true);
watch(currentDayStore.macronutrientsHistoryTotal, (newVal) => {
  if (newVal) {
    currentDayStore.loadingHistoryTotal = false;
  }
});
</script>

<style lang="scss" scoped>
.q-scrollarea__thumb,
.q-scrollarea__bar {
  z-index: 2;
}
</style>