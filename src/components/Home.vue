<template>
  <div>
    <nav class="navbar">
      <a class="navbar-brand" href="#/" @click="backToDefault">
        <i class="fas fa-database"></i>DB Docs
      </a>
      <div class="nav navbar-nav navbar-right">
        <div class="btn-nav">
          <!-- <button type="button" class="action-btn">
            <i class="fas fa-cog"></i>
          </button>-->
          <button type="button" :disabled="busy" class="action-btn" @click="refreshTables">
            <i class="fas fa-sync" :class="{ 'fa-spin': busy }"></i>
          </button>
        </div>
      </div>
    </nav>
    <div class="container" :key="componentKey">
      <router-view></router-view>
    </div>
    <v-dialog />
  </div>
</template>

<script>
import * as api from "../api.js";
import { mapActions, mapMutations } from "vuex";
import { EventBus } from "../eventbus";
export default {
  name: "Home",
  components: {},
  data() {
    return {
      componentKey: 0,
      busy: false
    };
  },
  mounted() {
    EventBus.$on("show-modal", payload => this.show(payload));
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
          this.$toasted.show("Synchronized Successfully!", {
            icon: "fa-check",
            className: "customSuccessToast"
          });
        })
        .catch(() => {
          this.$toasted.show("Could not synchronize tables");
          this.busy = false;
        });
    },
    show(payload) {
      this.$modal.show("dialog", {
        title: "Wait a minute...",
        text: "Are you sure you want to revert your changes?",
        styles: ["box-shadow: none!important;"],
        buttons: [
          {
            title: "Revert",
            handler: () => {
              EventBus.$emit("cancel", {
                name: payload.name,
                schema: payload.schema
              });
            }
          },
          {
            title: "Cancel"
          }
        ]
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

.action-btn {
  background: none;
  color: white;
  font-size: 20px;
  border: none;
  font-weight: normal;
}

.action-btn:hover {
  color: rgb(204, 204, 204);
}

.action-btn:disabled {
  color: var(--main-color);
}

.navbar-brand:hover {
  cursor: pointer;
}
</style>
