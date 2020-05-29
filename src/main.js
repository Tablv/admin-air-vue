import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import ElementUI from 'element-ui'
import ElTreeSelect from 'el-tree-select'
import { Splitpanes, Pane } from 'splitpanes'

// global css
import '@/styles/index.scss'
import 'element-ui/lib/theme-chalk/index.css'
import 'splitpanes/dist/splitpanes.css'

import '@/icons' // icon
import '@/permission'

Vue.component('splitpanes', Splitpanes)
Vue.component('pane', Pane)

Vue.use(ElTreeSelect)

// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, { size: 'mini' })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
