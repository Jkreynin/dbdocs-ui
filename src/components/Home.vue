<template>
  <div>
    <alert/>
    <Filters/>
     <Tables/>
  </div>
</template>

<script>
import Filters from "./Filters.vue";
import Tables from "./Tables.vue";
import TableDoc from "./TableDoc.vue"
import Alert from "./Alert.vue";

export default {
  name: "Home",
  components: {
    Filters,
    Tables,
    Alert,
    TableDoc
  }
};
</script>

<style>
</style>
