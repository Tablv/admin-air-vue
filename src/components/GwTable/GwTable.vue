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
    },
    // 树配置
    treeConfig: {
      type: Object,
      default: () => ({})
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
      currentRadio: '',
      currentSelection: null
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
        this.currentSelection = null;
      })
    },
    // 表格单选
    handleTableCurrentChange(rowData) {
      if (this.isRadio && rowData !== null) {
        this.currentRadio = rowData.id;
        this.currentSelection = rowData;
        this.$emit('current-change', rowData);
      }
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
        let filter = this.$refs[refName];
        if (typeof filter === Array) filter = filter[0];

        filter && filter.closePopover();
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
  },
  render(h) {
    return (
      <section class="gw-table">
        { this.$slots.header }
        <el-table
          v-loading={ this.tableLoading }
          data={ this.tableData }
          border
          size="medium"
          max-height={ this.tableHeight }
          style="width: 100%"
          header-cell-class-name="header-cell"
          highlight-current-row={ this.isRadio }

          lazy={ this.isTree }
          load={ this.treeLoad }
          row-key={ this.isTree ? this.treeConfig.key : null }
          tree-props={ this.isTree ? this.treeConfig.treeProps : {} }

          on={
            {
              "sort-change": this.sortChange,
              "current-change": this.handleTableCurrentChange
            }
          }
        >
          {
            // 单选单元格
            this.isRadio ?
            (
              <el-table-column
                width="35"
                scopedSlots={
                  {
                    default(scope) {
                      return (
                        <el-radio
                          v-model={ this.currentRadio }
                          label={ scope.row.id }
                        />
                      )
                    }
                  }
                }
              />
            ) : null
          }
          
          {
            // 单元格遍历
            this.checkedColumns.map((column, columnIndex) => {
              const ctx = this;
              
              return (
                <el-table-column
                  key={ column.prop }
                  prop={ column.prop }
                  label={ column.label }
                  width={ column.width }
                  sortable={ column.sort ? 'custom' : false }
                  scopedSlots={
                    {
                      // 表格头
                      header() {
                        return (
                          <section>
                            <span>{ column.label }</span>
                            {
                              // 过滤
                              column.filter ?
                              (
                                <span onClick={ ($event) => { $event.stopPropagation() } }>
                                  <table-filter
                                    ref={ column.prop + '-filter' }
                                    config={ column.filter }
                                    on={
                                      {
                                        'table-filter': ctx.applyTableFilter,
                                        'close': ctx.closeFilter
                                      }
                                    }
                                  />
                                </span>
                              ) : null
                            }
                          </section>
                        )
                      },
                      default(scope) {
                        // 树
                        if (ctx.isTree && columnIndex === 0 && scope.row.isParent === false && scope.row.iconClass) {
                          return (
                            <section>
                              <font-awesome-icon icon={ scope.row.iconClass } />
                              <span>{ scope.row[scope.column.property] }</span>
                            </section>
                          )
                        }
                        // 自定义渲染
                        else if (column.render) {
                          return column.render.call(ctx.$parent, h, scope.row);
                        }
                        // 一般
                        else {
                          const column = scope.row[scope.column.property];
                          return <span>{ column || "-" }</span>
                        }
                      }
                    }
                  }
                >
                </el-table-column>
              )
            })
          }
        </el-table>

        {
          // 分页
          this.pagination
          ? (
            <div class="pagination">
              <el-pagination
                background
                page-sizes={[5, 10, 20, 50, 100]}
                page-size={ this.page.pageSize }
                current-page={ this.page.pageNum }
                layout="sizes, total, ->, prev, pager, next"
                total={ this.page.total }
                onSizeChange={ this.handleSizeChange }
                onCurrentChange={ this.handleCurrentChange }
              />
            </div>
          ) : null
        }
      </section>
    )
  }
}
</script>
<style lang="scss">
@import './GwTable.scss';
</style>
