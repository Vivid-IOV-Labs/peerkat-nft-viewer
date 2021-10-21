<template>
  <div
    :id="key"
    class="modal fade"
    :class="{ 'show pr-4 d-block': show }"
    role="dialog"
    v-bind="describedBy"
    aria-modal="true"
    :aria-hidden="!show"
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
import { defineComponent, computed } from "vue";

export default defineComponent({
  props: {
    show: {
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
  emits: ["close"],
  setup(props, { emit }) {
    const key = props.title.trim().toLowerCase().replace(" ", "_");
    const describedBy = computed(() => {
      return props.show
        ? {
            ariaDescribedby: `modal-desc-${key}`,
            ariaLabelledby: `modal-label-${key}`,
          }
        : {};
    });
    return {
      describedBy,
      key,
      close(): void {
        emit("close");
      },
    };
  },
});
</script>
