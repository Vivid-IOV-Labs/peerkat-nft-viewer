<template>
  <div class="alert alert-danger" role="alert">
    <ul v-if="messages && messages.length">
      <li v-for="message in messages" :key="message.key" class="block">
        {{ message.text }}
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { PropType } from "vue";

interface Message {
  text: string;
  key: string;
}
export default {
  props: {
    messages: {
      type: Array as PropType<Array<Message>>,
      default: () => [],
    },
  },
};
</script>
