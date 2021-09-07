<template>
  <div>
    <label
      class="uppercase tracking-wide text-gray-700 text-xs font-bold mr-2"
      :for="name"
      >{{ labelText }} {{ modelValue }}</label
    >
    <Multiselect
      :id="name"
      class="rounded py-1"
      :value="modelValue.value"
      mode="tags"
      :label="label"
      :searchable="true"
      :create-tag="true"
      :append-new-tag="true"
      :options="options"
      :classes="{
        container:
          'relative mx-auto w-full flex items-center justify-end box-border cursor-pointer border border-gray-300 rounded bg-white text-base leading-snug outline-none',
        containerDisabled: 'cursor-default bg-gray-100',
        containerOpen: 'rounded-b-none',
        containerOpenTop: 'rounded-t-none',
        containerActive: 'ring ring-green-500 ring-opacity-30',
        singleLabel:
          'flex items-center h-full absolute left-0 top-0 pointer-events-none bg-transparent leading-snug pl-3.5',
        multipleLabel:
          'flex items-center h-full absolute left-0 top-0 pointer-events-none bg-transparent leading-snug pl-3.5',
        search:
          'w-full absolute inset-0 outline-none appearance-none box-border border-0 text-base font-sans bg-white rounded pl-3.5',
        tags: 'flex-grow flex-shrink flex flex-wrap items-center mt-1 pl-2',
        tag: 'bg-green-500 text-white text-sm font-semibold py-0.5 pl-2 rounded mr-1 mb-1 flex items-center whitespace-nowrap',
        tagDisabled: 'pr-2 !bg-gray-400 text-white',
        tagRemove:
          'flex items-center justify-center p-1 mx-0.5 rounded-sm hover:bg-black hover:bg-opacity-10 group',
        tagRemoveIcon:
          'bg-multiselect-remove bg-center bg-no-repeat opacity-30 inline-block w-3 h-3 group-hover:opacity-60',
        tagsSearchWrapper:
          'inline-block relative mx-1 mb-1 flex-grow flex-shrink h-full',
        tagsSearch:
          'absolute inset-0 border-0 outline-none appearance-none p-0 text-base font-sans box-border w-full',
        tagsSearchCopy: 'invisible whitespace-pre-wrap inline-block h-px',
        placeholder:
          'flex items-center h-full absolute left-0 top-0 pointer-events-none bg-transparent leading-snug pl-3.5 text-gray-400',
        caret:
          'bg-multiselect-caret bg-center bg-no-repeat w-2.5 h-4 py-px box-content mr-3.5 relative z-10 opacity-40 flex-shrink-0 flex-grow-0 transition-transform transform pointer-events-none',
        caretOpen: 'rotate-180 pointer-events-auto',
        clear:
          'pr-3.5 relative z-10 opacity-40 transition duration-300 flex-shrink-0 flex-grow-0 flex hover:opacity-80',
        clearIcon:
          'bg-multiselect-remove bg-center bg-no-repeat w-2.5 h-4 py-px box-content inline-block',
        spinner:
          'bg-multiselect-spinner bg-center bg-no-repeat w-4 h-4 z-10 mr-3.5 animate-spin flex-shrink-0 flex-grow-0',
        dropdown:
          'absolute -left-px -right-px bottom-0 transform translate-y-full border border-gray-300 -mt-px overflow-y-scroll z-50 bg-white flex flex-col rounded-b',
        dropdownTop:
          '-translate-y-full top-px bottom-auto flex-col-reverse rounded-b-none rounded-t',
        dropdownHidden: 'hidden',
        options: 'flex flex-col p-0 m-0 list-none',
        optionsTop: 'flex-col-reverse',
        option:
          'flex items-center justify-start box-border text-left cursor-pointer text-base leading-snug py-2 px-3',
        optionPointed: 'text-gray-800 bg-gray-100',
        optionSelected: 'text-white bg-green-500',
        optionDisabled: 'text-gray-300 cursor-not-allowed',
        optionSelectedPointed: 'text-white bg-green-500 opacity-90',
        optionSelectedDisabled:
          'text-green-100 bg-green-500 bg-opacity-50 cursor-not-allowed',
        noOptions: 'py-2 px-3 text-gray-600 bg-white',
        noResults: 'py-2 px-3 text-gray-600 bg-white',
        fakeInput:
          'bg-transparent absolute left-0 right-0 -bottom-px w-full h-px border-0 p-0 appearance-none outline-none text-transparent',
        spacer: 'h-9 py-px box-content',
      }"
      @change="handleChange"
    />
    <base-alert v-if="errors.length" :messages="errors" class="input-errors">
    </base-alert>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BaseAlert from "@/components/BaseAlert.vue";
import Multiselect from "@vueform/multiselect";

export default defineComponent({
  components: {
    Multiselect,
    BaseAlert,
  },
  props: {
    name: {
      type: String,
      default: () => "",
    },
    labelText: {
      type: String,
      default: () => "",
    },
    label: {
      type: String,
      default: () => "",
    },
    modelValue: {
      type: Object,
      default: () => {
        null;
      },
    },
    placeholder: {
      type: String,
      required: true,
    },
    errors: {
      type: Array,
      default: (): Array<unknown> => [],
    },
    options: {
      type: Array,
      default: (): Array<unknown> => [],
    },
  },
  emits: { "update:modelValue": null },
  setup(props, { emit }) {
    return {
      handleChange(value: Event): void {
        emit("update:modelValue", value);
      },
    };
  },
});
</script>
