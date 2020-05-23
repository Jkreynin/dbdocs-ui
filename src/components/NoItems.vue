<template>
  <div class="empty">
    <p>
      <slot></slot>
    </p>
  </div>
</template>

<script>
export default {
  name: "NoItems",
  data() {
    return {};
  }
};
</script>

<style scoped>
.empty p {
  text-align: center !important;
  color: rgb(141, 141, 141);
  border: 1px solid;
  border-color: rgb(224, 224, 224);
  background-color: rgba(236, 236, 236, 0.356);
  padding: 2%;
  font-size: 17px;
}

.empty i {
  font-size: 22px!important;
}
</style>
