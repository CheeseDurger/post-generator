<script setup lang="ts">
import { Tooltip } from "bootstrap";
import type { TextareaHTMLAttributes } from "vue";

const props = defineProps({
  post: {
    type: String,
    required: true,
  },
});

const emits = defineEmits([
  "textareaUpdate",
]);

const label: string = "Your Linkedin post :";
const placeholder: string = "🤖 AI will write your post here : feel free to edit after";

const button2: string = "Copy the text above";
const button3: string = "Go to Linkedin and paste it <i class='bi bi-box-arrow-up-right'></i>";

const tooltipText: string = "Text copied to clipboard";

const copy = (event: Event) => {
  navigator.clipboard.writeText(props.post).then( () => {
    const buttonElement: Element = event.target as Element;
    const tooltip = new Tooltip(buttonElement);
    tooltip.show();
    setTimeout(function () {
      tooltip.hide();
    }, 1000);
  });
};
</script>


<template>
  <div class="container py-5 border-top">
    <div class="row py-3">
      <div class="col">
        <label for="post" class="form-label">{{ label }}</label>
        <textarea
          id="post" class="form-control" rows="12"
          :placeholder="placeholder"
          :value="post"
          @input="$emit('textareaUpdate', ($event.target as TextareaHTMLAttributes).value)" >
        </textarea>
      </div>
    </div>
    <div class="row text-center">
      <div class="col">
        <a class="btn btn-outline-primary mx-2"
          data-bs-toggle="tooltip" data-bs-placement="top" data-bs-trigger="manual"
          v-bind:data-bs-title="tooltipText"
          @click="copy"
          v-html="button2">
        </a>
        <a class="btn btn-outline-primary mx-2" href="https://www.linkedin.com" target="_blank"
          v-html="button3">
        </a>
      </div>
    </div>
  </div>
</template>