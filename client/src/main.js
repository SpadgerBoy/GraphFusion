// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'jquery'



Vue.config.productionTip = false
import api from './api/index.js'
Vue.prototype.$api = api

var buildCodes = false
import $ from 'jquery'

window.$ = $


// buildCodes = true

{
  window.CommunicateWithServer = function(type, paramsObj, url, callback) {
    if (buildCodes) {
      paramsObj = JSON.stringify(paramsObj)
      $.ajax({
        type: type,
        url: url,
        data: { 'params': paramsObj },
        dataType: "json",
        success: function(data) {
          callback(data);
        },
        error: function(err) {
          callback(err)
        }
      })
    } else {
      let formData = new URLSearchParams();
      formData.append("params", JSON.stringify(paramsObj));
      if (type == 'get') {
        api.get(url, formData, data => {
          callback(data)
        }, error => {
          callback(error)
        })
      } else if (type == 'post') {
        api.post(url, formData, data => {
          callback(data)
        }, error => {
          callback(error)
        })
      }
    }
  }
}


// import Vuetify from 'vuetify'
// import 'vuetify/dist/vuetify.min.css'
// Vue.use(Vuetify)

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue);


import { library } from '@fortawesome/fontawesome-svg-core'
import { faUpload, faGlobeAsia, faSearch, faSyncAlt, faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// import 'vue-awesome/icons'
// import Icon from 'vue-awesome/components/Icon'
// Vue.component('icon', Icon)

library.add(faUpload)
library.add(faGlobeAsia)
library.add(faSearch)
library.add(faSyncAlt)
library.add(faCircle)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false
import * as d3 from "d3"
window.d3 = d3
// window.contourColor = d3.scaleOrdinal(d3.schemeCategory10)
window.contourColor = function(key) {
  switch(key) {
    case 'A':
      return '#F7E1EB';
    case 'B': 
      return '#A8C5EA';
    case 'C':
      return '#F2CFB4';
    case 'D':
      return '#C1F3F8';
    case 'E':
      return '#DEF3DC';
    case 'F':
      return '#FAF6BF';
    case 'G':
      return '#BBAAE6';
    case 'biologyA':
      return '#F7E1EB';
    case 'biologyB':
      return '#A8C5EA';
  }

}


import './assets/icon/iconfont.css'
import './css/button.css'
import './css/div.css'
/* eslint-disable no-new */


import store from './store/index.js';
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})


numeric.diag = function (t) 
{ 
  var n, r, i, s = t.length, 
  o = Array(s), 
  u; 
  for (n = s - 1; n >= 0; n--) { 
    u = Array(s), 
    r = n + 2; 
    for (i = s - 1; i >= r; i -= 2)
      u[i] = 0, 
      u[i - 1] = 0; 
    i > n && (u[i] = 0), 
    u[n] = t[n]; 
    for (i = n - 1; i >= 1; i -= 2)
      u[i] = 0, u[i - 1] = 0; 
    i === 0 && (u[0] = 0), 
    o[n] = u 
  } 
    return o 
}