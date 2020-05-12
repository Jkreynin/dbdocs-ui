<template>
  <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
    <spinner v-if="spin" />
    <div class="row" v-if="!readMode">
      <div class="col-4" :key="table.schema+table.name" v-for="table in trimmedTables">
        <table-card :table="table" />
      </div>
    </div>
    <div v-for="table in trimmedTables" :key="table.schema+table.name" v-else>
      <table-doc :table="table" :listMode="true"></table-doc>
    </div>
  </div>
</template>

<script>
import TableCard from "./TableCard.vue";
import TableDoc from "./TableDoc.vue";
import Spinner from "./Spinner.vue";
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "Tables",
  data() {
    return {
      spin: false,
      isExecuted: false,
      busy: false
    };
  },
  components: {
    TableCard,
    Spinner,
    TableDoc
  },
  computed: {
    ...mapGetters("tables", [
      "filteredTables",
      "initResultsAmount",
      "loadMoreAmount"
    ]),
    ...mapState("tables", ["readMode", "loadMoreCounter"]),
    trimmedTables() {
      return this.filteredTables.slice(
        0,
        this.initResultsAmount + this.loadMoreAmount * this.loadMoreCounter
      );
    }
  },
  async created() {
    this.spin = true;
    try {
      await this.loadTables();
    } catch (er) {
      this.$toasted.show("Could not load tables");
    }
    this.spin = false;
  },
  methods: {
    ...mapActions("tables", ["loadTables"]),
    ...mapMutations("tables", {
      setloadMoreCounter: "SET_LOAD_MORE_COUNTER"
    }),
    loadMore() {
      if (this.filteredTables.length > this.initResultsAmount) {
        this.busy = true;

        setTimeout(() => {
          let update = this.loadMoreCounter + 1;
          this.setloadMoreCounter(update);
          this.busy = false;
        }, 200);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.col-4 {
  margin-bottom: 1%;
}
</style>
