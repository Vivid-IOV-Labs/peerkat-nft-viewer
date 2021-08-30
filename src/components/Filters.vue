<template>
  <div class="flex">
    <a
      class="text-xs text-green-600 uppercase font-bold ml-2"
      href="#"
      @click="isShowing = !isShowing"
    >
      Filters
    </a>
    <TransitionRoot
      :show="isShowing"
      enter="transition-opacity duration-75"
      enter-from="opacity-0"
      enter-to="opacity-100"
      leave="transition-opacity duration-150"
      leave-from="opacity-100"
      leave-to="opacity-0"
    >
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
              <span class="font-bold">
                <span v-if="!categories.map((c) => c.value).includes(value)">{{
                  value
                }}</span>
                {{ name }}</span
              >

              <span class="ml-2 block uppercase tracking-wide font-bold"
                >&times;</span
              >
            </li>
          </ul>
        </div>
        <div class="flex space-x-4">
          <base-select
            id="sizes"
            v-model="pageSize"
            name="sizes"
            label="Items per Page"
            :choices="sizes"
          ></base-select>
          <base-select
            id="categories"
            v-model="withCategories"
            name="categories"
            label="Category"
            :choices="categories"
          ></base-select>
          <base-select
            id="sorts"
            v-model="sortBy"
            name="sorts"
            label="Sort By"
            :choices="sorts"
          ></base-select>
          <base-select
            id="orders"
            v-model="orderBy"
            name="orders"
            label="Ord By"
            :choices="orders"
          ></base-select>
          <base-checkbox
            id="highlighted"
            v-model="isHighlighted"
            label-text="Highlighted"
          ></base-checkbox>
          <base-checkbox
            id="earn"
            v-model="isEarn"
            label-text="is Earn"
          ></base-checkbox>
        </div>
      </div>
    </TransitionRoot>
  </div>
</template>
<script lang="ts">
interface Choice {
  label: string;
  value?: string | number;
}
import { defineComponent, computed, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import BaseSelect from "@/components/BaseSelect.vue";
import BaseCheckbox from "@/components/BaseCheckbox.vue";
import useFilters from "../modules/filters";
import { TransitionRoot } from "@headlessui/vue";

export default defineComponent({
  components: {
    BaseSelect,
    BaseCheckbox,
    TransitionRoot,
  },
  setup: () => {
    const router = useRouter();
    const route = useRoute();
    const { setQuery } = useFilters();
    const isShowing = ref(true);
    const categories = [
      { label: "Crypto", value: "crypto" },
      { label: "Gaming", value: "gaming" },
      { label: "Other", value: "other" },
    ];
    const sorts = [
      { label: "Updated At", value: "updatedAt" },
      { label: "Created At", value: "createdAt" },
    ];
    const orders: Choice[] = [
      { label: "Ascending", value: "asc" },
      { label: "Descending", value: "desc" },
    ];
    const sizes: Choice[] = [
      { label: "6 per page", value: 6 },
      { label: "12 per page", value: 12 },
      { label: "24 per page", value: 24 },
      { label: "48 per page", value: 48 },
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
    const pageSize = computed({
      get(): Choice {
        return (
          sizes.find((sort: Choice) => {
            return sort.value == route.query.pageSize;
          }) || sizes[1]
        );
      },
      set(newVal: Choice): void {
        setQuery({ pageSize: newVal.value });
      },
    });
    const withCategories = computed({
      get(): Choice {
        return (
          categories.find((category: Choice) => {
            return category.value == route.query.categories;
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
      const {
        ["list.highlighted"]: highlighted,
        categories,
        earn,
      } = route.query;
      const categoriesTags =
        categories && categories.length
          ? JSON.parse(categories.toString()).reduce(
              (acc: Record<string, string>, cat: string) => {
                acc[cat] = cat;
                return acc;
              },
              {}
            )
          : null;
      return {
        ...(highlighted && {
          highlighted: highlighted == "true" ? "is" : "not",
        }),
        ...(categoriesTags && { ...categoriesTags }),
        ...(earn && { earn: earn == "true" ? "is" : "not" }),
      };
    });

    return {
      isShowing,
      sorts,
      orders,
      categories,
      sizes,
      orderBy,
      sortBy,
      pageSize,
      isHighlighted,
      isEarn,
      withCategories,
      filters,
      removeFilter(name: string): void {
        const toRemove = name == "highlighted" ? "list.highlighted" : name;
        if (
          categories.map((c) => c.value).includes(name) &&
          route.query.categories
        ) {
          const newCategories = JSON.parse(
            route.query.categories.toString()
          ).filter((c: string) => {
            return c != name;
          });

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { categories, ...rest } = route.query;
          const newQuery = newCategories.length
            ? {
                ...route.query,
                categories: newCategories,
              }
            : { ...rest };
          router.push({
            path: "/media",
            replace: true,
            query: newQuery,
          });
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [toRemove]: remove, ...rest } = route.query;
          router.push({
            path: "/media",
            replace: true,
            query: {
              ...rest,
            },
          });
        }
      },
    };
  },
});
</script>
