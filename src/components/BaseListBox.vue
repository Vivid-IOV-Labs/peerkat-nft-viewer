<template>
  <Listbox v-model="modelValue">
    <div class="relative mt-1">
      <ListboxButton
        class="
          relative
          w-full
          py-2
          pl-3
          pr-10
          text-left
          bg-white
          rounded-lg
          shadow-md
          cursor-default
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-opacity-75
          focus-visible:ring-white
          focus-visible:ring-offset-orange-300
          focus-visible:ring-offset-2
          focus-visible:border-indigo-500
          sm:text-sm
        "
      >
        <span class="block truncate">{{ modelValue.label }}</span>
        <span
          class="
            absolute
            inset-y-0
            right-0
            flex
            items-center
            pr-2
            pointer-events-none
          "
        >
          <SelectorIcon class="w-5 h-5 text-gray-400" aria-hidden="true" />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="
            w-full
            py-1
            mt-1
            overflow-auto
            text-base
            bg-white
            rounded-md
            shadow-lg
            max-h-60
            ring-1 ring-black ring-opacity-5
            focus:outline-none
            sm:text-sm
            z-10
          "
        >
          <ListboxOption
            v-for="choice in choices"
            v-slot="{ active, selected }"
            :key="choice.value"
            :value="choice"
            as="template"
          >
            <li
              :class="[
                active ? 'text-amber-900 bg-amber-100' : 'text-gray-900',
                'cursor-default select-none relative py-2 pl-10 pr-4',
              ]"
            >
              <span
                :class="[
                  selected ? 'font-medium' : 'font-normal',
                  'block truncate',
                ]"
                >{{ choice.label }}</span
              >
              <span
                v-if="selected"
                class="
                  absolute
                  inset-y-0
                  left-0
                  flex
                  items-center
                  pl-3
                  text-amber-600
                "
              >
                <CheckIcon class="w-5 h-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script lang="ts">
import { ref } from "vue";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { defineComponent, PropType } from "vue";
interface Choice {
  label: string;
  value?: string | number;
}
export default defineComponent({
  components: { Listbox, ListboxButton, ListboxOptions, ListboxOption },

  props: {
    choices: {
      type: Array as PropType<Choice[]>,
      default: () => [],
    },
    id: {
      type: String,
      default: () => "",
    },
    labelText: {
      type: String,
      default: () => "",
    },
    modelValue: {
      type: Object as PropType<Choice>,
      default: () => ({ label: "", value: null }),
    },
  },
  emits: { "update:modelValue": null },
  setup(props, { emit }) {
    return {
      ...props,
      handleChange(event: Event): void {
        const value = (event.target as HTMLSelectElement).value;
        if (value) {
          const selected = props.choices.find((choice: Choice) => {
            return choice.value == value;
          });
          emit("update:modelValue", selected);
        }
      },
    };
  },
});
</script>
