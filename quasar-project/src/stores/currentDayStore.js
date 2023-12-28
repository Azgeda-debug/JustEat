import { defineStore } from 'pinia';
import { ref as vueRef } from 'vue'
import { uid } from 'quasar'
import { db } from 'src/boot/firebase'
import { ref as dbRef, set, get, onChildAdded, onChildChanged, remove, update } from "firebase/database";
import { useRoute } from 'vue-router';
import { format } from "date-fns";

export const useCurrentDayStore = defineStore('currentDayStore', () => {

    const macronutrients = vueRef({
        calories: 0,
        proteins: 0,
        fats: 0,
        carbohydrates: 0
    })
    const macronutrientsHistory = vueRef({})
    const macronutrientsHistoryTotal = vueRef({})

    const showHistoryToday = vueRef(false)
    const showHistoryTotal = vueRef(false)

    const showAddMacronutrientsForm = vueRef(false)

    const route = useRoute()

    const getUserId = () => { return route.params.userId }

    const getDay = () => {
        let d = new Date()
        return format(d, "dd-MM-yyyy");
    }

    const firebaseAddProduct = (payLoad, quantity) => {
        if (payLoad && quantity) {
            const day = getDay()
            const userId = getUserId()

            const roundToTwoDecimalPlaces = (value) => {
                return parseFloat(value.toFixed(2))
            }

            Object.keys(payLoad).forEach((property) => {
                if (property != 'name') {
                    macronutrients.value[property] += payLoad[property] * (quantity / 100);
                    macronutrients.value[property] = roundToTwoDecimalPlaces(macronutrients.value[property]);

                }
            });

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


    const sortDate = (dateA, dateB) => {
        const dataA = new Date(dateA.split('-').reverse().join('-'));
        const dataB = new Date(dateB.split('-').reverse().join('-'));

        if (dataA < dataB) {
            return 1;
        }
        if (dataA > dataB) {
            return -1;
        }
        return 0;
    };

    const loadingHistoryTotal = vueRef(true)
    const firebaseCheckHistoryTotal = () => {
        const userId = getUserId();
        const historyTotalArray = [];

        get(dbRef(db, `users/${userId}/dailies`)).then((snapshot) => {
            snapshot.forEach((data) => {
                const totalChild = data.child('total');
                if (totalChild.exists()) {
                    historyTotalArray.push({
                        date: data.key,
                        total: totalChild.val(),
                    });
                } else {
                    loadingHistoryTotal.value = false
                }
            });

            historyTotalArray.sort((a, b) => sortDate(a.date, b.date));

            historyTotalArray.forEach((item) => {
                macronutrientsHistoryTotal.value[item.date] = item.total;
            });
        });
    };
    const firebaseDeleteProductFromHistory = (payLoad) => {
        const day = getDay()
        const userId = getUserId()

        const roundToTwoDecimalPlaces = (value) => {
            return parseFloat(value.toFixed(2))
        }

        get(dbRef(db, `users/${userId}/dailies/${day}/history/${payLoad}`)).then(snapshot => {

            Object.keys(snapshot.val()).forEach((property) => {
                if (property != 'name' && property != 'quantity') {
                    macronutrients.value[property] -= snapshot.val()[property]
                    macronutrients.value[property] = roundToTwoDecimalPlaces(macronutrients.value[property]);
                }
            });

            update(dbRef(db, `users/${userId}/dailies/${day}/total`), macronutrients.value)
        })

        remove(dbRef(db, `users/${userId}/dailies/${day}/history/${payLoad}`))
    }

    const firebaseAddMacronutrients = (payLoad) => {
        macronutrients.value.calories += parseFloat(payLoad.calories)
        macronutrients.value.proteins += parseFloat(payLoad.proteins)
        macronutrients.value.fats += parseFloat(payLoad.fats)
        macronutrients.value.carbohydrates += parseFloat(payLoad.carbohydrates)

        const day = getDay()
        const userId = getUserId()

        update(dbRef(db, `users/${userId}/dailies/${day}/total`), macronutrients.value)
    }

    return {
        macronutrients,
        macronutrientsHistory,
        macronutrientsHistoryTotal,
        showHistoryToday,
        showHistoryTotal,
        showAddMacronutrientsForm,
        loadingHistoryTotal,
        firebaseAddProduct,
        resetDay,
        firebaseCheckHistoryTotal,
        firebaseGetProducts,
        firebaseDeleteProductFromHistory,
        firebaseAddMacronutrients,
    }
});
