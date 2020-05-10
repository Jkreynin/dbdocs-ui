<template>
  <div>
    <Alert />
    <Filters />
    <Tables />
  </div>
</template>
<script>
import Filters from "./Filters.vue";
import Tables from "./Tables.vue";
import Alert from "./Alert.vue";

export default {
  name: "TablesFeed",
  components: {
    Filters,
    Tables,
    Alert
  }
};
</script>