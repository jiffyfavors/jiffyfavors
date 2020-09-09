import Vue from 'vue'
import VueSelectImage from 'vue-select-image'

import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
require('vue-select-image/dist/vue-select-image.css')

import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

Vue.use(VueSelectImage)
Vue.use(Loading)
Vue.component('loading', Loading)
Vue.component('vuedropzone', vue2Dropzone)
