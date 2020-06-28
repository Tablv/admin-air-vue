import "./index.scss";
import { widgetsRenderer, filterBtnRenderer } from "./filter-widgets";

export default {
  props: {
    config: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      filterStashMap: this.getInitStashMap()
    }
  },
  computed: {
    table() {
      return this.$parent;
    },
    filterType() {
      return this.config.type;
    }
  },
  render(h) {
    return (
      <div class="gw-table-filter">
        <el-popover
          placement="bottom"
          width="160"
          trigger="click"
          popper-class="gw-table-filter-popover"
          ref="popover"
        >
          { this.renderWidget(h) }

          <div class="table-filter-btn">
            <el-button
              type="primary"
              onClick={ this.doTableFilter }
            >
              <span>筛选</span>
            </el-button>
            <el-button
              style="float: right;"
              onClick={ this.resetTableFilter }
            >
              <span>重置</span>
            </el-button>
          </div>

          { filterBtnRenderer.call(this, h) }
        </el-popover>
      </div>
    );
  },
  created() {
    // this.tableFilterInit();
  },
  methods: {
    /**
     * 渲染函数
     */
    renderWidget(h) {
      const renderer = widgetsRenderer[this.filterType];
      return renderer ? renderer.call(this, h) : null;
    },

    /**
     * 表格过滤 获取初始化
     */
    getInitStashMap() {
      let columnFilter = {};
      if (this.config.startDate && this.config.endDate) {
        columnFilter[this.config.startDate] = ''
        columnFilter[this.config.endDate] = ''
      } else if (this.config.prop) {
        columnFilter[this.config.prop] = ''
      }
      
      return columnFilter;
    },

    /**
     * 表格远程筛选
     */
    doTableFilter() {
      this.$emit('table-filter', this.filterStashMap);
    },
    
    resetTableFilter() {
      if (this.filterType === 'dates') {
        this.filterStashMap[this.config.startDate] = "";
        this.filterStashMap[this.config.endDate] = "";
      } else {
        this.filterStashMap[this.config.prop] = "";
      }

      this.doTableFilter();
    },

    /**
     * 点击筛选图标关闭popover
     */
    closePopover() {
      this.$refs['popover'].doClose();
    }
  }
}