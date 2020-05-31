import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/index.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/server',
    name: 'server',
    component: () => import('../views/server.vue')
  },
  {
    path: '/group',
    name: 'group',
    component: () => import('../views/group.vue')
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: () => import('../views/log.vue')
  },
  {
    path: '/yaml',
    name: 'yaml',
    component: () => import('../views/yaml.vue')
  },
  {
    path: '/action',
    name: 'action',
    component: () => import('../views/action.vue')
  },
  {
    path: '/docker',
    name: 'docker',
    component: () => import('../views/docker.vue')
  },
  {
    path: '/docker-server',
    name: 'docker-server',
    component: () => import('../views/dockerContent.vue')
  },
  {
    path: '/kube',
    name: 'kube',
    component: () => import('../views/kube.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
