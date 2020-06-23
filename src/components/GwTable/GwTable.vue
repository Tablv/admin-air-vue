<template>
  <div class="gw-table">
    <slot name="header" />
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      border
      size="medium"
      :max-height="tableHeight"
      style="width: 100%"
      header-cell-class-name="header-cell"
      :highlight-current-row="isRadio"

      :lazy="isTree"
      :load="treeLoad"
      :row-key="isTree ? treeConfig.key : null"
      :tree-props="isTree ? treeConfig.treeProps : {}"

      @sort-change="sortChange"
      @current-change="handleTableCurrentChange"
    >
      <el-table-column
        v-if="isRadio"
        width="35"
      >
        <template slot-scope="scope">
          <el-radio
            v-model="currentRadio"
            :label="scope.row.id"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-for="column in checkedColumns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :sortable="column.sort ? 'custom' : false"
      >
        <template slot="header">
          <span>{{ column.label }}</span>
          <span
            v-if="column.filter"
            @click.stop
          >
            <table-filter
              :ref="column.prop + '-filter'"
              :config="column.filter"
              @table-filter="applyTableFilter"
              @close="closeFilter"
            />
          </span>
        </template>
        <!-- <template slot-scope="scope">
          <span v-if="item.conver">
            <slot
              name="conver"
              :row="scope.row"
              :column="scope.column"
            />
          </span>
          <span v-else-if="item.prop === 'operation'">
            <slot
              name="operation"
              :index="scope.$index"
              :row="scope.row"
            />
          </span>
          <span v-else-if="item.prop === 'name' && scope.row.isParent === false && scope.row.iconClass">
            <font-awesome-icon :icon="scope.row.iconClass" />
            <span>{{ scope.row.name }}</span>
          </span>
          <span v-else>{{ scope.row[scope.column.property] === null ? '-' : scope.row[scope.column.property] }}</span>
        </template> -->
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div
      v-if="pagination"
      class="pagination"
    >
      <el-pagination
        background
        :page-sizes="[5, 10, 20, 50, 100]"
        :page-size="page.pageSize"
        :current-page="page.pageNum"
        layout="sizes, total, ->, prev, pager, next"
        :total="page.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import request from '@/utils/request'
import TableFilter from './TableFilter'

export default {
  components: {
    TableFilter
  },
  props: {
    // 接口
    api: {
      type: String,
      required: true
    },
    // 表格标题
    title: {
      type: String,
      default: ""
    },
    /**
     * 表格类型
     * 
     *  - 默认：default
     *  - 单选：radio
     *  - 树：tree
     */
    type: {
      type: String,
      default: "default"
    },
    // 是否分页
    pagination: {
      type: Boolean,
      default: true
    },
    // 列配置
    columns: {
      type: Array,
      required: true
    },
    // 表格查询参数
    queryParams: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 初始化时，加载数据
    autoLoad: {
      type: Boolean,
      default: true
    },

    // 类型为树时的加载方法
    treeLoad: {
      type: Function,
      default: null
    }

  },
  data() {
    return {
      // 表格数据
      tableData: [],
      // 表格loading
      tableLoading: false,
      // 表格高度
      tableHeight: this.getTableHeight(),
      // 表格筛选最终参数
      filterParams: {},
      /**
       * 表格参数
       *  - 分页 offset limit
       *  - 排序字段 sort
       *  - 顺序 order
       *  - 过滤字段 filter
       */
      tableParams: {
        order: 'asc',
        offset: 0,
        limit: 10,
        // filter: { name: 'admin' }
        // sort: "name", order: "desc"  
      },
      // 分页
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      // 单选
      currentRadio: ''
    }
  },
  computed: {
    /**
     * 类型
     */
    isRadio() {
      return this.type === "radio";
    },
    isTree() {
      return this.type === "tree";
    },
    


    columnsConfig: {
      get() {
        return this.columns;
      },
      set(columns) {
        this.$emit("update:columns", columns);
      }
    },
    checkedColumns() {
      return this.columnsConfig.filter(column => column.hidden !== false && column.checked !== false);
    }
  },
  watch: {
    // 监听查询参数，实时刷新
    queryParams: {
      deep: true,
      immediate: true,
      handler() {
        if (!this.autoLoad) return false;

        this.getInit();
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.windowResizeHandle)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.windowResizeHandle)
  },
  methods: {
    // 窗口resize方法
    windowResizeHandle() {
      this.tableHeight = this.getTableHeight();
    },
    // 获取表格高度
    getTableHeight() {
      const offset = this.pagination ? 255 : 223;
      return document.body.clientHeight - offset
    },
    // 初始化
    getInit() {
      this.tableLoading = true;
      
      const tableParams = _.merge(this.tableParams, this.queryParams);

      request.get(this.api, tableParams).then(res => {
        this.tableLoading = false;

        const { result } = res;
        // 分页处理
        if (this.pagination) {
          this.tableData = result.list;
          this.page = {
            pageSize: result.pageSize,
            pageNum: result.pageNum,
            total: result.total
          };
        } else {
          // 不分页处理
          this.tableData = result;
        }
        
        this.currentRadio = '';
      })
    },
    // 表格单选
    handleTableCurrentChange(rowData) {
      if (this.isRadio && rowData !== null) {
        this.currentRadio = rowData.id;
        this.$emit('current-change', rowData);
      }
    },
    // 表格---配置
    changeColumns(value) {
      this.$emit('changeColumns', value)
    },
    // 表格---远程排序
    sortChange(column) {
      if (column.order) {
        this.tableParams.sort = column.prop
        this.tableParams.order = column.order === 'descending' ? 'desc' : 'asc'
      } else {
        delete this.tableParams.sort
        this.tableParams.order = 'asc'
      }
      this.getInit()
    },
    // 表格---远程筛选
    applyTableFilter(filterRet) {
      if (this.tableParams.filter) {
        Object.entries(filterRet).forEach(([ filterProp, filterValue ]) => {
          if (filterValue.trim() === "") {
            delete this.tableParams.filter[filterProp];
          } else {
            this.tableParams.filter[filterProp] = filterValue;
          }
        })
      } else {
        this.$set(this.tableParams, "filter", filterRet);
      }

      this.getInit();
      this.closeFilter();
    },
    // 关闭过滤
    closeFilter(propName) {
      // 所有弹出框
      const allPopovers = Object.keys(this.$refs).filter(refKey => refKey.endsWith("-filter"));
      const needClosePopovers = propName ? allPopovers.filter(refKey => refKey !== propName + "-filter") : allPopovers;

      needClosePopovers.forEach(refName => {
        const filter = this.$refs[refName];
        filter && filter[0].closePopover()
      })
    },
    // 分页---改变每页数量
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.tableParams.limit = pageSize;
      this.getInit();
    },
    // 分页---改变页码
    handleCurrentChange(pageNum) {
      this.page.pageNum = pageNum;
      this.tableParams.offset = (pageNum - 1) * this.tableParams.limit;
      this.getInit();
    }
  }
}
</script>
<style lang="scss">
@import './GwTable.scss';
</style>