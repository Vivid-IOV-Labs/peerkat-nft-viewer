<template>
  <div class="inline-flex items-center">
    <input
      :id="id"
      type="checkbox"
      class="rounded border-grey-200 text-green-600 focus:ring-green-400"
      :checked="modelValue"
      @input="$emit('update:modelValue', $event.target.checked)"
    /><label :for="id" class="ml-2 text-grey-600">{{ labelText }}</label>
  </div>
  <div v-for="error of errors" :key="error.$uid" class="input-errors">
    <div class="text-red-500">{{ error.$message }}</div>
  </div>
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
