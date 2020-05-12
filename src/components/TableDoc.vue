<template>
  <div
    class="card"
    @cancel="cancel"
    :key="componentKey"
    :class="{ cardInEdit: isInEdit }"
    v-if="Object.keys(this.pageTable).length != 0"
  >
    <div class="card-body" v-if="loading">
      <spinner class="spinner" />
    </div>

    <div class="card-body" v-else>
      <div class="d-flex justify-content-between">
        <div class="header">
          <h6 class="schema">{{ pageTable.schema }}</h6>
          <h3 class="card-title">
            {{ pageTable.name }}
            <span
              class="badge"
              :class="tagsClass"
              :key="tag"
              v-for="tag in tags"
            >
              {{
              tag
              }}
            </span>
          </h3>
          <h5 class="card-subtitle mb-2 text-muted" :class="descClass">{{ pageTable.desc }}</h5>
          <vue-markdown :source="pageTable.add_desc" class="card-text" v-if="!isInEdit"></vue-markdown>
          <textarea
            v-model="pageTable.add_desc"
            placeholder="Additional description (you can use Markdown!)"
            class="form-control"
            rows="2"
            v-else
          ></textarea>
        </div>
        <button
          type="button"
          class="btn btn-circle"
          @click="editOrSave"
          :class="isInEdit ? 'btn-primary' : 'btn-light'"
        >
          <i class="fas" :class="buttonIconClass"></i>
        </button>
        <button type="button" v-if="isInEdit" class="btn btn-circle cancel" @click="showModal">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <h6 class="sectionHeader" @click="showColumns = !showColumns">
        <i class="fas toggleSecion" :class="showColumns ? 'fa-caret-down' : 'fa-caret-right'"></i>
        Columns
      </h6>
      <transition name="table">
        <table class="table table-sm table-bordered" v-show="showColumns">
          <thead>
            <tr>
              <th scope="col">Column name</th>
              <th scope="col">Type</th>
              <th scope="col" style="text-align:center">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="column in pageTable.columns" :key="column.name">
              <td>
                <strong :class="columnNameClass(column.name)">{{column.name}}</strong>
                <span v-if="column.constraint_types">
                  <i
                    class="key fas"
                    :title="type"
                    v-for="type in column.constraint_types"
                    :key="type"
                    :class="keyClass(type)"
                  ></i>
                </span>
              </td>
              <td>{{ column.type }}</td>
              <td class="desc" v-if="!isInEdit" style="text-align:right">
                <p>{{column.desc}}</p>
              </td>
              <td v-else>
                <textarea v-model="column.desc" class="form-control" rows="2"></textarea>
              </td>
            </tr>
          </tbody>
        </table>
      </transition>
    </div>
    <div class="card-footer text-muted" v-if="!listMode && !loading">
      <a href="#/" class="btn btn-light">
        <i class="fas fa-arrow-left"></i>
        Back
      </a>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import VueMarkdown from "vue-markdown";
import Spinner from "./Spinner.vue";
import { EventBus } from "../eventbus";
export default {
  name: "TableDoc",
  data() {
    return {
      isInEdit: false,
      busy: false,
      loading: false,
      showColumns: true,
      componentKey: 0,
      pageTable: {},
      initPageTable: {}
    };
  },
  components: {
    VueMarkdown,
    Spinner
  },
  props: {
    listMode: { type: Boolean, default: false },
    name: String,
    schema: String,
    table: Object
  },
  async created() {
    if (!this.listMode) {
      this.loading = true;
      try {
        await this.loadSingleTable({ name: this.name, schema: this.schema });
        this.loading = false;
        this.pageTable = this.currTable;
      } catch (error) {
        this.$toasted.show("Could not load table data");
        this.loading = false;
      }
    } else {
      this.pageTable = this.table;
    }

    // Used JSON.stringify instead of Object.assign to deep copy nested values as well!
    this.initPageTable = JSON.parse(JSON.stringify(this.pageTable));
  },
  mounted() {
    EventBus.$on("cancel", tableData => {
      if (
        this.pageTable.name == tableData.name &&
        this.pageTable.schema == tableData.schema &&
        this.isInEdit
      ) {
        this.cancel();
      }
    });
  },
  computed: {
    ...mapState("tables", ["currTable", "filterText"]),
    tags() {
      let def = ["No tags"];
      try {
        return this.pageTable.tags.length == 0 ? def : this.pageTable.tags;
      } catch {
        return def;
      }
    },
    descClass() {
      return this.pageTable.desc == "" ? "noDesc" : "";
    },
    tagsClass() {
      let def = "noTags";
      try {
        return this.pageTable.tags.length == 0 ? def : "";
      } catch {
        return def;
      }
    },
    buttonIconClass() {
      if (this.isInEdit) {
        if (this.busy) {
          return "fa-spinner fa-pulse";
        } else {
          return "fa-save";
        }
      } else {
        return "fa-pen";
      }
    }
  },
  methods: {
    ...mapActions("tables", ["updateTable", "loadSingleTable"]),
    async editOrSave() {
      if (this.isInEdit) {
        let newTable = Object.assign({}, this.pageTable);
        this.initPageTable = JSON.parse(JSON.stringify(this.pageTable));
        try {
          this.busy = true;
          await this.updateTable({ table: newTable });
        } catch (error) {
          this.reset();
          this.$toasted.show("Could not save changes");
        }
        this.busy = false;
        this.isInEdit = false;
      } else {
        this.isInEdit = true;
      }
    },
    showModal() {
      EventBus.$emit("show-modal", {
        name: this.pageTable.name,
        schema: this.pageTable.schema
      });
    },
    reset() {
      this.pageTable = JSON.parse(JSON.stringify(this.initPageTable));
    },
    cancel() {
      this.isInEdit = false;
      this.reset();
      this.$modal.hide("dialog");
    },
    columnNameClass(columnName) {
      if (
        this.listMode &&
        this.filterText != "" &&
        columnName.includes(this.filterText)
      ) {
        return "highlight";
      } else {
        return "";
      }
    },
    keyClass(constraint_type) {
      switch (constraint_type) {
        case "PRIMARY KEY":
          return "pk fa-key";
        case "UNIQUE":
          return "unique fa-fingerprint";
        case "FOREIGN KEY":
          return "fk fa-key";
        default:
          return "";
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btn-circle {
  font-size: 16px !important;
  width: 35px !important;
  min-width: 35px !important;
  height: 35px !important;
  border-radius: 20px !important;
}

.cancel {
  right: 52px !important;
}
.card {
  margin-bottom: 3%;
}
.badge {
  font-size: 14px;
}

.header {
  width: 100%;
}

th {
  color: rgb(138, 138, 138);
  font-weight: 500;
  background-color: rgb(240, 240, 240);
}

td {
  color: #616161;
}

table {
  margin-top: 2%;
}

.desc {
  font-size: 13px;
}

.schema {
  font-size: 16px;
}

.highlight {
  color: var(--orange);
}

.key {
  font-size: 13px;
  margin-left: 1%;
}

.key:hover {
  cursor: help;
}

.pk {
  color: #ffd600 !important;
}

.fk {
  color: var(--info) !important;
}

.unique {
  color: var(--success) !important;
}

.key {
  font-size: 13px;
  color: #ffd600;
  margin-left: 1%;
}

.spinner {
  margin: auto;
}

.sectionHeader {
  color: rgba(0, 0, 0, 0.4);
  transition: 0.4s;
}

.sectionHeader:hover {
  color: rgb(68, 68, 68);
  cursor: pointer;
}

.table-enter,
.table-leave-to {
  visibility: hidden;
  height: 0;
  margin: 0;
  padding: 0;
  opacity: 0;
}

.table-enter-active,
.table-leave-active {
  transition: all 0.3s;
}
</style>
