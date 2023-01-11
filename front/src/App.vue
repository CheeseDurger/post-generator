<script setup lang="ts">
/// <reference types="node" />

import { ref } from 'vue';

import MainButton from './components/MainButton.vue';
import TextArea from './components/TextArea.vue';
import LinkedinSignin from './components/LinkedinSignin.vue';
import Footer from './components/Footer.vue';

import { config } from '@/assets/environments/config';
import '@/assets/environments/analytics';
import { load as loadRecaptcha } from 'recaptcha-v3';

// Initialize recaptcha
loadRecaptcha(config.recaptchaKey, { autoHideBadge: true });

const mode = process.env.NODE_ENV;
const post = ref("");

const textareaUpdate = (text: string) => {
  post.value = text;
};
</script>


<template>
  <header>
    <div class="wrapper">
      <MainButton @textareaUpdate="textareaUpdate" />
    </div>
  </header>

  <main>
    <!-- <TextArea v-model:post="post" /> -->
    <TextArea :post="post" @textareaUpdate="textareaUpdate" />
    <LinkedinSignin v-if="mode === 'development'" />
  </main>

  <Footer />

</template>
