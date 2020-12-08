import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _5d0a1fef = () => interopDefault(import('../pages/cart.vue' /* webpackChunkName: "pages/cart" */))
const _02a2881d = () => interopDefault(import('../pages/encoder.vue' /* webpackChunkName: "pages/encoder" */))
const _205466db = () => interopDefault(import('../pages/inspire.vue' /* webpackChunkName: "pages/inspire" */))
const _22d0a78f = () => interopDefault(import('../pages/order.vue' /* webpackChunkName: "pages/order" */))
const _8e4e546c = () => interopDefault(import('../pages/resto/_id/index.vue' /* webpackChunkName: "pages/resto/_id/index" */))
const _0a05e713 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

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
    path: "/cart",
    component: _5d0a1fef,
    name: "cart"
  }, {
    path: "/encoder",
    component: _02a2881d,
    name: "encoder"
  }, {
    path: "/inspire",
    component: _205466db,
    name: "inspire"
  }, {
    path: "/order",
    component: _22d0a78f,
    name: "order"
  }, {
    path: "/resto/:id?",
    component: _8e4e546c,
    name: "resto-id"
  }, {
    path: "/",
    component: _0a05e713,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
