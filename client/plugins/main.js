import Vue from 'vue'
import VueGeolocation from 'vue-browser-geolocation'
import { firestorePlugin } from 'vuefire'
import VueSocialSharing from 'vue-social-sharing'
import NavDrawer from '~/components/NavDrawer.vue'
require('intersection-observer')
Vue.use(NavDrawer)
Vue.use(firestorePlugin)
Vue.use(VueGeolocation)
Vue.use(VueSocialSharing)
Vue.component('nav-drawer', NavDrawer)
Vue.filter('toPHP', function(value) {
  if (typeof value === 'string') { value = parseFloat(value) }
  if (typeof value !== 'number') {
    return value
  }
  return '₱ ' + parseFloat(Math.round(value)).toFixed(2)
})
