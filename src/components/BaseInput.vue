<template>
  <div>
    <label
      class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
      :for="id"
      >{{ labelText }}</label
    >
    <input
      :id="id"
      class="shadow w-full text-gray-700 rounded py-3 px-4 mb-3"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      v-bind="$attrs"
      @change="handleChange"
    />
  </div>
</template>

<script lang="ts">
type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T;
  currentTarget: T;
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
      type: [Number, String, Array],
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      required: true,
    },
  },
  emits: { "update:modelValue": null },
  methods: {
    handleChange(event: HTMLElementEvent<HTMLInputElement>): void {
      this.$emit("update:modelValue", event.currentTarget?.value);
    },
  },
};
</script>
