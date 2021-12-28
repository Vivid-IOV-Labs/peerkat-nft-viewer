<template>
  <header>
    <nav :class="`navbar-${theme} bg-${theme}`" class="navbar sticky-top">
      <span class="navbar-brand col">
        <img
          src="@/assets/img/logopeerkat.png"
          alt="Peerkat logo"
          width="40"
          height="40"
          class="d-inline-block align-top"
        />
      </span>
      <h1 class="col text-center" style="font-weight: bold; font-size: 1.2rem">
        Welcome
      </h1>
      <div class="col"></div>
    </nav>
  </header>
</template>
<script lang="ts">
import { defineComponent } from "vue";

var theme = (
  new URLSearchParams(document.location.href).get("xAppStyle") || "light"
).toLowerCase();
export default defineComponent({
  setup: () => {
    return {
      theme,
      languages: [
        { label: "EN", value: "en" },
        { label: "EL", value: "el" },
        { label: "DE", value: "de" },
        { label: "IT", value: "it" },
      ],
    };
  },
});
</script>
