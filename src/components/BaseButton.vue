<template>
  <button
    class="
      bg-green-500
      hover:bg-green-600
      text-white
      font-bold
      py-2
      px-4
      rounded-md
      shadow-sm
    "
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>
