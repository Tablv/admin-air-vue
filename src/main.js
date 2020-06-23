import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'

/**
 * Element UI
 */
import "@/dependencies/element-ui";

// Element 选择框树节点展示
import "@/dependencies/el-tree-select";

// splitpanes
import "@/dependencies/splitpanes";

// splitpanes
import "@/dependencies/font-awesome";

// global css
import '@/styles/index.scss'
// icon
import '@/icons'
import '@/permission'

import GwTable from "@/components/GwTable/install";
Vue.use(GwTable);

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
