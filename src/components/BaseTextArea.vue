<template>
  <div>
    <label
      class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
      :for="id"
      >{{ labelText }}</label
    >
    <textarea
      :id="id"
      class="shadow-inner resize w-full text-gray-700 rounded py-3 px-4 mb-3"
      :class="{ 'border-red-500': errors.length }"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      v-bind="$attrs"
      @input="handleChange"
    ></textarea>

    <base-alert v-if="errors.length" :messages="errors" class="input-errors">
    </base-alert>
  </div>
</template>

<script lang="ts">
import BaseAlert from "@/components/BaseAlert.vue";
import { defineComponent } from "vue";

const getValue = (event: Event): string | undefined => {
  const value = (event.target as HTMLInputElement).value;
  return value;
};

export default defineComponent({
  components: {
    BaseAlert,
  },
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
      type: String,
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
    errors: {
      type: Array,
      default: (): Array<unknown> => [],
    },
  },
  emits: { "update:modelValue": null },
  methods: {
    handleChange(event: Event): void {
      const value = getValue(event);
      this.$emit("update:modelValue", value);
    },
  },
});
</script>
