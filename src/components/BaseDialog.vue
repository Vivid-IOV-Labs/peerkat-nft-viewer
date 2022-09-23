<template>
  <div
    :id="key"
    class="modal fade"
    :class="{ 'show pr-4 d-block': modelValue }"
    role="dialog"
    v-bind="describedBy"
    aria-modal="true"
    :aria-hidden="!modelValue"
    tabindex="-1"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h3 :id="`modal-label-${key}`" class="modal-title">{{ title }}</h3>
          <button
            v-if="cancellable"
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close"
            @click="close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div :id="`modal-desc-${key}`" class="modal-body">
          <slot name="body"></slot>
        </div>
        <div class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    cancellable: {
      type: Boolean,
      default: false,
    },
  },
  emits: { "update:modelValue": null },
  setup(props, { emit }) {
    const show = ref(props.modelValue);
    const key = props.title.trim().toLowerCase().replace(" ", "_");
    const describedBy = computed(() => {
      return props.modelValue
        ? {
            ariaDescribedby: `modal-desc-${key}`,
            ariaLabelledby: `modal-label-${key}`,
          }
        : {};
    });
    return {
      describedBy,
      key,
      show,
      close(): void {
        emit("update:modelValue", false);
      },
    };
  },
});
</script>
<style>
.modal-dialog {
  height: 100vh !important;
  display: flex;
}

.modal-content {
  margin: auto !important;
  height: fit-content !important;
}
</style>
