import VueRouter from "vue-router";
import Home from "./components/Home";
import TableDoc from "./components/TableDoc";

let routes = [
  {
    path: "/",
    component: Home
  },
  {
    path: "/table/:schema/:name",
    component: TableDoc,
    props: true,
    name: "table"
  }
];

export default new VueRouter({
  routes,
  linkExactActiveClass: "active" // active class for *exact* links.
});
