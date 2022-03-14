import { onMounted, Ref, ref, onUnmounted } from "vue";

export default function useIntersectionObserver(
  root: Ref<Element | Document | null>,
  target: Ref<HTMLElement | null>,
  //cbk: () => Promise<void>,
  options: IntersectionObserverInit = {
    root: document.getElementById("scroller"),
    rootMargin: "180px",
    threshold: 0,
  }
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
      { root: root.value, rootMargin: "0px 280px" }
    );
    observe();
  });

  function unobserve() {
    if (!observer) return;

    if (target.value) {
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
