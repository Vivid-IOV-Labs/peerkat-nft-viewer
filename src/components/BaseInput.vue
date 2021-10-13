<template>
  <div>
    <label class="col-form-label" :for="id">{{ labelText }}</label>
    <input
      :id="id"
      class="form-control form-control-lg"
      :class="{ 'border-red-500': errors.length }"
      :aria-valid="errors.length"
      :required="isRequeired"
      :aria-required="isRequeired"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      @input="handleChange"
    />
    <base-alert
      v-if="errors.length"
      :messages="errors"
      role="alert"
      class="input-errors"
    >
    </base-alert>
  </div>
</template>

<script lang="ts">
import BaseAlert from "@/components/BaseAlert.vue";
import { defineComponent } from "vue";

const getValue = (event: Event): string | number | undefined => {
  const value =
    (event.target as HTMLInputElement).type == "number"
      ? Number((event.target as HTMLInputElement).value)
      : String((event.target as HTMLInputElement).value);
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
      type: [Number, String],
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
    isRequeired: {
      type: Boolean,
      default: false,
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
