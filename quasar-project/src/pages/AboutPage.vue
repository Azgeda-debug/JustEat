<template>
  <q-page>
    <div class="q-gutter-y-md">
      <q-card class="shadow-0">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
        >
          <q-tab name="about" label="About" />
          <q-tab name="instructions" label="Instructions" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="about">
            <q-scroll-area
              :thumb-style="thumbStyle"
              :bar-style="barStyle"
              class="q-pa-md"
              :style="aboutScrollBarSizes"
            >
              <div class="text-h5 q-pb-md q-ml-xs">About</div>
              <q-list bordered class="rounded-borders">
                <q-expansion-item
                  v-for="(item, index) in aboutItems"
                  :key="index"
                  expand-separator
                  :label="item.title"
                  header-class="text-bold"
                  
                >
                  <q-card>
                    <q-card-section class="text-justify">
                      <span> {{ item.answer }}</span>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
              </q-list>
            </q-scroll-area>
          </q-tab-panel>

          <q-tab-panel name="instructions">
            <q-scroll-area
              :thumb-style="thumbStyle"
              :bar-style="barStyle"
              class="q-pa-md"
              :style="aboutScrollBarSizes"
            >
              <div class="text-h5 q-pl-xs">How to Use</div>
              <p class="q-pt-lg q-pl-xs text-h6">Menu Buttons</p>
              <q-list separator bordered>
                <q-item
                  clickable
                  v-for="(item, index) in instructionsButtons"
                  :key="index"
                >
                  <q-item-section>
                    <q-item-section>{{ item.buttonName }}</q-item-section>
                    <q-item-label caption>{{
                      item.buttonFunction
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>

              <p class="q-pt-lg q-pl-xs text-h6">Others</p>
              <q-list separator bordered>
                <q-item
                  v-for="(item, index) in otherInstructions"
                  :key="index"
                  clickable
                >
                  <q-item-section>
                    <q-item-section>{{ item.optionName }}</q-item-section>
                    <q-item-label caption>{{ item.description }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-scroll-area>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </q-page>
</template>
  
<script setup>
import { ref, computed } from "vue";
import { customScrollBar } from "src/composables/ScrollBar.js";
import { useQuasar } from "quasar";

const $q = useQuasar();

const { thumbStyle, barStyle } = customScrollBar().useCustomScrollBar();

const aboutItems = ref([
  {
    title: "How many people created the app?",
    answer: "The app was created by one person.",
  },
  {
    title: "Why was the app created?",
    answer:
      "Initially, it was designed to help me track daily macronutrients. Later, I decided to include this project in my resume.",
  },
  {
    title: "What sets this app apart from other similar apps?",
    answer: `I have tried several similar applications, but none of them met my expectations. While they offered numerous features, the two main drawbacks that bothered me were the difficulty in finding specific products I consumed and the lack of accuracy in matching similar items with the same macronutrient content. Additionally, these applications utilized general product databases, resulting in prolonged searches for specific items. In contrast, my application resolves these issues. Each user has the ability to personalize the app by adding their own consumed products. This not only streamlines the product database but also facilitates quicker searches for items.`,
  },
  {
    title: "Is the app available on multiple platforms?",
    answer:
      "The app functions as a web application, allowing users to access it on any device with internet connectivity.",
  },
  {
    title: "Contact",
    answer: "email: lukasz.kulenski17@op.pl",
  },
]);
const instructionsButtons = ref([
  {
    buttonName: "Add a New Product",
    buttonFunction:
      "Use this button to either open or close the form for adding a new product.",
  },
  {
    buttonName: "Change Macronutrientst",
    buttonFunction: "Adjust your target macronutrients.",
  },
  {
    buttonName: "Add Macronutrients",
    buttonFunction:
      "Enter your custom macronutrients (without adding a specific product).",
  },
  {
    buttonName: "Reset Day",
    buttonFunction: "Clear macronutrient data for the current day.",
  },
  {
    buttonName: "Check Current Day",
    buttonFunction: "View the history from the current day.",
  },
  {
    buttonName: "Check History App",
    buttonFunction: "Explore your history from the beginning.",
  },
  {
    buttonName: "Logout",
    buttonFunction: "sing out of your account.",
  },
]);
const otherInstructions = ref([
  {
    optionName: "Search Field",
    description: "Enter the product name to find specific items.",
  },
  {
    optionName: "Information about a product on mobile devices",
    description: " Click on a product to view details on mobile devices.",
  },
]);

const tab = ref("about");

// Set sizes for the about component based on the user's device
const aboutScrollBarSizes = computed(() => {
  if ($q.screen.height > 799) {
    return "height: 85vh; width: 100%";
  } else {
    return "  height: 80vh; width: 100%";
  }
});
</script>