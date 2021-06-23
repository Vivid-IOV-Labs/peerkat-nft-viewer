<template>
  <button
    class="
      bg-green-400
      hover:bg-green-700
      focus:ring
      ring-offset-2
      text-white
      font-bold
      py-2
      px-4
      rounded-full
    "
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>
