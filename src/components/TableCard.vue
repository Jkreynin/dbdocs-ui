<template>
  <div class="card h-100" :class="{ cardInEdit: isInEdit }">
    <div class="card-body">
      <div class="d-flex justify-content-between" style="  flex-wrap: wrap;">
        <div class="tableDetails">
          <h6 class="schema">{{ table.schema }}</h6>
          <router-link
            class="link"
            :to="{
              name: 'table',
              params: { name: this.table.name, schema: this.table.schema }
            }"
          >
            <h5 class="tableName" :style="{ fontSize: fontSize + 'px' }">{{ table.name }}</h5>
          </router-link>
        </div>

        <button
          type="button"
          class="btn btn-circle btn-light"
          @click="isInEdit = true"
          v-if="!isInEdit"
        >
          <i class="fas fa-pen"></i>
        </button>
      </div>
      <p class="card-text" :class="descClass" v-if="!isInEdit">{{ desc }}</p>
      <input class="form-control" v-model="mutableDesc" v-else />
      <div v-if="!isInEdit" class="tags">
        <span class="badge" :class="tagsClass" v-for="tag in tags">
          {{
          tag
          }}
        </span>
      </div>
      <multiselect
        v-else
        id="multiple"
        class="tagsSelect"
        :multiple="true"
        v-model="mutableTags"
        :options="options"
        placeholder="Add tags"
      ></multiselect>
      <button type="button" class="btn btn-primary btn-sm save-btn" v-if="isInEdit" @click="save">
        <i class="fas" :class="busy? 'fa-spinner fa-pulse' : 'fa-save'"></i>
        Save
      </button>
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
    }
  },
  methods: {
    ...mapActions("tables", ["updateTable"]),
    async save() {
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
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
input {
  margin-bottom: 3% !important;
}

.link {
  color: initial;
  text-decoration: none;
}

.link h5:hover {
  cursor: pointer;
  font-weight: 600;
  color: #404040;
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

.tagsSelect {
  margin-bottom: 3%;
}

.save-btn {
  width: 80px;
  min-width: 80px;
}
</style>
