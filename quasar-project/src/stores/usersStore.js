import { defineStore } from 'pinia';
import { ref as vueRef } from 'vue'
import { useQuasar } from 'quasar'
import { db, auth } from 'src/boot/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { ref as dbRef, set, get, update } from "firebase/database";
import { useRouter, useRoute } from 'vue-router';

export const useUsersStore = defineStore('usersStore', () => {

    const $q = useQuasar()
    const router = useRouter()
    const route = useRoute()

    const userDetails = vueRef({
        name: '',
        id: '',
        macronutrients: {},
    })
    const showMacronutrientsForm = vueRef(false)

    const firebaseRegisterUser = (payLoad) => {
        if (payLoad.name.trim() && payLoad.email.trim() && payLoad.password.trim()) {

            createUserWithEmailAndPassword(auth, payLoad.email, payLoad.password)
                .then(response => {
                    $q.notify({
                        type: 'positive',
                        iconL: "check_circle",
                        message: 'User created successfully.'
                    })

                    const id = response.user.uid;

                    set(dbRef(db, `users/${id}`), {
                        firebaseUserDetails: {
                            name: payLoad.name,
                            email: payLoad.email,
                            macronutrients: {
                                calories: 2010,
                                carbohydrates: 250,
                                fats: 50,
                                proteins: 140
                            }
                        }
                    })

                    userDetails.value = {
                        name: payLoad.name,
                        id: id
                    }

                    router.push(`/${id}`)
                })
                .catch((error) => {
                    const errorCode = error.code;

                    if (errorCode == 'auth/invalid-email') {
                        $q.notify({
                            type: 'negative',
                            icon: 'warning',
                            message: 'Invalid email.'
                        })
                    }
                    if (errorCode == 'auth/weak-password') {
                        $q.notify({
                            type: 'negative',
                            icon: 'warning',
                            message: 'Weak password.'
                        })
                    }
                    if (errorCode == 'auth/email-already-in-use') {
                        $q.notify({
                            type: 'negative',
                            icon: 'warning',
                            message: 'Email alreasy in use.'
                        })
                    }
                });
        } else {
            $q.notify({
                type: 'negative',
                iconL: "warning",
                message: 'Fill in all fields.'
            })
        }
    }

    const firebaseLoginUser = (payLoad) => {
        if (payLoad.email.trim() && payLoad.password.trim()) {
            signInWithEmailAndPassword(auth, payLoad.email, payLoad.password)
                .then((response) => { })
                .catch((error) => {
                    const errorCode = error.code
                    if (errorCode == 'auth/invalid-email') {
                        $q.notify({
                            type: 'negative',
                            iconL: "warning",
                            message: 'Invalid email.'
                        })
                    }
                    if (errorCode == 'auth/invalid-login-credentials') {
                        $q.notify({
                            type: 'negative',
                            iconL: "warning",
                            message: 'Wrong email or password.'
                        })
                    }
                });
        }
    }

    const firebaseLogoutUser = () => {
        signOut(auth)
    }

    const firebaseOnAuthStateChanged = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const id = user.uid;

                get(dbRef(db, `users/${id}/firebaseUserDetails`)).then(snapshot => {
                    userDetails.value.name = snapshot.val().name
                    userDetails.value.macronutrients = snapshot.val().macronutrients
                    userDetails.value.id = id

                    router.push(`/${id}`)
                })


            } else {
                userDetails.value = {}
                router.push('/auth')
            }
        });
    };

    const firebaseChangeMacronutrients = () => {
        const id = route.params.userId
        update(dbRef(db, `users/${id}/firebaseUserDetails/macronutrients`), userDetails.value.macronutrients)
    }

    return {
        userDetails,
        showMacronutrientsForm,
        firebaseRegisterUser,
        firebaseLoginUser,
        firebaseLogoutUser,
        firebaseOnAuthStateChanged,
        firebaseChangeMacronutrients,
    }
});
