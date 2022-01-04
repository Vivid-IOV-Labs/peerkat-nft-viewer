<template>
  <header>
    <nav
      :class="`navbar-${theme} bg-${theme}`"
      class="navbar navbar-expand-lg sticky-top justify-content-between"
    >
      <span class="navbar-brand">
        <img
          src="@/assets/img/logopeerkat.png"
          alt="Peerkat logo"
          width="40"
          height="40"
          class="d-inline-block align-top"
        />
      </span>
      <h1
        class="text-center navbar-text"
        style="font-weight: bold; font-size: 1.2rem"
      >
        Hi
      </h1>
      <ul class="nav nav-pills ml-auto">
        <li class="nav-item">
          <router-link
            v-slot="{ navigate, href, isActive }"
            to="/wallet"
            custom
          >
            <a
              class="nav-link"
              :class="{ active: isActive }"
              :href="href"
              @click="navigate"
              >Wallet</a
            >
          </router-link>
        </li>
        <li class="nav-item">
          <router-link
            v-slot="{ navigate, href, isActive }"
            to="/shared"
            custom
          >
            <a
              class="nav-link"
              :class="{ active: isActive }"
              :href="href"
              @click="navigate"
              >Shared with me</a
            >
          </router-link>
        </li>
      </ul>
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
