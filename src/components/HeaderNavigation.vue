<template>
  <header>
    <nav
      :class="`navbar-${theme} bg-${theme}`"
      class="navbar navbar-expand-lg sticky-top justify-content-between"
    >
      <span class="navbar-brand">
        <img
          src="@/assets/img/logopeerkat.jpg"
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
              style="padding: 0.4rem 0.6rem"
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
              style="padding: 0.4rem 0.6rem"
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
              style="padding: 0.4rem 0.8rem"
              :class="{ active: isActive }"
              :href="href"
              @click="navigate"
            >
              <span class="visually-hidden">Support</span>
              <svg
                aria-hidden="true"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                style="width: 20px; height: 20px"
                fill="none"
                viewBox="0 0 40 40"
                stroke="currentColor"
              >
                <path
                  d="M17.816 22.432C17.816 21.488 17.992 20.696 18.344 20.056C18.696 19.416 19.272 18.808 20.072 18.232L20.696 17.8C21.368 17.336 21.84 16.952 22.112 16.648C22.4 16.344 22.544 15.936 22.544 15.424C22.544 14.768 22.288 14.256 21.776 13.888C21.28 13.52 20.52 13.336 19.496 13.336C18.728 13.336 17.944 13.424 17.144 13.6C16.344 13.776 15.616 14.016 14.96 14.32V11.8C15.584 11.528 16.296 11.304 17.096 11.128C17.896 10.952 18.696 10.864 19.496 10.864C21.352 10.864 22.816 11.264 23.888 12.064C24.976 12.864 25.52 13.984 25.52 15.424C25.52 16.016 25.408 16.528 25.184 16.96C24.976 17.376 24.704 17.736 24.368 18.04C24.048 18.344 23.552 18.752 22.88 19.264C22.192 19.792 21.72 20.176 21.464 20.416C21.224 20.64 21.04 20.904 20.912 21.208C20.784 21.512 20.72 21.928 20.72 22.456V22.984H17.816V22.432ZM19.232 28.36C18.752 28.36 18.344 28.2 18.008 27.88C17.688 27.544 17.528 27.144 17.528 26.68C17.528 26.2 17.688 25.8 18.008 25.48C18.344 25.16 18.752 25 19.232 25C19.712 25 20.112 25.16 20.432 25.48C20.768 25.8 20.936 26.2 20.936 26.68C20.936 27.144 20.768 27.544 20.432 27.88C20.096 28.2 19.696 28.36 19.232 28.36Z"
                  fill="black"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="19"
                  stroke="black"
                  stroke-width="2"
                />
              </svg>
              <!-- 
              <svg
                aria-hidden="true"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                style="width: 20px; height: 20px"
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
            > -->
            </a>
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
<style>
.visually-hidden {
  clip: rect(1px, 1px, 1px, 1px);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}

.visually-hidden:focus {
  clip: auto;
  height: auto;
  overflow: auto;
  position: absolute;
  width: auto;
}
</style>
