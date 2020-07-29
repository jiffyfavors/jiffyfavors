import Vue from 'vue'
import VueGeolocation from 'vue-browser-geolocation'
import { firestorePlugin } from 'vuefire'
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';
import mixins from '../mixins/index.js'

Vue.mixin(mixins)

Vue.use(VueToast);
Vue.use(firestorePlugin)
Vue.use(VueGeolocation)

Vue.filter('toPHP', function (value) {
  if (typeof value === 'string') { value = parseFloat(value) }
  if (typeof value !== 'number') {
    return value
  }

  const formatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    currencyDisplay: 'symbol'
  })
  return formatter.format(value)
})

Vue.filter('percentage', function (value, decimals) {
  if (!value) {
    value = 0
  }

  if (!decimals) {
    decimals = 0
  }

  value = value * 100
  value = Math.round(value * 10 ** decimals) / 10 ** decimals
  value = value + '%'
  return value
})
