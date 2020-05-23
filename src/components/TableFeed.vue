<template>
  <div>
    <Alert />
    <Filters />
    <Tables v-if="tables.length == 0 || filteredTables.length > 0" />
    <NoItems v-else>
      <i class="fas fa-table"></i> No tables were found.
    </NoItems>
  </div>
</template>
<script>
import Filters from "./Filters.vue";
import Tables from "./Tables.vue";
import Alert from "./Alert.vue";
import NoItems from "./NoItems";
import { mapGetters, mapState } from "vuex";
export default {
  name: "TablesFeed",
  components: {
    Filters,
    Tables,
    Alert,
    NoItems
  },
  computed: {
    ...mapGetters("tables", ["filteredTables"]),
    ...mapState("tables", ["tables"])
  }
};
</script>
<style scoped>
.empty p {
  text-align: center !important;
  color: rgb(145, 145, 145);
}
</style>