import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router/'
import store from './store/'
import './registerServiceWorker'
import VueAnalytics from 'vue-analytics'
import './assets/ta.css'
Vue.use(VueAnalytics, {
    id: 'UA-120911065-3',
    router
})
Vue.config.productionTip = false


Vue.filter('toPHP', function(value) {

  if(typeof value ==="string")
      value = parseFloat(value)
    if (typeof value !== "number") {
        return value;
    }

    var cur = 'PHP';
    if (store.getters.getCurrency) {
        cur =store.getters.getCurrency
        if (cur != 'PHP') {
            var rates = JSON.parse(localStorage.getItem('vuex')).exchange

            for (var i = 0; i < rates.length; i++) {
                // look for the entry with a matching `code` value
                if (rates[i].code == cur) {
                    value = parseFloat(value * rates[i].rate_new).toFixed(2)
                }
            }

        }
    }




    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: cur,
        minimumFractionDigits: 0,
        currencyDisplay: 'code'
    });
    return formatter.format(Math.round(value));
});

new Vue({
    vuetify,
    router,
    store,
    render: h => h(App)
}).$mount('#app')