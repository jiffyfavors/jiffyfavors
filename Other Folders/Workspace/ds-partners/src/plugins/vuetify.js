import '@fortawesome/fontawesome-free/css/all.css'

import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import VueLodash from 'vue-lodash'

Vue.use(VueLodash)
Vue.use(Vuetify)


export default new Vuetify({
  icons: {
    iconfont: 'fa',
  },
});
