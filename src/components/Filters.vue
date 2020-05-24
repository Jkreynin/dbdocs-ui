<template>
  <div>
    <div class="row filters">
      <div class="col-5">
        <input
          id="search"
          v-model="filterTextData"
          class="form-control"
          type="text"
          placeholder="Search..."
        />
      </div>
      <div class="col-6">
        <multiselect
          id="multiple"
          :multiple="true"
          v-model="filterTagsData"
          :options="tagsArray"
          placeholder="Filter by tags..."
        ></multiselect>
      </div>
      <div class="col-1">
        <div class="btn-group mr-2 btn-group-sm" role="group" aria-label="Basic example">
          <button
            type="button"
            @click="toggleReadMode"
            class="btn"
            :class="readMode ? 'btn-disabled' : 'btn-enabled'"
          >
            <i class="fas fa-th"></i>
          </button>
          <button
            type="button"
            @click="toggleReadMode"
            class="btn"
            :class="readMode ? 'btn-enabled' : 'btn-disabled'"
          >
            <i class="fas fa-book"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="row filters">
      <div class="col-5">
        <button
          type="button"
          :key="schema.name"
          @click="toggleSchema(schema)"
          v-for="schema in schemas"
          class="btn btn-sm schemabtn"
          :class="schema.active ? 'btn-enabled' : 'btn-disabled'"
        >{{schema.name}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  name: "Filters",
  data() {
    return {};
  },
  async created() {
    try {
      await this.loadSchemas();
    } catch (error) {
      this.$toasted.show("Could not load schemas");
    }
  },
  computed: {
    ...mapState("tables", ["filterText", "filterTags", "readMode", "schemas"]),
    ...mapGetters("tables", ["tagsArray"]),
    filterTextData: {
      get() {
        return this.filterText;
      },
      set(value) {
        this.setFilterText(value);
      }
    },
    filterTagsData: {
      get() {
        return this.filterTags;
      },
      set(value) {
        this.setFilterTags(value);
      }
    }
  },
  methods: {
    ...mapActions("tables", ["loadSchemas"]),
    ...mapMutations("tables", {
      setFilterText: "SET_FILTER_TEXT",
      setFilterTags: "SET_FILTER_TAGS",
      setReadMode: "SET_READ_MODE",
      setLoadMoreCounter: "SET_LOAD_MORE_COUNTER",
      setSchema: "SET_SCHEMA"
    }),
    toggleReadMode() {
      this.setReadMode(!this.readMode);
      this.setLoadMoreCounter(0);
    },
    toggleSchema(currSchema) {
      currSchema.active = !currSchema.active;
      this.setSchema(currSchema);
    }
  }
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#search {
  min-height: 40px;
  display: block;
  border-radius: 5px;
  border: 1px solid #e8e8e8;
  padding-top: 8px;
  background: #fff;
  font-size: 14px;
}

#search:focus {
  border: 1px solid #e8e8e8 !important;
}

.schemabtn{
  margin-right: 1.2%;
}

.btn-disabled {
  color: rgb(138, 138, 138) !important;
  background-color: rgb(240, 240, 240) !important;
}

.btn-enabled,
.btn-disabled:hover {
  background-color: rgb(206, 206, 206) !important;
}

.btn-enabled {
  color: var(--primary) !important;
  font-weight: bold !important;
}

.btn-primary-enabled {
  background-color: var(--primary) !important;
  color: white !important;
  font-weight: bold !important;
}

.btn-disabled:focus,
.btn-disabled:hover {
  color: rgb(99, 99, 99) !important;
}
</style>
