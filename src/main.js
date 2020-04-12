import Vue from "vue";
import App from "./App.vue";
import routes from "./routes";
import store from "./store/store";
import VueRouter from "vue-router";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Multiselect from "vue-multiselect";
import infiniteScroll from "vue-infinite-scroll";
import Toasted from "vue-toasted";

Vue.use(Toasted, {
  iconPack: "fontawesome",
  position: "bottom-right",
  icon: "fa-exclamation-circle",
  className: "customToast",
  duration: 5000,
  closeOnSwipe: false
});

Vue.use(infiniteScroll);

// register globally
Vue.component("multiselect", Multiselect);
Vue.config.productionTip = false;
Vue.use(VueRouter);

new Vue({
  router: routes,
  store,
  render: h => h(App)
}).$mount("#app");
