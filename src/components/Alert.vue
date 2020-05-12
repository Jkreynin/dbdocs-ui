<template>
  <div v-if="visible">
    <div class="alert alert-dismissible fade show" role="alert">
      <i class="far" :class="icon"></i>
      <strong>{{ coverage }}% coverage ({{ haveDocs }}/{{ total }})</strong>
      <a
        class="btn btn-light btn-sm"
        @click="setUndocFilter(!undocFilterActive)"
        v-html="actionText"
      ></a>
      <button
        type="button"
        class="close"
        @click="visible = false"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="progress" style="height: 5px;">
      <div
        class="progress-bar"
        :class="color"
        role="progressbar"
        :style="{ width: coverage + '%' }"
        :aria-valuenow="coverage"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    </div>
    <br />
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from "vuex";
export default {
  name: "Alert",
  data() {
    return {
      visible: true
    };
  },
  computed: {
    ...mapState("tables", ["undocFilterActive"]),
    ...mapGetters("tables", ["coverage", "total", "haveDocs"]),
    color() {
      switch (this.quality()) {
        case "Bad":
          return "bg-danger";
        case "Meh":
          return "bg-warning";
        case "Good":
          return "bg-success";
        default:
          return "";
      }
    },
    icon() {
      switch (this.quality()) {
        case "Bad":
          return "fa-angry";
        case "Meh":
          return "fa-meh";
        case "Good":
          return "fa-smile";
        default:
          return "";
      }
    },
    actionText() {
      if (this.undocFilterActive) {
        return 'Show <b style="color:var(--primary)">all tables</b>';
      }
      return 'Show tables with <b style="color:var(--danger)">no docs</b>';
    }
  },
  methods: {
    ...mapMutations("tables", {
      setUndocFilter: "SET_UNDOC_FILTER"
    }),
    quality() {
      if (this.coverage >= 80) {
        return "Good";
      } else if (this.coverage < 80 && this.coverage > 60) {
        return "Meh";
      } else {
        return "Bad";
      }
    }
  }
};
</script>

<style scoped>
.text-center {
  margin-top: 20px;
}

.alert {
  background-color: white;
  margin-bottom: 0;
  border-top: 1.1px solid #e5e5e5;
  border-left: 1px solid #f1f1f1;
  border-right: 1px solid #f1f1f1;
}

i {
  margin-right: 5px;
  font-size: 19px;
}

.btn {
  margin-left: 1%;
}
</style>
