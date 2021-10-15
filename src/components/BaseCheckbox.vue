<template>
  <div class="inline-flex items-center">
    <label
      for="id"
      class="
        ml-2
        block
        uppercase
        tracking-wide
        text-gray-700 text-xs
        font-bold
        w-100
      "
      >{{ labelText }}
      <input
        id="id"
        type="checkbox"
        class="rounded w-5 h-5 border-grey-200 text-red-600 focus:ring-red-400"
        :checked="modelValue"
        @input="handleChange"
      />
    </label>
    <base-alert v-if="errors.length" :messages="errors" class="input-errors">
    </base-alert>
  </div>
</template>

<script lang="ts">
/* eslint-disable vuejs-accessibility/label-has-for */

import { defineComponent } from "vue";

function getValue(event: Event): boolean | undefined {
  const checked = (event.target as HTMLInputElement).checked;
  return checked;
}

export default defineComponent({
  props: {
    name: {
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
    errors: {
      type: Array,
      default: (): Array<unknown> => [],
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
