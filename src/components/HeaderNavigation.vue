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
      <!-- <h1
        class="text-center navbar-text"
        style="font-weight: bold; font-size: 1.2rem"
      >
        Hi
      </h1> -->
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
              >My Wallet</a
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
        <li class="nav-item">
          <router-link v-slot="{ navigate, href, isActive }" to="/help" custom>
            <a
              class="nav-link"
              :class="{ active: isActive }"
              :href="href"
              @click="navigate"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                style="width: 18px; height: 18px"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                /></svg
            ></a>
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
