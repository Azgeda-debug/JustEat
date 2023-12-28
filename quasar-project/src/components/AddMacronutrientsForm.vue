<template>
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
</template>

<script setup>
import { ref } from 'vue'
import { useCurrentDayStore } from "src/stores/currentDayStore";

const currentDayStore = useCurrentDayStore();

// Add your own macronutrients (usefull if you don't want to add the product to database)
const macronutrients = ref({
  calories: 0,
  proteins: 0,
  fats: 0,
  carbohydrates: 0,
});
const AddMacronutrients = () => {
  currentDayStore.firebaseAddMacronutrients(macronutrients.value);
};
</script>