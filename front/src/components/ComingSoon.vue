<script setup lang="ts">
const title: string = 'Coming soon :';
const items: Array<string> = [
  "AI writes text on the fly, word by word",
  "Users can choose other topics than the current entrepreneurship topic (eg. career, green, self awareness, etc.)",
  "Multiple languages supported",
];
</script>

<template>
    <div class="container py-5 border-top">
    <div class="row py-3">
      <div class="col small">
        <span class="fw-bold">{{ title }}</span><br>
        <ul>
          <li v-for="item in items">
              {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
