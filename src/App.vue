<template>
  <div id="app">
    <router-view></router-view>

    <p class="credit">© Created by Jacob Kreynin 2020</p>
  </div>
</template>

<script>
import * as api from "./api.js";
import { mapActions, mapMutations } from "vuex";
export default {
  name: "app",
  data() {
    return {
      componentKey: 0,
      busy: false
    };
  },
  methods: {
    ...mapActions("tables", ["loadTables", "loadTags"]),
    ...mapMutations("tables", {
      setReadMode: "SET_READ_MODE"
    }),
    backToDefault() {
      this.setReadMode(false);
    },
    refreshTables() {
      this.busy = true;
      api
        .refresh()
        .then(() => {
          this.loadTables();
          this.loadTags();
          this.componentKey += 1;
          this.busy = false;
          this.$toasted.show("Refreshed Successfully!", {
            icon: "fa-check",
            className: "customSuccessToast"
          });
        })
        .catch(() => {
          this.$toasted.show("Could not synchronize tables");
          this.busy = false;
        });
    }
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
