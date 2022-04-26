<template>
  <div>
    <label class="col-form-label w-100" :for="id">
      <span v-if="!labelHidden"> {{ labelText }}</span>
      <input
        :id="id"
        class="form-control form-control-lg mt-2"
        :class="{ 'border-red-500': errors.length }"
        :required="isRequeired"
        :aria-required="isRequeired"
        :aria-invalid="isInvalid"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        v-bind="describedBy"
        @input="handleChange"
      />
    </label>

    <base-alert
      v-if="errors.length"
      :id="`alert-${id}`"
      :messages="errors"
      role="alert"
      status="danger"
    >
    </base-alert>
  </div>
</template>

<script lang="ts">
import BaseAlert from "@/components/BaseAlert.vue";
import { defineComponent, computed } from "vue";

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
      default: "text",
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
    isInvalid: {
      type: Boolean,
      default: false,
    },
    labelHidden: { type: Boolean, default: () => false },
  },
  emits: { "update:modelValue": null },
  setup(props, { emit }) {
    const describedBy = computed(() => {
      return props.isInvalid ? { ariaDescribedby: `alert-${props.id}` } : {};
    });
    return {
      describedBy,
      handleChange(event: Event): void {
        const value = getValue(event);
        emit("update:modelValue", value);
      },
    };
  },
});
</script>
