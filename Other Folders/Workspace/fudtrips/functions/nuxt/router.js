import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _0ed7c844 = () => interopDefault(import('../pages/bills_payment.vue' /* webpackChunkName: "pages/bills_payment" */))
const _85d810b6 = () => interopDefault(import('../pages/cart.vue' /* webpackChunkName: "pages/cart" */))
const _59628c3a = () => interopDefault(import('../pages/food.vue' /* webpackChunkName: "pages/food" */))
const _09604b6d = () => interopDefault(import('../pages/shopping.vue' /* webpackChunkName: "pages/shopping" */))
const _cdf6b34c = () => interopDefault(import('../pages/transactions.vue' /* webpackChunkName: "pages/transactions" */))
const _1a1e2a32 = () => interopDefault(import('../pages/biller/_id/index.vue' /* webpackChunkName: "pages/biller/_id/index" */))
const _59439f58 = () => interopDefault(import('../pages/resto/_id/index.vue' /* webpackChunkName: "pages/resto/_id/index" */))
const _0209f2ae = () => interopDefault(import('../pages/shop/_id/index.vue' /* webpackChunkName: "pages/shop/_id/index" */))
const _a991f3c6 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

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
    path: "/bills_payment",
    component: _0ed7c844,
    name: "bills_payment"
  }, {
    path: "/cart",
    component: _85d810b6,
    name: "cart"
  }, {
    path: "/food",
    component: _59628c3a,
    name: "food"
  }, {
    path: "/shopping",
    component: _09604b6d,
    name: "shopping"
  }, {
    path: "/transactions",
    component: _cdf6b34c,
    name: "transactions"
  }, {
    path: "/biller/:id?",
    component: _1a1e2a32,
    name: "biller-id"
  }, {
    path: "/resto/:id?",
    component: _59439f58,
    name: "resto-id"
  }, {
    path: "/shop/:id?",
    component: _0209f2ae,
    name: "shop-id"
  }, {
    path: "/",
    component: _a991f3c6,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
