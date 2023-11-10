import { defineStore } from 'pinia';
import { ref as vueRef } from 'vue'
import { uid } from 'quasar'
import { db } from 'src/boot/firebase'
import { ref as dbRef, set, onChildAdded, onChildChanged, remove } from "firebase/database";

export const useProductStore = defineStore('productStore', () => {

  const products = vueRef({})

  const firebaseAddNewProduct = (payLoad) => {
    if (payLoad.name.trim()) {
      set(dbRef(db, `products/${uid()}`), {
        name: payLoad.name,
        calories: payLoad.calories,
        proteins: payLoad.proteins,
        fats: payLoad.fats,
        carbohydrates: payLoad.carbohydrates
      })
    }
  }

  const firebaseGetProducts = () => {
    onChildAdded(dbRef(db, `products`), snapshot => {
      products.value[snapshot.key] = snapshot.val()
    })

    onChildChanged(dbRef(db, `products`), snapshot => {
      products.value[snapshot.key] = snapshot.val()
    })
  }

  const firebaseDeleteProduct = (payLoad) => {
    if (payLoad) {
      remove(dbRef(db, `products/${payLoad}`))
    }
  }

  return {
    products,
    firebaseAddNewProduct,
    firebaseGetProducts,
    firebaseDeleteProduct,
  }
});
