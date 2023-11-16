import { defineStore } from 'pinia';
import { ref as vueRef } from 'vue'
import { uid } from 'quasar'
import { db } from 'src/boot/firebase'
import { ref as dbRef, set, onChildAdded, onChildChanged, remove } from "firebase/database";
import { useRoute } from 'vue-router';

export const useProductStore = defineStore('productStore', () => {

  const products = vueRef({})
  const searchProductContent = vueRef()
  const route = useRoute()

  const getUserId = () => { return route.params.userId }

  const firebaseAddNewProduct = (payLoad) => {
    if (payLoad.name.trim()) {
      const userId = getUserId()
      set(dbRef(db, `users/${userId}/products/${uid()}`), {
        name: payLoad.name,
        calories: payLoad.calories,
        proteins: payLoad.proteins,
        fats: payLoad.fats,
        carbohydrates: payLoad.carbohydrates
      })
    }
  }

  const firebaseGetProducts = () => {
    const userId = getUserId()
    onChildAdded(dbRef(db, `users/${userId}/products`), snapshot => {
      products.value[snapshot.key] = snapshot.val()
    })

    onChildChanged(dbRef(db, `users/${userId}/products`), snapshot => {
      products.value[snapshot.key] = snapshot.val()
    })
  }

  const firebaseDeleteProduct = (payLoad) => {
    const userId = getUserId()
    if (payLoad) {
      remove(dbRef(db, `users/${userId}/products/${payLoad}`))
    }
  }

  return {
    products,
    searchProductContent,
    firebaseAddNewProduct,
    firebaseGetProducts,
    firebaseDeleteProduct,
  }
});
