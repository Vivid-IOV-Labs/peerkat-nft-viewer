<template>
  <!-- <ul class="nav nav-tabs">
    <li class="nav-item">
      <router-link
        v-slot="{ navigate, href, isActive }"
        to="offers/sell"
        custom
      >
        <a
          class="nav-link"
          style="padding: 0.4rem 0.6rem"
          :class="{ active: isActive }"
          :href="href"
          @click="navigate"
          >sell</a
        >
      </router-link>
    </li>
    <li class="nav-item">
      <router-link v-slot="{ navigate, href, isActive }" to="offers/buy" custom>
        <a
          class="nav-link"
          style="padding: 0.4rem 0.6rem"
          :class="{ active: isActive }"
          :href="href"
          @click="navigate"
          >Buy</a
        >
      </router-link>
    </li>
    <li class="nav-item">
      <router-link
        v-slot="{ navigate, href, isActive }"
        to="offers/sharedoffers"
        custom
      >
        <a
          class="nav-link"
          style="padding: 0.4rem 0.6rem"
          :class="{ active: isActive }"
          :href="href"
          @click="navigate"
          >Offers Shared with me</a
        >
      </router-link>
    </li>
  </ul> -->
  <router-view></router-view>
</template>
