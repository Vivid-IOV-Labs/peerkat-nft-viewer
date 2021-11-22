<template>
  <div class="card">
    <div class="card-body">
      <div class="card-title"><slot name="title"></slot></div>
      <div class="card-text">
        <slot name="text"></slot>
      </div>
    </div>
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
