<template>
    <button 
    class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded"
    v-bind="$attrs"
    type="button">
         <slot />
    </button>
</template>