import VueRouter from "vue-router";
import Home from "./components/Home";
import TableDoc from "./components/TableDoc";
import Login from "./components/Login";

let routes = [
  {
    path: "/",
    component: Home,
    name: "home"
  },
  {
    path: "/login",
    component: Login,
    name: "login",
    beforeEnter: (to, from, next) => {
      if (!localStorage.getItem('user')) next()
      else next({ name: 'home' });
    }
  },
  {
    path: "/table/:schema/:name",
    component: TableDoc,
    props: true,
    name: "table"
  }
];

let router = new VueRouter({
  routes,
  linkExactActiveClass: "active" // active class for *exact* links.,
});

router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && !localStorage.getItem('user')) next({ name: 'login' })
  else next();
});

export default router;