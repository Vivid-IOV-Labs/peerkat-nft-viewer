<template>
  <button
    class="
      bg-red-500
      hover:bg-red-600
      text-white
      font-bold
      py-2
      px-4
      rounded-md
      shadow-sm
      disabled:opacity-80
    "
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>
