import Vue from 'vue'
import VueGeolocation from 'vue-browser-geolocation'
import { firestorePlugin } from 'vuefire'
import VueSocialSharing from 'vue-social-sharing'
import wysiwyg from "vue-wysiwyg";
Vue.use(wysiwyg, {
    hideModules: { "image": true }
});
Vue.use(VueSocialSharing);
Vue.use(firestorePlugin)
Vue.use(VueGeolocation)
import 'vue-wysiwyg/dist/vueWysiwyg.css'
Vue.filter('toPHP', function (value) {
  if (typeof value === 'string') { value = parseFloat(value) }
  if (typeof value !== 'number') {
    return value
  }


  return '₱ '+parseFloat(Math.round(value)).toFixed(2)
})



Vue.filter('toMoney', function (value,locale,currency) {
  if (typeof value === 'string') { value = parseFloat(value) }
  if (typeof value !== 'number') {
    return value
  }

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency:currency,
    minimumFractionDigits: 2,
    currencyDisplay: 'symbol'
  })
  return formatter.format(Math.round(value))
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
