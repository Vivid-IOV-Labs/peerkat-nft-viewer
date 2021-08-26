<template>
  <div class="flex flex-col justify-center items-center space-x-1 w-full">
    <div class="flex mb-3">
      <ul class="flex">
        <li
          v-for="(value, name, index) in filters"
          :key="index"
          class="
            flex
            py-1
            px-2
            text-xs text-green-800
            border-green-600 border-2
            rounded
            items-center
            mx-1
            cursor-pointer
          "
          @click="removeFilter(name)"
        >
          <span class="font-bold">{{ name }}</span
          >: {{ value }}
          <span class="ml-2 block uppercase tracking-wide font-bold"
            >&times;</span
          >
        </li>
      </ul>
    </div>
    <div class="flex space-x-4">
      <base-select
        v-model="withCategories"
        name="categories"
        label="Category"
        :choices="categories"
      ></base-select>
      <base-select
        v-model="sortBy"
        name="sorts"
        label="Sort By"
        :choices="sorts"
      ></base-select>
      <base-select
        v-model="orderBy"
        name="orders"
        label="Ord By"
        :choices="orders"
      ></base-select>
      <base-checkbox
        v-model="isHighlighted"
        label-text="Highlighted"
      ></base-checkbox>
      <base-checkbox v-model="isEarn" label-text="is Earn"></base-checkbox>
    </div>
  </div>
</template>
<script lang="ts">
interface Choice {
  label: string;
  value?: string | number;
}
import { defineComponent, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import BaseSelect from "@/components/BaseSelect.vue";
import BaseCheckbox from "@/components/BaseCheckbox.vue";
export default defineComponent({
  components: {
    BaseSelect,
    BaseCheckbox,
  },
  setup: () => {
    const router = useRouter();
    const route = useRoute();
    function setQuery(addQuery: Record<string, string | number | undefined>) {
      const resetPage = { page: 1 };
      router.push({
        path: "/media",
        replace: true,
        query: { ...route.query, ...resetPage, ...addQuery },
      });
    }
    const categories = [
      { label: "Crypto", value: "crypto" },
      { label: "Gaming", value: "gaming" },
      { label: "Other", value: "other" },
    ];
    const sorts = [
      { label: "updatedAt", value: "updatedAt" },
      { label: "createdAt", value: "createdAt" },
    ];
    const orders: Choice[] = [
      { label: "asc", value: "asc" },
      { label: "desc", value: "desc" },
    ];
    const orderBy = computed({
      get(): Choice {
        return (
          orders.find((order: Choice) => {
            return order.value == route.query.order;
          }) || orders[1]
        );
      },
      set(newVal: Choice): void {
        setQuery({ order: newVal.value });
      },
    });
    const sortBy = computed({
      get(): Choice {
        return (
          sorts.find((sort: Choice) => {
            return sort.value == route.query.sortBy;
          }) || sorts[1]
        );
      },
      set(newVal: Choice): void {
        setQuery({ sortBy: newVal.value });
      },
    });
    const withCategories = computed({
      get(): Choice {
        return (
          categories.find((category: Choice) => {
            return category.value == route.query.sortBy;
          }) || categories[1]
        );
      },
      set(newVal: Choice): void {
        setQuery({ categories: JSON.stringify([newVal.value]) });
      },
    });
    const isEarn = computed({
      get(): boolean {
        return Boolean(route.query.earn);
      },
      set(newVal: boolean): void {
        setQuery({ earn: String(newVal) });
      },
    });
    const isHighlighted = computed({
      get(): boolean {
        return Boolean(route.query["list.highlighted"]);
      },
      set(newVal: boolean): void {
        setQuery({ ["list.highlighted"]: String(newVal) });
      },
    });
    const filters = computed(() => {
      const { ["list.highlighted"]: highlighted, categories } = route.query;
      return {
        ...(highlighted && { highlighted }),
        ...(categories && { categories }),
      };
    });

    return {
      sorts,
      orders,
      categories,
      orderBy,
      sortBy,
      isHighlighted,
      isEarn,
      withCategories,
      filters,
      removeFilter(name: string): void {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [name]: remove, ...rest } = route.query;
        router.push({
          path: "/media",
          replace: true,
          query: {
            ...rest,
          },
        });
      },
    };
  },
});
</script>
