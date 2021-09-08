<template>
  <div>
    <label
      class="uppercase tracking-wide text-gray-700 text-xs font-bold mr-2"
      :for="name"
      >{{ labelText }}</label
    >
    <VueMultiselect
      :model-value="modelValue"
      :options="options"
      mode="tags"
      :multiple="true"
      :taggable="true"
      @update:model-value="$emit('update:modelValue', $event)"
    >
    </VueMultiselect>
    <base-alert v-if="errors.length" :messages="errors" class="input-errors">
    </base-alert>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BaseAlert from "@/components/BaseAlert.vue";
import VueMultiselect from "vue-multiselect";

export default defineComponent({
  components: {
    VueMultiselect,
    BaseAlert,
  },
  props: {
    name: {
      type: String,
      default: () => "",
    },
    labelText: {
      type: String,
      default: () => "",
    },
    label: {
      type: String,
      default: () => "",
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: () => "",
    },
    errors: {
      type: Array,
      default: (): Array<unknown> => [],
    },
    options: {
      type: Array,
      default: (): Array<unknown> => [],
    },
  },
  emits: { "update:modelValue": null },
  setup(props, { emit }) {
    return {
      handleChange(value: Event): void {
        console.log(value);
        emit("update:modelValue", value);
      },
    };
  },
});
</script>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
