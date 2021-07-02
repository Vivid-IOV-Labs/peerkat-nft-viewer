<template>
  <div class="inline-flex items-center">
    <input
      :id="id"
      type="checkbox"
      class="rounded border-grey-200 text-green-600 focus:ring-green-400"
      :checked="modelValue"
      @input="handleChange"
    /><label :for="id" class="ml-2 text-grey-600">{{ labelText }}</label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

function getValue (event: Event): boolean | undefined  {
  const checked = (<HTMLInputElement>event.target).checked;
  return checked
}

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true,
    },
    labelText: {
      type: String,
      required: true,
    },
    modelValue: {
      type: Boolean,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  methods: {
    handleChange(event: Event): void {
      const checked = getValue(event);
      this.$emit("update:modelValue", checked);
    },
  },
});
</script>
