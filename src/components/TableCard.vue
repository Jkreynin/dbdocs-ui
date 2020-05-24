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
            <h5 class="tableName" :title="table.name">{{ table.name }}</h5>
          </router-link>
        </div>

        <button
          type="button"
          class="btn btn-circle fixedRight btn-light"
          @click="isInEdit = true"
          v-if="!isInEdit"
        >
          <i class="fas fa-pen"></i>
        </button>
        <button
          type="button"
          v-if="!isInEdit"
          @click="handleDelete()"
          class="btn btn-circle fixedRight hide btn-light"
        >
          <i class="far fa-trash-alt"></i>
        </button>
      </div>
      <p class="card-text" v-if="!isInEdit">{{ mutableDesc }}</p>
      <input class="form-control" placeholder="Short description" v-model="mutableDesc" v-else />
      <div v-if="!isInEdit" class="tags">
        <span class="badge" :class="tagsClass" v-for="tag in displayTags">
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
        :options="tagsArray"
        placeholder="Add tags"
      ></multiselect>
      <div class="button-box">
        <button type="button" class="btn btn-primary btn-sm" v-if="isInEdit" @click="save">
          <i class="fas" :class="busy? 'fa-spinner fa-pulse' : 'fa-save'"></i>
          Save
        </button>
        <button type="button" class="btn cancel btn-sm" v-if="isInEdit" @click="cancel">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { EventBus } from "../eventbus";
export default {
  name: "TableCard",
  data() {
    return {
      isInEdit: false,
      mutableDesc: this.table.desc,
      mutableTags: this.table.tags,
      busy: false
    };
  },
  mounted() {
    EventBus.$on("delete", eventData => {
      if (
        this.table.name == eventData.name &&
        this.table.schema == eventData.schema
      ) {
        this.delete(eventData);
      }
    });
  },
  props: {
    table: Object
  },
  computed: {
    ...mapGetters("tables", ["tagsArray"]),
    displayTags() {
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
    ...mapActions("tables", ["updateTable", "changeTableStatus"]),
    async save() {
      let newTable = Object.assign({}, this.table);
      newTable.desc = this.mutableDesc;
      newTable.tags = this.mutableTags;
      try {
        this.busy = true;
        await this.updateTable({ table: newTable });
      } catch (error) {
        this.reset();
        this.$toasted.show("Could not save changes");
      }
      this.busy = false;
      this.isInEdit = false;
    },
    cancel() {
      this.isInEdit = false;
      this.reset();
    },
    reset() {
      this.mutableDesc = this.table.desc;
      this.mutableTags = this.table.tags;
    },
    handleDelete() {
      EventBus.$emit("show-modal-delete", {
        name: this.table.name,
        schema: this.table.schema
      });
    },
    async delete(tableToDelete) {
      try {
        await this.changeTableStatus({
          schema: tableToDelete.schema,
          name: tableToDelete.name,
          status: { type: "deleted" }
        });
      } catch (error) {
        this.$toasted.show("Could not save changes");
      }

      this.$modal.hide("dialog");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hide {
  right: 52px !important;
}

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
