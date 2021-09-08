<template>
  <div>
    <label
      class="uppercase tracking-wide text-gray-700 text-xs font-bold mr-2"
      :for="name"
      >{{ labelText }}</label
    >
    <Multiselect
      :model-value="modelValue"
      :options="options"
      mode="tags"
      :searchable="true"
      :create-tag="true"
      @update:model-value="$emit('update:modelValue', $event)"
    >
    </Multiselect>
    <base-alert v-if="errors.length" :messages="errors" class="input-errors">
    </base-alert>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BaseAlert from "@/components/BaseAlert.vue";
import Multiselect from "@vueform/multiselect";

export default defineComponent({
  components: {
    Multiselect,
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
<style src="@vueform/multiselect/themes/default.css"></style>
