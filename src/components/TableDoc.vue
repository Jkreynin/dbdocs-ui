<template>
  <div class="card" :class="{cardInEdit:isInEdit}" v-if="Object.keys(this.pageTable).length != 0">
    <div class="card-body">
      <div class="d-flex justify-content-between">
        <div class="header">
          <h6 class="schema">{{pageTable.schema}}</h6>
          <h3 class="card-title">
            {{pageTable.name}}
            <span class="badge" :class="tagsClass" v-for="tag in tags">{{tag}}</span>
          </h3>
          <h5 class="card-subtitle mb-2 text-muted" :class="descClass">{{desc}}</h5>
          <vue-markdown :source="add_desc" class="card-text" v-if="!isInEdit"></vue-markdown>
          <div class="markDownArea" v-else>
            <textarea v-model="pageTable.add_desc" class="form-control" rows="2"></textarea>
            <span class="mdIcon" data-toggle="tooltip" title="Markdown">
              <i class="fab fa-markdown"></i>
            </span>
          </div>
        </div>
        <!-- v-if="!listMode" -->
        <button
          type="button"
          class="btn btn-circle"
          @click="editOrSave"
          :class="isInEdit? 'btn-primary' : 'btn-light'"
        >
          <i class="fas" :class="buttonIconClass"></i>
        </button>
      </div>

      <table class="table table-sm table-bordered">
        <thead>
          <tr>
            <th scope="col">Column name</th>
            <th scope="col">Type</th>
            <th scope="col" style="text-align:center">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="column in pageTable.columns">
            <td>
              <strong :class="columnNameClass(column.name)">{{column.name}}</strong>
            </td>
            <td>{{column.type}}</td>
            <td class="desc" v-if="!isInEdit" style="text-align:right">
              <vue-markdown :source="column.desc"></vue-markdown>
            </td>
            <td v-else>
              <div class="markDownArea">
                <textarea v-model="column.desc" class="form-control" rows="2"></textarea>
                <span class="mdIcon" data-toggle="tooltip" title="Markdown">
                  <i class="fab fa-markdown"></i>
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card-footer text-muted" v-if="!listMode">
      <a href="#/" class="btn btn-light">
        Back
        <i class="fas fa-arrow-left"></i>
      </a>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import VueMarkdown from "vue-markdown";
export default {
  name: "TableDoc",
  data() {
    return {
      isInEdit: false,
      busy: false
    };
  },
  components: {
    VueMarkdown
  },
  props: {
    listMode: { type: Boolean, default: false },
    name: String,
    schema: String,
    table: Object
  },
  async created() {
    if (!this.listMode) {
      try {
        await this.loadSingleTable({ name: this.name, schema: this.schema });
      } catch (error) {
        this.$toasted.show("Could not load table data");
      }
    }
  },
  computed: {
    ...mapState("tables", ["currTable", "filterText"]),
    pageTable() {
      return this.listMode ? this.table : this.currTable;
    },
    desc() {
      return this.pageTable.desc == ""
        ? "אין תיאור זמין..."
        : this.pageTable.desc;
    },
    add_desc() {
      return this.pageTable.add_desc == ""
        ? "אין פירוט נוסף..."
        : this.pageTable.add_desc;
    },
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
        try {
          this.busy = true;
          await this.updateTable({ table: newTable });
        } catch (error) {
          this.$toasted.show("Could not save changes");
        }
        this.busy = false;
        this.isInEdit = false;
      } else {
        this.isInEdit = true;
      }
    },
    columnNameClass(columnName) {
      if (this.filterText != "" && columnName.includes(this.filterText)) {
        return "highlight";
      } else {
        return "";
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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

.mdIcon {
  position: absolute;
  width: 16px;
  height: 16px;
  left: 6px;
  bottom: 0px;
  margin-bottom: 8px;
  opacity: 40%;
}

.markDownArea {
  position: relative;
}
</style>
