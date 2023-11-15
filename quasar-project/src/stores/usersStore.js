import { defineStore } from 'pinia';
import { ref as vueRef } from 'vue'
import { useQuasar } from 'quasar'
import { db, auth } from 'src/boot/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { ref as dbRef, set, get } from "firebase/database";
import { useRouter } from 'vue-router';

export const useUsersStore = defineStore('usersStore', () => {

    const $q = useQuasar()
    const router = useRouter()

    const userDetails = vueRef({
        name: '',
        email: '',
        id: ''
    })

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
                        name: payLoad.name,
                        email: payLoad.email
                    })

                    userDetails.value = {
                        name: payLoad.name,
                        id: id
                    }

                    router.push('/')
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
        }
    }
    const firebaseLoginUser = (payLoad) => {
        if (payLoad.email.trim() && payLoad.password.trim()) {
            signInWithEmailAndPassword(auth, payLoad.email, payLoad.password)
                .then((response) => { })
                .catch((error) => {
                    const errorCode = error.code

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

                get(dbRef(db, `users/${id}`)).then(snapshot => {
                    userDetails.value = snapshot.val()
                    userDetails.value.id = snapshot.key

                    router.push(`/${snapshot.key}`)
                })

      
            } else {
                userDetails.value = {}
                router.push('/auth')
            }
        });
    };

    return {
        userDetails,
        firebaseRegisterUser,
        firebaseLoginUser,
        firebaseLogoutUser,
        firebaseOnAuthStateChanged,
    }
});
