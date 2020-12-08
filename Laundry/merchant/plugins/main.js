import Vue from 'vue'
import { firestorePlugin } from 'vuefire'
import wysiwyg from "vue-wysiwyg";
import 'vue-wysiwyg/dist/vueWysiwyg.css'
Vue.use(firestorePlugin)
Vue.use(wysiwyg, {
    hideModules: { "image": true ,"link" : true, "table":true,"code":true,"separator": true,"removeFormat":true}
});

Vue.filter('toPHP', function(value) {
  let v = value
  if (typeof value === 'string') { value = parseFloat(value) }
  if (typeof value !== 'number') {
    return value
  }
  let ret = 0;
  if (isNaN(value)) {
    ret = v
    return ret
  } else {
    return '₱ ' + parseFloat(Math.round(value)).toFixed(2)
  }
})
Vue.filter('toMoney', function(value, locale, currency) {
  if (typeof value === 'string') { value = parseFloat(value) }
  if (typeof value !== 'number') {
    return value
  }
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    currencyDisplay: 'symbol'
  })
  return formatter.format(Math.round(value))
})
Vue.filter('percentage', function(value, decimals) {
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
