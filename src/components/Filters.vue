<template>
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
        :options="tags"
        placeholder="Add tags"
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
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "Filters",
  data() {
    return {};
  },
  async created() {
    try {
      await this.loadTags();
    } catch (error) {
      this.$toasted.show("Could not load tags");
    }
  },
  computed: {
    ...mapState("tables", ["filterText", "filterTags", "readMode", "tags"]),
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
    ...mapActions("tables", ["loadTags"]),
    ...mapMutations("tables", {
      setFilterText: "SET_FILTER_TEXT",
      setFilterTags: "SET_FILTER_TAGS",
      setReadMode: "SET_READ_MODE",
      setLoadMoreCounter: "SET_LOAD_MORE_COUNTER"
    }),
    toggleReadMode() {
      this.setReadMode(!this.readMode);
      this.setLoadMoreCounter(0);
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
  border: 1px solid #e8e8e8!important;
}

.multiselect__placeholder {
  padding: 0;
}

.custom-control-label {
  color: var(--dark-grey);
}

.multiselect__tag {
  background: var(--main-color);
}

.multiselect__tag i:hover {
  background: var(--darker-main);
}

.multiselect__tag-icon:after {
  color: white;
}

.btn-disabled {
  color: rgb(138, 138, 138) !important;
  background-color: rgb(240, 240, 240) !important;
}

.btn-enabled,
.btn-disabled:focus,
.btn-disabled:hover {
  background-color: rgb(206, 206, 206) !important;
}

.btn-enabled {
  color: var(--primary) !important;
}

.btn-disabled:focus,
.btn-disabled:hover {
  color: rgb(99, 99, 99) !important;
}
</style>
