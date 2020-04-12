import Vue from "vue";
import Vuex from "vuex";
import tables from "./modules/tables";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    tables
  }
});
