<template>
  <div>
    <label
      class="uppercase tracking-wide text-gray-700 text-xs font-bold mr-2"
      :for="name"
      >{{ labelText }}</label
    >
    {{ tags }}
    <VueMultiselect
      :model-value="modelValue"
      :options="tags"
      mode="tags"
      :multiple="true"
      :taggable="true"
      @tag="addTag"
      @update:model-value="$emit('update:modelValue', $event)"
    >
    </VueMultiselect>
    <base-alert v-if="errors.length" :messages="errors" class="input-errors">
    </base-alert>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
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
    const tags = ref(props.options);
    return {
      tags,
      addTag(newTag: string) {
        tags.value.push(newTag);
        emit("update:modelValue", [...props.modelValue, newTag]);
      },
    };
  },
});
</script>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
