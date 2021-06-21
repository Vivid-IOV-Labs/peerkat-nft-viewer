<template>
  <label class="block text-grey-darker text-sm font-bold mb-2" 
   :for="id">{{ labelText }}</label>
  <input
    class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
    :value="modelValue"
    @change="handleChange"
    :id="id"
  />
</template>

<script lang="ts">
export default {
  props: {
    id: String,
    labelText: String,
    modelValue: String,
  },
  methods:{
    handleChange(e:Event) { 
        const {value} = (<HTMLInputElement>e.target)
        this.$emit("update:modelValue", value);
    }
  }
};

</script>