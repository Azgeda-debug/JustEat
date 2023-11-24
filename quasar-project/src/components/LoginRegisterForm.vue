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
    >
      <template v-slot:prepend>
        <q-icon name="person" />
      </template>
    </q-input>

    <q-input
      outlined
      rounded
      dense
      v-model="formData.email"
      autocomplete
      type="email"
      label="Email *"
      :rules="[(val) => (val && val.length > 0) || 'Please type your email']"
    >
      <template v-slot:prepend>
        <q-icon name="email" />
      </template>
    </q-input>

    <q-input
      outlined
      rounded
      dense
      v-model="formData.password"
      autocomplete
      :type=" showPassword ? 'password' : 'text'"
      label="Password *"
      :rules="[(val) => (val && val.length > 0) || 'Please type your password']"
    >
      <template v-slot:prepend>
        <q-icon name="lock" />
      </template>
      <template v-slot:append>
          <q-icon
            :name="showPassword ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="showPassword = !showPassword"
          />
        </template>
    </q-input>

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
import { ref, defineProps  } from "vue";
import { useUsersStore } from "src/stores/usersStore";

const showPassword = ref(true)

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