<template>
  <label :for="id" class="inline-flex items-center mt-3">
    <input
      :id="id"
      type="checkbox"
      class="form-checkbox h-5 w-5 text-gray-600"
      :checked="modelValue"
      @input="$emit('update:modelValue', $event.target.checked)"
    /><span class="ml-2 text-gray-700">{{ labelText }}</span>
  </label>
</template>

<script lang="ts">
type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T;
  currentTarget: T;
  checked: T;
};

export default {
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
    handleChange(event: HTMLElementEvent<HTMLInputElement>): void {
      console.log(event);
      this.$emit("update:modelValue", event.currentTarget?.value);
    },
  },
};
</script>
