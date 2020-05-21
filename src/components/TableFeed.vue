<template>
  <div>
    <Alert />
    <Filters />
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <a class="nav-link active" href="#">tbcommon</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">emet</a>
      </li>
    </ul>
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
<style scoped>
.nav {
  border-bottom: none !important;
}

.nav-item .active {
  border: 1px solid #e9e9e9 !important;
  border-bottom: none !important;
  font-weight: bold;
}

.nav-item a.active {
  color: var(--primary)!important;
}

.nav-item a {
  color: #ccc !important;
}
</style>