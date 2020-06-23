/**
 * Gw Table 安装依赖
 */
import GwTable from "./main";
import GwTableHeader from "./TableHeader";
import GwTableFilter from "./TableFilter";

/**
 * 组件
 */
const components = {
  GwTable,
  GwTableHeader,
  GwTableFilter
};

const install = function(Vue) {
  Object.entries(components).forEach(([name, component]) => {
    Vue.component(name, component);
  });
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  components
}
