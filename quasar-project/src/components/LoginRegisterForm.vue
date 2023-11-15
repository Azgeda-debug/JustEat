<template>
  <q-form class="q-gutter-md">
    <q-input
      v-show="props.slideName == 'Register'"
      outlined
      rounded
      dense
      v-model="formData.name"
      autocomplete
      label="Name *"
      type="text"
      :rules="[(val) => (val && val.length > 0) || 'Please type your name']"
    />

    <q-input
      outlined
      rounded
      dense
      v-model="formData.email"
      autocomplete
      type="email"
      label="Email *"
      :rules="[(val) => (val && val.length > 0) || 'Please type your email']"
    />

    <q-input
      outlined
      rounded
      dense
      v-model="formData.password"
      autocomplete
      type="password"
      label="Passwprd *"
      :rules="[(val) => (val && val.length > 0) || 'Please type your password']"
    />

    <div class="text-center">
      <q-btn
        no-caps
        @click.prevent="submitForm"
        :label="props.slideName"
        type="submit"
        color="primary"
      />
    </div>
  </q-form>
</template>

<script setup>
import { ref, defineProps } from "vue";
import { useUsersStore } from "src/stores/usersStore";

const props = defineProps({
  slideName: String,
});

const formData = ref({
  name: "",
  email: "",
  password: "",
});

const usersStore = useUsersStore();

const submitForm = () => {
  if (props.slideName == "Register") {
    usersStore.firebaseRegisterUser(formData.value);
  } else {
    usersStore.firebaseLoginUser(formData.value);
  }
};
</script>

<style>
</style>