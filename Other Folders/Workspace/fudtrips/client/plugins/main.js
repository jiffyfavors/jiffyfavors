import Vue from 'vue'
import VueGeolocation from 'vue-browser-geolocation'
import { firestorePlugin } from 'vuefire'
import VueSocialSharing from 'vue-social-sharing'
require('intersection-observer')
Vue.use(firestorePlugin)
Vue.use(VueGeolocation)
Vue.use(VueSocialSharing)
Vue.filter('toPHP', function(value) {
  if (typeof parseFloat(value) !== 'number' || isNaN(parseFloat(value))) {
    return value
  } else {
    value = parseFloat(value)
    const formatter = new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      currencyDisplay: 'symbol'
    })
    return formatter.format(Math.round(value))
  }
})
