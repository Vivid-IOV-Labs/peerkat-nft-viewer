<template>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="col-sm-4">
          <slot name="picture"></slot>
        </div>
        <div class="col-sm-8">
          <div class="card-title"><slot name="title"></slot></div>
          <div class="card-text">
            <slot name="text"></slot>
          </div>
        </div>
      </div>
    </div>
    <div class="card-footer mt-auto d-flex justify-content-end">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
