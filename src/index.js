import Vue from 'vue'
import App from './app.vue'

import './assets/styles/global.scss'

const root = document.createElement('dev')
document.body.appendChild(root)

new Vue({
  render: (h) => h(App)
}).$mount(root)