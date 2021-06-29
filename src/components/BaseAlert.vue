<template>
  <div
    class="
      bg-red-100
      border-t-4 border-red-400
      text-red-700
      px-4
      py-3
      rounded
      relative
    "
    role="alert"
  >
    <strong class="font-bold">{{ title }}</strong>
    <span
      v-for="message in messages"
      :key="message.key"
      class="block sm:inline"
      >{{ message.text }}</span
    >
    <span v-if="cancellable" class="absolute top-0 bottom-0 right-0 px-4 py-3">
      <svg
        class="fill-current h-6 w-6 text-red-500"
        role="button"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <title>Close</title>
        <path
          d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
        />
      </svg>
    </span>
  </div>
</template>
<script lang="ts">
import { PropType } from "vue";

type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T;
  currentTarget: T;
};
interface Message {
  text: string;
  key: string;
}
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    messages: {
      type: Array as PropType<Array<Message>>,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    cancellable: {
      type: Boolean,
      default: (): boolean => false,
    },
  },
  methods: {
    close(event: HTMLElementEvent<HTMLInputElement>): void {},
  },
};
</script>
