import { createRouter, createWebHistory } from "vue-router";
import HeroesPage from "@/pages/HeroesPage.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [{ path: "/", redirect: "/herois" }, { path: "/herois", component: HeroesPage }],
});
