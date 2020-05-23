<template>
  <div>
    <div
      class="card"
      @cancel="cancel"
      :key="$route.params.name"
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
              <span v-if="!isInEdit">
                <span class="badge" :class="tagsClass" :key="tag" v-for="tag in tagsDisplay">{{tag}}</span>
              </span>
            </h3>
            <h5
              class="card-subtitle mb-2 text-muted"
              v-if="!isInEdit"
              :class="descClass"
            >{{ pageTable.desc }}</h5>
            <hr />
            <div class="row">
              <div class="col-6">
                <input
                  class="form-control descInput"
                  placeholder="Short description"
                  v-model="pageTable.desc"
                  v-if="isInEdit"
                />
              </div>
              <div class="col-6">
                <multiselect
                  v-if="isInEdit"
                  id="multiple"
                  class="tagsSelect"
                  :multiple="true"
                  v-model="pageTable.tags"
                  :options="tagsArray"
                  placeholder="Add tags"
                ></multiselect>
              </div>
            </div>
            <h6
              class="sectionHeader"
              v-if="pageTable.add_desc && !isInEdit"
              @click="showAddDesc = !showAddDesc"
            >
              <i class="fas toggleSecion" :class="showAddDesc ? 'fa-caret-down' : 'fa-caret-right'"></i>
              Description
            </h6>
            <transition name="add_desc">
              <div>
                <vue-markdown
                  v-show="showAddDesc"
                  :source="pageTable.add_desc"
                  class="card-text"
                  v-if="!isInEdit"
                ></vue-markdown>
              </div>
            </transition>
            <textarea
              v-model="pageTable.add_desc"
              placeholder="Additional description (you can use Markdown!)"
              class="form-control"
              rows="2"
              @keydown.tab.prevent="handleTab($event)"
              v-if="isInEdit"
            ></textarea>
          </div>
          <button
            type="button"
            class="btn btn-circle fixedRight"
            v-if="!listMode"
            @click="editOrSave"
            :class="isInEdit ? 'btn-primary' : 'btn-light'"
          >
            <i class="fas" :class="buttonIconClass"></i>
          </button>
          <button
            type="button"
            v-if="isInEdit"
            class="btn btn-circle fixedRight cancel"
            @click="showModal"
          >
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
                  <a
                    v-if="column.constraint_types.includes('FOREIGN KEY')"
                    @click="goToRef(column.name)"
                    class="btn btn-light btn-sm reference"
                  >See reference</a>
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
        <a @click="back" class="btn btn-light">
          <i class="fas fa-arrow-left"></i>
          Back
        </a>
      </div>
    </div>
    <NoItems v-if="noItems">
      <i class="far fa-sad-cry"></i> This table does not exist or has been archived.
    </NoItems>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from "vuex";
import VueMarkdown from "vue-markdown";
import Spinner from "./Spinner.vue";
import NoItems from "./NoItems";
import { EventBus } from "../eventbus";
import * as api from "../api.js";
export default {
  name: "TableDoc",
  data() {
    return {
      isInEdit: false,
      busy: false,
      loading: false,
      showColumns: true,
      showAddDesc: true,
      pageTable: {},
      initPageTable: {},
      noItems: false
    };
  },
  components: {
    VueMarkdown,
    Spinner,
    NoItems
  },
  props: {
    listMode: { type: Boolean, default: false },
    name: String,
    schema: String,
    table: Object,
    column: String
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

    if (Object.keys(this.pageTable).length == 0) {
      this.noItems = true;
    }

    // Used JSON.stringify instead of Object.assign to deep copy nested values as well!
    this.initPageTable = JSON.parse(JSON.stringify(this.pageTable));
  },
  mounted() {
    EventBus.$on("cancel", eventData => {
      if (
        this.pageTable.name == eventData.name &&
        this.pageTable.schema == eventData.schema &&
        this.isInEdit
      ) {
        this.cancel(eventData.action);
      }
    });
  },
  computed: {
    ...mapState("tables", ["currTable", "filterText"]),
    ...mapGetters("tables", ["tagsArray"]),
    tagsDisplay() {
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
    handleTab(event) {
      if (event) {
        event.preventDefault();
        let startText = this.pageTable.add_desc.slice(
          0,
          event.target.selectionStart
        );
        let endText = this.pageTable.add_desc.slice(
          event.target.selectionStart
        );
        this.pageTable.add_desc = `${startText}\t${endText}`;
        event.target.selectionEnd = event.target.selectionStart + 1;
      }
    },
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
      this.checkForChanges(this.cancel, "cancel");
    },
    back() {
      if (!(window.history.length > 2)) {
        this.$router.push({ name: "tablefeed" });
      } else {
        this.checkForChanges(() => {
          this.$router.go(-1);
        }, "back");
      }
    },
    checkForChanges(func, action) {
      if (
        JSON.stringify(this.initPageTable) != JSON.stringify(this.pageTable)
      ) {
        EventBus.$emit("show-modal-cancel", {
          name: this.pageTable.name,
          schema: this.pageTable.schema,
          action: action
        });
      } else {
        func();
      }
    },
    reset() {
      this.pageTable = JSON.parse(JSON.stringify(this.initPageTable));
    },
    cancel(action) {
      this.isInEdit = false;
      this.reset();
      this.$modal.hide("dialog");

      if (action == "back") {
        this.$router.push({ name: "tablefeed" });
      }
    },
    columnNameClass(columnName) {
      if (
        this.listMode &&
        this.filterText != "" &&
        columnName.includes(this.filterText)
      ) {
        return "highlight";
      } else if (columnName == this.column) {
        return "pkRef";
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
    },
    goToRef(column) {
      api
        .getRefTable(this.pageTable.schema, this.pageTable.name, column)
        .then(result => {
          let data = result.data;
          this.$router.push({
            name: "table",
            params: {
              name: data.table,
              schema: data.schema,
              column: data.column
            }
          });
        })
        .catch(() => {
          this.$toasted.show("Could not find referenced table");
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.reference {
  font-size: 13px;
  margin-left: 1%;
  color: #1565c0;
  padding: 0.5%;
}

.reference:hover {
  color: var(--primary) !important;
  font-weight: bold;
}
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

.pkRef {
  color: var(--primary);
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
.table-leave-to,
.add_desc-enter,
.add_desc-leave-to {
  visibility: hidden;
  height: 0;
  margin: 0;
  padding: 0;
  opacity: 0;
}

.table-enter-active,
.table-leave-active,
.add_desc-leave-active,
.add_desc-enter-active {
  transition: all 0.3s;
}

.descInput {
  margin-bottom: 1%;
  min-height: 40px;
  display: block;
  border-radius: 5px;
  border: 1px solid #e8e8e8;
  padding-top: 8px;
  background: #fff;
  font-size: 14px;
}
</style>
