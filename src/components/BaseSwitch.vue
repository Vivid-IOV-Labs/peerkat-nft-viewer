<template>
  <div>
    {{ modelValue }}
    <Switch
      :class="modelValue ? 'bg-green-900' : 'bg-green-200'"
      class="
        relative
        inline-flex
        flex-shrink-0
        h-8
        w-14
        border-2 border-transparent
        rounded-full
        cursor-pointer
        transition-colors
        ease-in-out
        duration-200
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-white
        focus-visible:ring-opacity-75
      "
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <span class="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        :class="modelValue ? 'translate-x-6' : 'translate-x-0'"
        class="
          pointer-events-none
          inline-block
          h-7
          w-7
          rounded-full
          bg-white
          shadow-lg
          transform
          ring-0
          transition
          ease-in-out
          duration-200
        "
      />
    </Switch>
  </div>
</template>

<script lang="ts">
import { Switch } from "@headlessui/vue";
type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T;
  currentTarget: T;
};

export default {
  components: { Switch },
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
      type: Boolean,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  methods: {
    handleChange(event: HTMLElementEvent<HTMLInputElement>): void {
      console.log(event);
      this.$emit("update:modelValue", event.currentTarget?.value);
    },
  },
};
</script>
