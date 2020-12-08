import Vue from 'vue'
import VueGeolocation from 'vue-browser-geolocation'
import { firestorePlugin } from 'vuefire'

Vue.use(firestorePlugin)
Vue.use(VueGeolocation)

Vue.filter('toPHP', function(value) {
  if (typeof parseFloat(value) != 'number' || isNaN(parseFloat(value))) {
    return value
  }else{
     value = parseFloat(value)
  var formatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    currencyDisplay: 'symbol'
  })
  return formatter.format(Math.round(value))
  }

})
