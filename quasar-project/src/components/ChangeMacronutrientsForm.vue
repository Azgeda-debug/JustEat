<template>
    <q-dialog v-model="usersStore.showChangeMacronutrientsForm">
      <div class="bg-white q-pa-lg">
        <div class="text-center">
          <span class="text-h6">
            Here you can change your macronutrients targets.
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
</template>

<script setup>
import { useUsersStore } from "src/stores/usersStore";

const usersStore = useUsersStore();
</script>