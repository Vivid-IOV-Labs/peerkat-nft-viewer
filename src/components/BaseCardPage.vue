<template>
  <div class="card mt-4">
    <div class="card-body">
      <div class="row align-items-center">
        <div class="col-sm-5 card-img">
          <slot name="picture"></slot>
        </div>
        <div class="col-sm-7">
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
