import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

export default function useFilters(): Record<string, any> {
  const router = useRouter();
  const route = useRoute();
  const store = useStore();
  function setQuery(
    addQuery: Record<string, string | number | undefined>
  ): void {
    const resetPage = { page: 1 };
    if ("earn" in addQuery) {
      delete route.query["list.highlighted"];
    }
    if ("list.highlighted" in addQuery) {
      delete route.query["earn"];
    }
    const newQuery = { ...route.query, ...resetPage, ...addQuery };
    router.push({
      path: "/media",
      replace: true,
      query: newQuery,
    });
    store.dispatch("nft/setQuery", newQuery);
  }
  return {
    setQuery,
  };
}
