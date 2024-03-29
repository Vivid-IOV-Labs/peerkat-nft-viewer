<template>
  <div>
    <label class="col-form-label w-100" :for="id">
      <span v-if="!labelHidden"> {{ labelText }}</span>
      <select
        :id="id"
        class="form-control form-control-lg mt-2"
        :aria-label="labelText"
        :required="isRequeired"
        :aria-required="isRequeired"
        :aria-invalid="isInvalid"
        v-bind="describedBy"
        @blur="handleChange"
        @change="handleChange"
      >
        <option
          v-for="choice in choices"
          :key="choice.value"
          :value="choice.value"
          :selected="choice.value == model"
        >
          {{ choice.label }}
        </option>
      </select>
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
interface Choice {
  label: string;
  value?: string;
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
      type: [String, Object] as PropType<string | Choice>,
      default: () => undefined,
    },
    errors: {
      type: Array,
      default: (): Array<unknown> => [],
    },
    isRequeired: {
      type: Boolean,
      default: false,
    },
    isInvalid: {
      type: Boolean,
      default: false,
    },
    asVal: { type: Boolean, default: () => false },
    labelHidden: { type: Boolean, default: () => false },
  },
  emits: { "update:modelValue": null },
  setup(props, { emit }) {
    const describedBy = computed(() => {
      return props.isInvalid ? { ariaDescribedby: `alert-${props.id}` } : {};
    });
    const model = computed(() => {
      return typeof props.modelValue == "string"
        ? props.modelValue
        : props.modelValue?.value;
    });
    return {
      model,
      describedBy,
      handleChange(event: Event): void {
        const value = (event.target as HTMLSelectElement).value;
        if (value) {
          const selected = props.choices.find((choice: Choice) => {
            return choice.value == value;
          });
          if (props.asVal) {
            emit("update:modelValue", selected?.value);
          } else {
            emit("update:modelValue", selected);
          }
        }
      },
    };
  },
});
</script>
