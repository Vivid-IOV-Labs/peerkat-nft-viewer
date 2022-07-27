import { onMounted, Ref, ref, onUnmounted } from "vue";

export default function useIntersectionObserver(
  root: Ref<Element | Document | null>,
  target: Ref<HTMLElement | null>
): any {
  const intersectionRatio = ref(0);
  const isIntersecting = ref(false);
  const isFullyInView = ref(false);
  function observe() {
    if (target.value) {
      observer.observe(target.value);
    }
  }

  let observer: IntersectionObserver;
  onMounted(() => {
    observer = new IntersectionObserver(
      ([entry]) => {
        intersectionRatio.value = entry.intersectionRatio;

        if (entry.intersectionRatio > 0) {
          isIntersecting.value = true;
          isFullyInView.value = entry.intersectionRatio >= 1;
          return;
        }

        isIntersecting.value = false;
      },
      { root: root.value, rootMargin: "0px 60px", threshold: 0 }
    );
    observe();
  });

  function unobserve() {
    console.log("UNOBSERVE");
    if (!observer) return;

    if (target.value) {
      debugger;
      observer.unobserve(target.value);
    }
  }

  onUnmounted(unobserve);

  return {
    intersectionRatio,
    isIntersecting,
    isFullyInView,
    observe,
    unobserve,
  };
}
