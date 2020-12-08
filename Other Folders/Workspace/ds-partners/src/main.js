import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router/'
import store  from './store/'
import './firebase'
import './registerServiceWorker'
import './assets/ta.css'
import mixins from './mixins'
Vue.config.productionTip = false

Vue.filter('toPHP', function (value) {
    if (typeof value !== "number") {
        return value;
    }
    var formatter = new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2,
        currencyDisplay:'symbol'
    });
    return formatter.format(value);
});

Vue.mixin(mixins)




new Vue({
  vuetify,
  router,
    store,
  render: h => h(App)
}).$mount('#app')
