<script setup lang="ts">
import { ref, type SelectHTMLAttributes } from "vue";

import { Topic, LanguageCode, topics, languages } from "../assets/types";
import { getInstance as getRecaptchaInstance } from "recaptcha-v3";
import { config } from "@/assets/environments/config";

const emit = defineEmits([
  "textareaUpdate",
]);

const title: string = "Go viral on Linkedin with AI";
const tagline: string = "From 0 to 100k+ followers 🔥";

const button = {
  enabled: "Generate your Linkedin post <i class='bi bi-arrow-down'></i>",
  disabled: "<span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span><span>Loading...<br></span><span class='small'>May take 3 to 15 seconds to generate</span>",
};

let postCount = 0;

let selectedTopic = Topic.ENTREPRENEURSHIP;
let selectedLanguage = LanguageCode.EN;

let buttonEnabled = ref(true);

function selectTopic(topic: Topic): void {
  selectedTopic = topic;
};

function selectLanguage(languageCode: LanguageCode): void {
  selectedLanguage = languageCode;
};

function generatePost(topic: Topic, language: LanguageCode): void {

  postCount++;
  buttonEnabled.value = false;

  getRecaptchaInstance().execute(config.recaptchaKey).then( (token: string) => {

    let url = new URL(config.postUrl);
    url.searchParams.append("captcha", token);
    url.searchParams.append("topic", topic);
    url.searchParams.append("language", language);
    url.searchParams.append("postCount", postCount.toString());
    
    fetch( url.toString(),
    ).then( (response: Response) => response.text()
    ).then( (post: string) => {
      emit("textareaUpdate", post);
      buttonEnabled.value = true;
    });

  });
};
</script>


<template>
  <div class="container text-center py-5">
    <div class="row py-3">
      <div class="col">
        <h1 class="display-1">{{ title }}</h1>
        <p class="lead">{{ tagline }}</p>
      </div>
    </div>
  </div>
  <div class="d-flex flex-row justify-content-center py-3">

    <!-- <div class="px-2">
      <select id="languageSelect" class="form-select form-select-lg" aria-label="Languages"
      :selected="selectedLanguage"
      @change="$emit('selectLanguage', ($event.target as SelectHTMLAttributes).value)">
        <option selected disabled>Choose a language...</option>
        <option v-for="language in languages" :value="(language as any).value">{{ (language as any).label }}</option>
      </select>
    </div> -->

    <div class="px-2">
      <select id="topicSelect" class="form-select form-select-lg" aria-label="Topics"
      :selected="selectedTopic"
      @change="selectTopic(($event.target as SelectHTMLAttributes).value)">
        <option selected disabled>Choose a topic...</option>
        <option v-for="topic in topics" :value="topic.value">{{ topic.label }}</option>
      </select>
    </div>

    <div class="px-2">
      <a class="btn btn-primary btn-lg"
      v-html="buttonEnabled ? button.enabled : button.disabled"
      @click="generatePost(selectedTopic, selectedLanguage)"
      :class="{disabled: !buttonEnabled}">
      </a>
    </div>

  </div>
</template>
