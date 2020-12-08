import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _44d623db = () => interopDefault(import('../pages/login.vue' /* webpackChunkName: "pages/login" */))
const _224af03a = () => interopDefault(import('../pages/orders.vue' /* webpackChunkName: "pages/orders" */))
const _0e8fcba0 = () => interopDefault(import('../pages/stores.vue' /* webpackChunkName: "pages/stores" */))
const _055f6a20 = () => interopDefault(import('../pages/voucher.vue' /* webpackChunkName: "pages/voucher" */))
const _39f832ea = () => interopDefault(import('../pages/menu/_id/index.vue' /* webpackChunkName: "pages/menu/_id/index" */))
const _7b2e80c4 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/login",
    component: _44d623db,
    name: "login"
  }, {
    path: "/orders",
    component: _224af03a,
    name: "orders"
  }, {
    path: "/stores",
    component: _0e8fcba0,
    name: "stores"
  }, {
    path: "/voucher",
    component: _055f6a20,
    name: "voucher"
  }, {
    path: "/menu/:id",
    component: _39f832ea,
    name: "menu-id"
  }, {
    path: "/",
    component: _7b2e80c4,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
