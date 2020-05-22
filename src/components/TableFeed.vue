<template>
  <div>
    <Alert />
    <Filters />
    <Tables v-if="tables.length == 0 || filteredTables.length > 0" />
    <div class="empty" v-else>
      <hr />
      <p>
        <i class="fas fa-search"></i> No tables were found...
      </p>
      <hr />
    </div>
  </div>
</template>
<script>
import Filters from "./Filters.vue";
import Tables from "./Tables.vue";
import Alert from "./Alert.vue";
import { mapGetters, mapState } from "vuex";
export default {
  name: "TablesFeed",
  components: {
    Filters,
    Tables,
    Alert
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