import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router/'
import store from './store/'
import './registerServiceWorker'

import './assets/ta.css'

Vue.config.productionTip = false


Vue.filter('toPHP', function(value) {
     if(typeof value ==="string")
      value = parseFloat(value)
    if (typeof value !== "number") {
        return value;
    }

    var cur = 'PHP';




    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: cur,
        minimumFractionDigits: 2,
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