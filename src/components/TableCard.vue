<template>
  <router-link
    class="link"
    :to="{
              name: 'table',
              params: { name: this.table.name, schema: this.table.schema }
            }"
  >
    <div class="card h-100">
      <div class="card-body">
        <div class="d-flex justify-content-between" style="  flex-wrap: wrap;">
          <div class="tableDetails">
            <h5 class="tableName" :title="table.name">{{ table.name }}</h5>
          </div>
        </div>
        <p class="card-text">{{ mutableDesc }}</p>
        <!-- <input class="form-control" placeholder="Short description" v-model="mutableDesc" v-else /> -->
        <div class="tags">
          <span class="badge" :class="tagsClass" v-for="tag in tags">{{tag}}</span>
        </div>
        <!-- <multiselect
          v-else
          id="multiple"
          class="tagsSelect"
          :multiple="true"
          v-model="mutableTags"
          :options="options"
          placeholder="Add tags"
        ></multiselect>-->
      </div>
    </div>
  </router-link>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "TableCard",
  data() {
    return {
      // isInEdit: false,
      // mutableDesc: this.table.desc,
      // mutableTags: this.table.tags,
      // options: ["Read", "Write", "TBManager"],
      // busy: false
    };
  },
  props: {
    table: Object
  },
  computed: {
    tags() {
      return this.table.tags.length == 0 ? ["No tags"] : this.table.tags;
    },
    tagsClass() {
      return this.table.tags.length == 0 ? "noTags" : "";
    }
  }
  // methods: {
  //   ...mapActions("tables", ["updateTable"]),
  //   async save() {
  //     let newTable = Object.assign({}, this.table);
  //     newTable.desc = this.mutableDesc;
  //     newTable.tags = this.mutableTags;
  //     try {
  //       this.busy = true;
  //       await this.updateTable({ table: newTable });
  //     } catch (error) {
  //       this.reset();
  //       this.$toasted.show("Could not save changes");
  //     }
  //     this.busy = false;
  //     this.isInEdit = false;
  //   },
  //   cancel() {
  //     this.isInEdit = false;
  //     this.reset();
  //   },
  //   reset() {
  //     this.mutableDesc = this.table.desc;
  //     this.mutableTags = this.table.tags;
  //   }
  // }
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

/* .link h5:hover {
  cursor: pointer;
  font-weight: 600;
  color: #404040;
} */

.card:hover {
  cursor: pointer;
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
  font-size: 18px;
}

.tagsSelect {
  margin-bottom: 3%;
}

.button-box .btn {
  margin-right: 2%;
}
</style>
