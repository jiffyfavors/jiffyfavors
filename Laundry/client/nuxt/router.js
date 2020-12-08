import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _89640f3c = () => interopDefault(import('../pages/account.vue' /* webpackChunkName: "pages/account" */))
const _0a4928f0 = () => interopDefault(import('../pages/bills_payment.vue' /* webpackChunkName: "pages/bills_payment" */))
const _72e680bb = () => interopDefault(import('../pages/cart.vue' /* webpackChunkName: "pages/cart" */))
const _edbd7a0e = () => interopDefault(import('../pages/food.vue' /* webpackChunkName: "pages/food" */))
const _431d9e20 = () => interopDefault(import('../pages/rides.vue' /* webpackChunkName: "pages/rides" */))
const _11fc5983 = () => interopDefault(import('../pages/shopping.vue' /* webpackChunkName: "pages/shopping" */))
const _8bc08d20 = () => interopDefault(import('../pages/transactions.vue' /* webpackChunkName: "pages/transactions" */))
const _1b8082fd = () => interopDefault(import('../pages/biller/_id/index.vue' /* webpackChunkName: "pages/biller/_id/index" */))
const _61103d7e = () => interopDefault(import('../pages/resto/_id/index.vue' /* webpackChunkName: "pages/resto/_id/index" */))
const _459dac3f = () => interopDefault(import('../pages/shop/_id/index.vue' /* webpackChunkName: "pages/shop/_id/index" */))
const _f26c25f0 = () => interopDefault(import('../pages/resto/_id/untitled_backup.vue' /* webpackChunkName: "pages/resto/_id/untitled_backup" */))
const _a094c072 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))
const _0f9b7f32 = () => interopDefault(import('../pages/_id/index.vue' /* webpackChunkName: "pages/_id/index" */))

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
    path: "/account",
    component: _89640f3c,
    name: "account"
  }, {
    path: "/bills_payment",
    component: _0a4928f0,
    name: "bills_payment"
  }, {
    path: "/cart",
    component: _72e680bb,
    name: "cart"
  }, {
    path: "/food",
    component: _edbd7a0e,
    name: "food"
  }, {
    path: "/rides",
    component: _431d9e20,
    name: "rides"
  }, {
    path: "/shopping",
    component: _11fc5983,
    name: "shopping"
  }, {
    path: "/transactions",
    component: _8bc08d20,
    name: "transactions"
  }, {
    path: "/biller/:id?",
    component: _1b8082fd,
    name: "biller-id"
  }, {
    path: "/resto/:id?",
    component: _61103d7e,
    name: "resto-id"
  }, {
    path: "/shop/:id?",
    component: _459dac3f,
    name: "shop-id"
  }, {
    path: "/resto/:id?/untitled_backup",
    component: _f26c25f0,
    name: "resto-id-untitled_backup"
  }, {
    path: "/",
    component: _a094c072,
    name: "index"
  }, {
    path: "/:id",
    component: _0f9b7f32,
    name: "id"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
