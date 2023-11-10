import { defineStore } from 'pinia';
import { ref as vueRef } from 'vue'
import { uid } from 'quasar'
import { db } from 'src/boot/firebase'
import { ref as dbRef, set, onChildAdded, onChildChanged, remove } from "firebase/database";

export const useCurrentDayStore = defineStore('currentDayStore', () => {

    const macronutrients = vueRef({
        name: '',
        calories: 0,
        proteins: 0,
        fats: 0,
        carbohydrates: 0
    })

    const addProductToFirebase = (payLoad) => {
        // if(payLoad) {
        //     set(dbRef(db, ``))
        // }
        macronutrients.value.proteins += payLoad.proteins
        macronutrients.value.fats += payLoad.fats
        macronutrients.value.carbohydrates += payLoad.carbohydrates
        macronutrients.value.calories += payLoad.calories
    }

    const nextDay = () => {
        macronutrients.value = {
            calories: 0,
            proteins: 0,
            fats: 0,
            carbohydrates: 0
        }
    }

    return {
        macronutrients,
        addProductToFirebase,
        nextDay,
    }
});
