<template>
  <div id="app">
    <router-view></router-view>

    <p class="credit">© Created by Jacob Kreynin 2020</p>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {};
  }
};
</script>

<style>
.credit {
  position: fixed;
  z-index: -1;
  bottom: 0;
  left: 0;
  margin: 0;
  padding-left: 10px;
  color: #ccc;
  font-size: 12px;
}
</style>
<style scoped>
@import "./assets/customizeBootstrap.css";
@import "./assets/app.css";
@import "./assets/table.css";
</style>
