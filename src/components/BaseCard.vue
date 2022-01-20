<template>
  <div class="card">
    <slot name="picture"></slot>
    <div style="overflow: scroll" class="card-body">
      <div class="card-title"><slot name="title"></slot></div>
      <div class="card-text">
        <slot name="text"></slot>
      </div>
    </div>
    <div class="card-footer mt-auto d-flex justify-content-end pb-4">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
