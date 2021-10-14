<template>
  <div>
    <label class="col-form-label" :for="id">{{ labelText }}</label>
    <select
      :id="id"
      class="form-control form-control-lg"
      v-bind="$attrs"
      :selected="modelValue?.value || ''"
      @change="handleChange"
    >
      <option
        v-for="choice in choices"
        :key="choice.value"
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
    id: {
      type: String,
      default: () => "",
    },
    labelText: {
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
      ...props,
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
