import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router/'
import store from './store/'
import './registerServiceWorker'

import VueHtmlToPaper from 'vue-html-to-paper';
import './assets/ta.css'

Vue.config.productionTip = false


Vue.filter('toPHP', function(value) {
    if (typeof value !== "number") {
        return value;
    }

    var cur = 'PHP';




    var formatter = new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: cur,
        minimumFractionDigits: 2,
        currencyDisplay: 'symbol'
    });
    return formatter.format(Math.round(value));
});



 
const options = {
  name: '_blank',
  specs: [
    'fullscreen=yes',
    'titlebar=yes',
    'scrollbars=yes'
  ],
  styles:['https://www.diskubrepalawan.com/print.css']
}
 
Vue.use(VueHtmlToPaper, options);


new Vue({
    vuetify,
    router,
    store,
    render: h => h(App)
}).$mount('#app')