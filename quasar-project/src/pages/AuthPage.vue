<template>
  <q-page class="q-pa-sm">
    <div class="row justify-center">
      <q-btn-toggle
        v-model="slide"
        spread
        rounded
        unelevated
        no-caps
        class="custom-toggle full-width"
        toggle-color="primary"
        color="white"
        text-color="primary"
        :options="[
          { label: 'Login', value: 'Login' },
          { label: 'Register', value: 'Register' },
        ]"
      />
    </div>

    <q-carousel
      v-model="slide"
      swipeable
      animated
      height="300px"
      class="q-mt-md shadow-1 text-black rounded-borders"
    >
      <q-carousel-slide name="Login" class="column no-wrap flex-center">
        <div class="full-width">
          <LoginRegisterForm :slideName="slide" />
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="Register" class="column no-wrap flex-center">
        <div class="full-width">
          <LoginRegisterForm :slideName="slide" />
        </div>
      </q-carousel-slide>
    </q-carousel>
  </q-page>
</template>
<script setup>
import { ref, onMounted } from "vue";
import LoginRegisterForm from "../components/LoginRegisterForm.vue";
import { useUsersStore } from "src/stores/usersStore";
import { useRouter } from "vue-router";

const slide = ref("Login");

const router = useRouter();

const usersStore = useUsersStore();

onMounted(() => {
  if (usersStore.userDetails.id) {
    router.push("/");
  }
});
</script>

<style lang="scss" scoped>
.custom-toggle {
  border: 1px solid #027be3;
}

.q-page {
  margin-left: auto;
  margin-right: auto;
  max-width: 40%;
  background: yellow;
  @media (max-width: $breakpoint-sm-max) {
    max-width: 70%;
    background: red;
  }
  @media (max-width: $breakpoint-xs-max) {
    max-width: 90%;
    background: green;
  }
}
</style>