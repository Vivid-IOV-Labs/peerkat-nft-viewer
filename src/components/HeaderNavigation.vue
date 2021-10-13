<template>
  <nav :class="`navbar-${theme} bg-${theme}`" class="navbar sticky-top">
    <span class="navbar-brand">
      <img
        src="@/assets/img/logopeerkat.png"
        alt="Peerkat logo"
        width="40"
        height="40"
        class="d-inline-block align-top"
      />
    </span>
    <h6 style="text-transform: uppercase; font-weight: bold">
      NFT Test Wallet
    </h6>
    <div class="locale-changer">
      <select v-model="$i18n.locale">
        <option
          v-for="locale in languages"
          :key="`locale-${locale.label}`"
          :value="locale.value"
        >
          {{ locale.label }}
        </option>
      </select>
    </div>
  </nav>
  <pre>{{ urlParams }}</pre>
</template>
<script lang="ts">
import { defineComponent } from "vue";
const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);

var theme = (
  new URLSearchParams(document.location.href).get("xAppStyle") || "light"
).toLowerCase();
export default defineComponent({
  setup: () => {
    return {
      theme,
      urlParams,
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
