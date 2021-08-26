<template>
  <div v-if="modelValue" class="p-1">
    <label
      class="uppercase tracking-wide text-gray-700 text-xs font-bold mr-2"
      :for="name"
      >{{ label }}</label
    >
    <select
      :id="name"
      class="rounded"
      :value="modelValue.value"
      v-bind="$attrs"
      @change="handleChange"
    >
      <option
        v-for="choice in choices"
        :key="choice.label"
        :value="choice.value"
      >
        {{ choice.label }}
      </option>
    </select>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
interface Choice {
  label: string;
  value?: string | number;
}
export default defineComponent({
  props: {
    choices: {
      type: Array as PropType<Choice[]>,
      default: () => [],
    },
    name: {
      type: String,
      default: () => "",
    },
    label: {
      type: String,
      default: () => "",
    },
    modelValue: {
      type: Object as PropType<Choice>,
      default: () => undefined,
    },
  },
  emits: { "update:modelValue": null },
  setup(props, { emit }) {
    return {
      handleChange(event: Event): void {
        const value = (event.target as HTMLSelectElement).value;
        if (value) {
          const selected = props.choices.find((choice: Choice) => {
            return choice.value == value;
          });
          emit("update:modelValue", selected);
        }
      },
    };
  },
});
</script>
