import "./TableFilter.scss";
import { widgetsRenderer, filterBtnRenderer } from "./filterWidgets";

export default {
  props: {
    filterInit: {
      type: Object,
      default: () => {
        return {}
      }
    },
    filterItem: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      filterInits: {},
      filterParams: {},

      /**
       * 渲染使用
       */
    }
  },
  render(h) {
    return (
      <div class="gw-table-filter">
        <el-popover
          placement="bottom"
          width="160"
          trigger="click"
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
    this.filterInits = JSON.parse(JSON.stringify(this.filterInit))
  },
  computed: {
    filterType() {
      return this.filterItem.filter.type;
    }
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
     * 表格远程筛选
     */
    doTableFilter() {
      this.filterParams = this.filterInits
      this.$emit('table-filter', this.filterParams)
    },
    
    resetTableFilter() {
      if (this.filterType === 'dates') {
        this.filterInits[this.filterItem.filter.startDate] = ''
        this.filterInits[this.filterItem.filter.endDate] = ''
      } else {
        this.filterInits[this.filterItem.filter.data] = ''
      }
    },

    /**
     * 点击筛选图标关闭popover
     */
    doClosePopover(propName) {
      this.$emit('close-popover', propName)
    }
  }
}