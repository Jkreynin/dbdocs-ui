<template>
  <div id="app">
    <nav class="navbar">
      <a class="navbar-brand" href="#/" @click="backToDefault">
        <i class="fas fa-database"></i>DB Docs
      </a>
      <div class="nav navbar-nav navbar-right">
        <div class="btn-nav">
          <button type="button" :disabled="busy" class="btn-refresh" @click="refreshTables">
            <i class="fas fa-sync" :class="{ 'fa-spin': busy }"></i>
          </button>
        </div>
      </div>
    </nav>
    <div class="container" id="v">
      <router-view :key="componentKey"></router-view>
    </div>
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
.navbar {
  background-color: var(--dark-grey) !important;
}

.fa-database {
  font-size: 25px;
  color: var(--secondary-main);
  display: block;
  background: -webkit-linear-gradient(var(--secondary-main), var(--main-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.navbar-brand {
  display: flex;
}

.navbar-brand,
.navbar-brand:hover {
  color: var(--main-color);
  font-family: cairoB;
}

.btn-refresh {
  background: none;
  color: white;
  font-size: 20px;
  border: none;
  font-weight: normal;
}

.btn-refresh:hover {
  color: rgb(204, 204, 204);
}

.btn-refresh:disabled {
  color: var(--main-color);
}

.navbar-brand:hover{
  cursor: pointer;
}
</style>
<style scoped>
@import "./assets/customizeBootstrap.css";
@import "./assets/app.css";
@import "./assets/table.css";
</style>
