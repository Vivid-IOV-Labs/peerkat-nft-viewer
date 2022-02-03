<template>
  <div style="height: 100%" class="card">
    <div style="height: 60%; overflow: hidden">
      <slot name="picture"></slot>
    </div>
    <div style="overflow: scroll; height: 35%" class="card-body">
      <div class="card-title mt-1"><slot name="title"></slot></div>
      <div class="card-text">
        <slot name="text"></slot>
      </div>
    </div>
    <div class="card-footer mt-auto d-flex justify-content-end pb-4">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
