<template>
  <notifications :duration="1000" position="bottom center" />
  <!-- <div
    v-if="isLoading"
    style="
      height: 100%;
      width: 100%;
      position: absolute;
      opacity: 0.8;
      top: 0;
      left: 0;
    "
    class="d-flex align-items-center justify-content-center"
  >
    <div
      class="spinner-border"
      style="width: 4rem; height: 4rem; color: #666"
      role="status"
    >
      <span class="sr-only">Loading...</span>
    </div>
  </div> -->
  <div v-if="withAuthLayout" class="h-100 d-flex flex-column">
    <auth-layout>
      <RouterView v-slot="{ Component }">
        <template v-if="Component">
          <Transition>
            <KeepAlive>
              <Suspense>
                <template #default>
                  <main-loader>
                    <component :is="Component" />
                  </main-loader>
                </template>
                <template #fallback>
                  <div
                    style="
                      height: 100%;
                      width: 100%;
                      position: absolute;
                      opacity: 0.8;
                      top: 0;
                      left: 0;
                    "
                    class="d-flex align-items-center justify-content-center"
                  >
                    <div
                      class="spinner-border"
                      style="width: 4rem; height: 4rem; color: #666"
                      role="status"
                    >
                      <span class="sr-only">Loading...</span>
                    </div>
                  </div>
                </template>
              </Suspense>
            </KeepAlive>
          </Transition>
        </template>
      </RouterView>
    </auth-layout>
  </div>
  <div v-else class="h-100">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
import MainLoader from "@/layouts/MainLoader.vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "App",
  components: {
    AuthLayout,
    MainLoader,
  },

  setup() {
    const store = useStore();
    const route = useRoute();
    const isLoading = computed(() => store.getters["ui/getIsloading"]);
    const withAuthLayout = computed(() => route.meta.withAuth);

    return { isLoading, withAuthLayout };
  },
});
</script>
<style>
.success {
  background: #3052ff !important;
  border-left-color: #3052ff !important;
}

.warn {
  background: #ffb648;
  border-left-color: #f48a06;
}

.error {
  background: #e54d42;
  border-left-color: #b82e24;
}
video[poster] {
  object-fit: cover;
  width: 100%;
  object-position: center top;
}
/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.4s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.word-break-all {
  word-break: break-all;
}
</style>
