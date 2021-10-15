<template>
  <div
    :id="key"
    class="modal fade"
    :class="{ 'show pr-4 d-block': show }"
    role="dialog"
    aria-labelledby="modal-label"
    aria-describedby="modal-desc"
    aria-modal="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="modal-label" class="modal-title">{{ title }}</h5>
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
        <div class="modal-body">
          <slot id="modal-desc" name="body"></slot>
        </div>
        <div class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

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
  setup(props) {
    const key = props.title.trim().toLowerCase().replace(" ", "_");
    return { key };
  },
  methods: {
    close(): void {
      this.$emit("close");
    },
  },
});
</script>
