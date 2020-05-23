<template>
  <div>
    <nav class="navbar">
      <a class="navbar-brand" @click="backToDefault">
        <i class="fas fa-database"></i>DB Docs
      </a>
      <div class="nav navbar-nav navbar-right">
        <div class="btn-nav">
          <router-link class="link" :to="{name: 'settings'}">
            <button type="button" class="action-btn">
              <i class="fas fa-cog"></i>
            </button>
          </router-link>
          <button type="button" :disabled="busy" class="action-btn" @click="refreshTables">
            <i class="fas fa-sync" :class="{ 'fa-spin': busy }"></i>
          </button>
        </div>
      </div>
    </nav>
    <div class="container" :key="componentKey">
      <router-view :key="$route.fullPath"></router-view>
    </div>
    <v-dialog />
    <modal name="delete">Hi</modal>
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
    EventBus.$on("show-modal-cancel", payload => this.showCancel(payload));
    EventBus.$on("show-modal-delete", payload => this.showDelete(payload));
    EventBus.$on("show-modal-save", payload => this.showSave(payload));
  },
  methods: {
    ...mapActions("tables", ["loadTables", "loadTags"]),
    ...mapMutations("tables", {
      setReadMode: "SET_READ_MODE"
    }),
    backToDefault() {
      this.setReadMode(false);
      this.$router.push({ name: "tablefeed" });
    },
    refreshTables() {
      this.busy = true;
      api
        .refresh()
        .then(result => {
          this.loadTables();
          this.loadTags();
          this.componentKey += 1;
          this.busy = false;

          let message = this.calculatedNumbers(result.data);
          this.$toasted.show(`Synchronized Successfully! ${message}`, {
            icon: "fa-check",
            className: "customSuccessToast"
          });
        })
        .catch(() => {
          this.$toasted.show("Could not synchronize tables");
          this.busy = false;
        });
    },
    calculatedNumbers(data) {
      let message = "";
      if (data.tables != 0) {
        message += `${this.parseNumber(data.tables)} Tables `;
      }

      if (data.columns != 0) {
        message += `${this.parseNumber(data.columns)} Columns `;
      }

      if (message == "") {
        message = "No changes";
      }
      return message;
    },
    parseNumber(number) {
      return number > 0 ? `+${number}` : number;
    },
    showCancel(payload) {
      this.$modal.show("dialog", {
        title: "Wait a minute...",
        text: "Are you sure you want to <b style='color: var(--red)'>revert</b> your changes?",
        styles: ["box-shadow: none!important;"],
        buttons: [
          {
            title: "Revert",
            handler: () => {
              EventBus.$emit("cancel", {
                name: payload.name,
                schema: payload.schema,
                action: payload.action
              });
            }
          },
          {
            title: "Cancel"
          }
        ]
      });
    },
    showDelete(payload) {
      this.$modal.show("dialog", {
        title: "Wait a minute...",
        text: `Are you sure you want to <b style='color: var(--red)'>archive</b> <b>${payload.schema}.${payload.name}</b> docs?`,
        buttons: [
          {
            title: "Archive",
            handler: () => {
              EventBus.$emit("delete", {
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
    },
    showSave(payload) {
      this.$modal.show("dialog", {
        text: "Addd changes?"
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
  color: var(--main-color)!important;
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
