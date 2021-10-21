<template>
  <header>
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
      <h1
        style="text-transform: uppercase; font-weight: bold; font-size: 0.9rem"
      >
        NFT Test Wallet
      </h1>
      <div class="locale-changer">
        <base-select
          id="lang"
          v-model="$i18n.locale"
          :choices="languages"
          label-text="Lang"
          as-val="true"
          label-hidden="true"
        ></base-select>
      </div>
    </nav>
  </header>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import BaseSelect from "@/components/BaseSelect.vue";

var theme = (
  new URLSearchParams(document.location.href).get("xAppStyle") || "light"
).toLowerCase();
export default defineComponent({
  components: {
    BaseSelect,
  },
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
