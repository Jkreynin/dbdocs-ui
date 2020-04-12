<template>
  <div class="card h-100" :class="{cardInEdit:isInEdit}">
    <div class="card-body">
      <div class="d-flex justify-content-between" style="  flex-wrap: wrap;">
        <div class="tableDetails">
          <h6 class="schema">{{table.schema}}</h6>
          <router-link
            class="link"
            :to="{ name: 'table', params: { name: this.table.name, schema: this.table.schema } }"
          >
            <h5 class="tableName" :style="{ fontSize: fontSize + 'px' }">{{table.name}}</h5>
          </router-link>
        </div>

        <button
          type="button"
          class="btn btn-circle"
          @click="editOrSave"
          :class="isInEdit? 'btn-primary' : 'btn-light'"
        >
          <i class="fas" :class="buttonIconClass"></i>
        </button>
      </div>
      <p class="card-text" :class="descClass" v-if="!isInEdit">{{desc}}</p>
      <textarea v-model="mutableDesc" class="form-control" rows="2" v-else></textarea>

      <div v-if="!isInEdit" class="tags">
        <span class="badge" :class="tagsClass" v-for="tag in tags">{{tag}}</span>
      </div>
      <multiselect
        v-else
        id="multiple"
        :multiple="true"
        v-model="mutableTags"
        :options="options"
        placeholder="Add tags"
      ></multiselect>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "TableCard",
  data() {
    return {
      isInEdit: false,
      mutableDesc: this.table.desc,
      mutableTags: this.table.tags,
      options: ["Read", "Write", "TBManager"],
      busy: false
    };
  },
  props: {
    table: Object
  },
  computed: {
    fontSize() {
      if (this.table.name.length > 20) {
        return 15;
      } else {
        return 19;
      }
    },
    desc() {
      return this.table.desc == "" ? "אין תיאור זמין..." : this.mutableDesc;
    },
    tags() {
      return this.table.tags.length == 0 ? ["No tags"] : this.table.tags;
    },
    descClass() {
      return this.table.desc == "" ? "noDesc" : "";
    },
    tagsClass() {
      return this.table.tags.length == 0 ? "noTags" : "";
    },
    buttonIconClass() {
      if (this.isInEdit) {
        if (this.busy) {
          return "fa-spinner fa-spin";
        } else {
          return "fa-save";
        }
      } else {
        return "fa-pen";
      }
    }
  },
  methods: {
    ...mapActions("tables", ["updateTable"]),
    async editOrSave() {
      if (this.isInEdit) {
        let newTable = Object.assign({}, this.table);
        newTable.desc = this.mutableDesc;
        newTable.tags = this.mutableTags;
        try {
          this.busy = true;
          await this.updateTable({ table: newTable });
        } catch (error) {
          this.$toasted.show("Could not save changes");
          this.mutableDesc = this.table.desc;
          this.mutableTags = this.table.tags;
        }
        this.busy = false;
        this.isInEdit = false;
      } else {
        this.isInEdit = true;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
textarea {
  margin-bottom: 3% !important;
}

.link {
  color: initial;
  text-decoration: none;
}

.link h5:hover {
  font-weight: 600;
  opacity: 85%;
}

.card:hover {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.tableDetails {
  white-space: nowrap;
  overflow: hidden;
}

.tableName {
  min-width: 0;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
