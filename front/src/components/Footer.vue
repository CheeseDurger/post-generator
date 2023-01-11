<script setup lang="ts">
const items: Array<string> = [
  "© Copyright 2023",
  'If you liked it, <a class="text-muted" href="https://www.buymeacoffee.com/thibaultd" target="_blank">buy me a coffee</a> <i class="bi bi-cup-hot"></i>',
  '<a class="text-muted" href="https://www.linkedin.com/in/thibault-de-vergnette/" target="_blank"><i class="bi bi-linkedin"></i></a>',
];
</script>

<template>
  <footer class="container py-5 border-top small">
    <div class="row">
      <div class="col text-center" v-for="item in items">
        <span class="text-muted" v-html="item"></span>
      </div>
    </div>
  </footer>
</template>