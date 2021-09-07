<template>
  <div>
    <label
      class="uppercase tracking-wide text-gray-700 text-xs font-bold mr-2"
      :for="name"
      >{{ labelText }} {{ modelValue }}</label
    >
    <Multiselect
      :id="name"
      class="rounded py-1"
      :value="modelValue.value"
      mode="tags"
      :searchable="true"
      :create-tag="true"
      :append-new-tag="true"
      :options="options"
      @change="handleChange"
    />
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
    modelValue: {
      type: Object,
      default: () => {
        null;
      },
    },
    placeholder: {
      type: String,
      required: true,
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
        emit("update:modelValue", value);
      },
    };
  },
});
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
