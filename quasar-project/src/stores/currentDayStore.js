import { defineStore } from 'pinia';
import { ref as vueRef } from 'vue'
import { uid } from 'quasar'
import { db } from 'src/boot/firebase'
import { ref as dbRef, set, get, onChildAdded, onChildChanged, remove, update } from "firebase/database";
import { useRoute } from 'vue-router';

export const useCurrentDayStore = defineStore('currentDayStore', () => {

    const macronutrients = vueRef({
        name: {},
        calories: 0,
        proteins: 0,
        fats: 0,
        carbohydrates: 0
    })
    const macronutrientsHistory = vueRef({})
    const macronutrientsHistoryTotal = vueRef({})

    const showHistoryToday = vueRef(false)
    const showHistoryTotal = vueRef(false)

    const route = useRoute()

    const getUserId = () => { return route.params.userId }

    const getDay = () => {
        let d = new Date()
        return d.toLocaleDateString().replace(/\./g, '-')
    }

    const addProductToFirebase = (payLoad, quantity) => {
        if (payLoad && quantity) {
            const day = getDay()
            const userId = getUserId()

            const roundToTwoDecimalPlaces = (value) => {
                return parseFloat(value.toFixed(2))
            }

            macronutrients.value.proteins += payLoad.proteins * (quantity / 100)
            macronutrients.value.fats += payLoad.fats * (quantity / 100)
            macronutrients.value.carbohydrates += payLoad.carbohydrates * (quantity / 100)
            macronutrients.value.calories += payLoad.calories * (quantity / 100)

            macronutrients.value.proteins = roundToTwoDecimalPlaces(macronutrients.value.proteins)
            macronutrients.value.fats = roundToTwoDecimalPlaces(macronutrients.value.fats)
            macronutrients.value.carbohydrates = roundToTwoDecimalPlaces(macronutrients.value.carbohydrates)
            macronutrients.value.calories = roundToTwoDecimalPlaces(macronutrients.value.calories)

            set(dbRef(db, `users/${userId}/dailies/${day}/total`), {
                calories: macronutrients.value.calories,
                proteins: macronutrients.value.proteins,
                fats: macronutrients.value.fats,
                carbohydrates: macronutrients.value.carbohydrates,
            })

            const id = uid()
            set(dbRef(db, `users/${userId}/dailies/${day}/history/${id}`), {
                calories: roundToTwoDecimalPlaces(payLoad.calories * (quantity / 100)),
                proteins: roundToTwoDecimalPlaces(payLoad.proteins * (quantity / 100)),
                fats: roundToTwoDecimalPlaces(payLoad.fats * (quantity / 100)),
                carbohydrates: roundToTwoDecimalPlaces(payLoad.carbohydrates * (quantity / 100)),
                quantity: quantity,
                name: payLoad.name,
            })
        }
    }

    const firebaseGetProducts = () => {
        const day = getDay()
        const userId = getUserId()

        onChildAdded(dbRef(db, `users/${userId}/dailies/${day}/history`), snapshot => {
            macronutrientsHistory.value[snapshot.key] = snapshot.val()
        })

        onChildAdded(dbRef(db, `users/${userId}/dailies/${day}/total`), snapshot => {
            macronutrients.value[snapshot.key] = snapshot.val()
        })

        onChildChanged(dbRef(db, `users/${userId}/dailies/${day}/total`), snapshot => {
            macronutrients.value[snapshot.key] = snapshot.val()
        })
    }

    const resetDay = () => {
        macronutrients.value = {
            name: {},
            calories: 0,
            proteins: 0,
            fats: 0,
            carbohydrates: 0
        }

        macronutrientsHistory.value = {}
        macronutrientsHistoryTotal.value = {}

        const day = getDay()
        const userId = getUserId()
        remove(dbRef(db, `users/${userId}/dailies/${day}`))
    }

    const firebaseCheckHistoryTotal = () => {
        const userId = getUserId()
        get(dbRef(db, `users/${userId}/dailies`)).then((snapshot) => {

            snapshot.forEach((data) => {
                const totalChild = data.child('total')
                if (snapshot.exists()) {
                    macronutrientsHistoryTotal.value[data.key] = totalChild.val()
                }
            })
        })
    }

    const firebaseDeleteProductFromHistory = (payLoad) => {
        const day = getDay()
        const userId = getUserId()

        const roundToTwoDecimalPlaces = (value) => {
            return parseFloat(value.toFixed(2))
        }

        get(dbRef(db, `users/${userId}/dailies/${day}/history/${payLoad}`)).then(snapshot => {
            macronutrients.value.calories -= snapshot.val().calories
            macronutrients.value.proteins -= snapshot.val().proteins
            macronutrients.value.fats -= snapshot.val().fats
            macronutrients.value.carbohydrates -= snapshot.val().carbohydrates

            macronutrients.value.proteins = roundToTwoDecimalPlaces(macronutrients.value.proteins)
            macronutrients.value.fats = roundToTwoDecimalPlaces(macronutrients.value.fats)
            macronutrients.value.carbohydrates = roundToTwoDecimalPlaces(macronutrients.value.carbohydrates)
            macronutrients.value.calories = roundToTwoDecimalPlaces(macronutrients.value.calories)

            update(dbRef(db, `users/${userId}/dailies/${day}/total`), macronutrients.value)
        })

        remove(dbRef(db, `users/${userId}/dailies/${day}/history/${payLoad}`))
    }

    return {
        macronutrients,
        macronutrientsHistory,
        macronutrientsHistoryTotal,
        showHistoryToday,
        showHistoryTotal,
        addProductToFirebase,
        resetDay,
        firebaseCheckHistoryTotal,
        firebaseGetProducts,
        firebaseDeleteProductFromHistory,
    }
});
