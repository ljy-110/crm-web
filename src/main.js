// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import api from './api/install'
import url from './api/teaback/url'
// import md5 from 'js-md5'
import axios from 'axios'

import 'lib-flexible'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
Vue.use(api)
// Vue.prototype.$md5 = md5
Vue.prototype.$axios = axios
Vue.prototype.$baseUrl = url.baseUrl
Vue.prototype.$img = url.photos
// import common from '../static/js/common'
// Vue.prototype.$uploadImg = common.uploadImg
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  axios,
  render: h => h(App),
  components: { App },
  template: '<App/>'
})
