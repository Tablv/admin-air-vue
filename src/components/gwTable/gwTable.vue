<template>
  <div class="gw-table">
    <header
      v-if="hasHeader"
      class="header"
    >
      <el-row
        type="flex"
        justify="space-between"
      >
        <el-col :span="6">
          <div class="header-title">
            {{ tableConfig.title }}
          </div>
        </el-col>
        <el-col :span="18">
          <div class="button-group">
            <div
              v-if="tableConfig.buttons[0] === 'slot'"
              class="custom-buttons"
            >
              <slot name="buttons" />
            </div>
            <div
              v-else
              class="custom-buttons"
            >
              <!-- 新增 -->
              <el-button
                v-if="tableConfig.buttons.includes('add')"
                type="primary"
                @click="handleAdd"
              >
                <font-awesome-icon
                  icon="plus"
                  pull="left"
                />
                <span>新增</span>
              </el-button>
              <!-- 修改 -->
              <el-button
                v-if="tableConfig.buttons.includes('update')"
                type="primary"
                @click="handleUpdate"
              >
                <font-awesome-icon
                  icon="edit"
                  pull="left"
                />
                <span>修改</span>
              </el-button>
              <!-- 删除 -->
              <el-button
                v-if="tableConfig.buttons.includes('delete')"
                type="danger"
                @click="handleDelete"
              >
                <font-awesome-icon
                  icon="trash-alt"
                  pull="left"
                />
                <span>删除</span>
              </el-button>
            </div>
            <!-- 刷新 -->
            <el-button
              v-if="tableConfig.buttons.includes('refresh')"
              class="first-button"
              @click="getInit"
            >
              <font-awesome-icon icon="sync-alt" />
            </el-button>
            <!-- 导入 -->
            <el-dropdown
              v-if="tableConfig.buttons.includes('import')"
              trigger="click"
              class="center-button"
              @command="handleImport"
            >
              <el-button>
                <font-awesome-icon
                  icon="download"
                  pull="left"
                />
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="import">
                  导入 Excel
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- 导出 -->
            <el-dropdown
              v-if="tableConfig.buttons.includes('export')"
              trigger="click"
              class="center-button"
              @command="handleExport"
            >
              <el-button>
                <font-awesome-icon
                  icon="upload"
                  pull="left"
                />
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="import">
                  导出 Excel
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- 表格配置 -->
            <el-dropdown
              v-if="tableConfig.buttons.includes('columns')"
              trigger="click"
              :hide-on-click="false"
              class="last-button"
            >
              <el-button>
                <font-awesome-icon icon="th" />
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-checkbox-group
                    v-model="tableConfig.checkedColumns"
                    :min="2"
                    @change="changeColumns"
                  >
                    <el-checkbox
                      v-for="item in tableConfig.columns"
                      :key="item.prop"
                      :label="item.prop"
                      style="display:block;"
                    >
                      {{ item.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
      </el-row>
    </header>
    <el-table
      v-loading="listLoading"
      :data="tableData"
      border
      size="medium"
      :max-height="tableHeight"
      style="width: 100%"
      header-cell-class-name="header-cell"
      :highlight-current-row="tableConfig.hasRadio ? true : false"
      :row-key="tableConfig.hasTree ? tableConfig.treeConfig.key : null"
      :lazy="tableConfig.hasTree ? true : false"
      :load="tableConfig.hasTree ? treeLoad : null"
      :tree-props="tableConfig.hasTree ? tableConfig.treeConfig.treeProps : {}"
      @sort-change="sortChange"
      @current-change="handleTableCurrentChange"
    >
      <el-table-column
        v-if="tableConfig.hasRadio"
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
        v-for="item in tableColumns"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width ? item.width : null"
        :sortable="item.sort ? item.sort : false"
      >
        <template
          slot="header"
        >
          <span>{{ item.label }}</span>
          <span
            v-if="item.filter"
            @click.stop
          >
            <gw-table-filter
              :ref="item.prop"
              :filter-init="filterInit[item.prop]"
              :filter-item="item"
              @doClosePopover="doClosePopover"
              @tableFilter="tableFilter"
            />
          </span>
        </template>
        <template slot-scope="scope">
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
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div
      v-if="tableConfig.pagination"
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
import request from '@/utils/request'
import GwTableFilter from '@/components/GwTableFilter'
export default {
  components: {
    GwTableFilter
  },
  props: {
    // 表格初始化参数
    queryParams: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 表格过滤
    tableConfig: {
      type: Object,
      default: () => {
        return {}
      }
    },
    treeLoad: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      // 表格数据
      tableData: [],
      // 表格loading
      listLoading: false,
      // 表格高度
      tableHeight: this.tableConfig.pagination ? document.body.clientHeight - 255 : document.body.clientHeight - 223,
      // 表格筛选初始参数
      filterInit: {},
      // 表格筛选最终参数
      filterParams: {},
      // 初始化参数
      initParams: {
        order: 'asc',
        offset: 0,
        limit: 10
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
    // 表格配置
    tableColumns() {
      if (!this.tableConfig.checkedColumns) return this.tableConfig.columns

      return this.tableConfig.columns.filter(column =>
        this.tableConfig.checkedColumns.includes(column.prop)
      )
    },
    // 是否有头部区域
    hasHeader() {
      if (!this.tableConfig.hasHeader) {
        return true
      } else {
        return this.tableConfig.hasHeader
      }
    }
  },
  watch: {
    // 获取表格筛选下拉框数据
    'tableConfig.columns': {
      handler(columns) {
        columns.forEach(column => {
          if (column.filter && column.filter.hasOwnProperty('option')) {
            if (typeof column.filter.option === 'string') {
              request.get(column.filter.option).then(res => {
                column.filter.option = res
              })
            }
            column.filter.options = this.getSelectOption(column)
          }
        })
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    if (Object.keys(this.queryParams).length === 0) this.getInit()
    this.getTableFilterInit()
  },
  mounted() {
    window.addEventListener('resize', this.getTableHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getTableHeight)
  },
  methods: {
    // 获取表格高度
    getTableHeight() {
      if (this.tableConfig.pagination) {
        this.tableHeight = document.body.clientHeight - 255
      } else {
        this.tableHeight = document.body.clientHeight - 223
      }
    },
    // 初始化
    getInit() {
      this.listLoading = true
      if (Object.keys(this.queryParams).length > 0) {
        Object.assign(this.initParams, this.queryParams)
      }
      request.get(this.tableConfig.api, this.initParams).then(res => {
        this.listLoading = false
        const { result } = res
        if (this.tableConfig.pagination) {
          this.tableData = result.list
          this.page = {
            pageSize: result.pageSize,
            pageNum: result.pageNum,
            total: result.total
          }
        } else {
          this.tableData = result
        }
        this.currentRadio = ''
      })
    },
    // 新增按钮
    handleAdd() {
      this.$emit('add')
    },
    // 修改按钮
    handleUpdate() {
      this.$emit('update')
    },
    // 删除按钮
    handleDelete() {
      this.$emit('delete')
    },
    // 导入按钮
    handleImport(command) {
      this.$emit('import', command)
    },
    // 导出按钮
    handleExport() {
      this.$emit('export')
    },
    // 表格单选
    handleTableCurrentChange(val) {
      if (this.tableConfig.hasRadio && val !== null) {
        this.currentRadio = val.id
        this.$emit('handleTableCurrentChange', val)
      }
    },
    // 表格---配置
    changeColumns(value) {
      this.$emit('changeColumns', value)
    },
    // 表格---远程排序
    sortChange(column) {
      if (column.order) {
        this.initParams.sort = column.prop
        this.initParams.order = column.order === 'descending' ? 'desc' : 'asc'
      } else {
        delete this.initParams.sort
        this.initParams.order = 'asc'
      }
      this.getInit()
    },
    // 获取表格筛选初始参数
    getTableFilterInit() {
      let filterInit = {}
      this.tableConfig.columns.map(column => {
        if (column.filter) {
          let columnFilter = {}
          if (column.filter.hasOwnProperty('data1')) {
            columnFilter[column.filter.data1] = ''
            columnFilter[column.filter.data2] = ''
          } else {
            columnFilter[column.filter.data] = ''
          }
          filterInit[column.prop] = columnFilter
        }
      })
      this.filterInit = filterInit
    },
    // 表格---远程筛选
    tableFilter(data) {
      Object.keys(data).map(key => {
        this.filterParams[key] = data[key]
      })
      Object.keys(this.filterParams).map(key => {
        if (this.filterParams[key] === '') delete this.filterParams[key]
      })
      Object.keys(this.filterParams).length !== 0 ? this.initParams.filter = this.filterParams : delete this.initParams.filter
      this.getInit()
      this.doClosePopover('close')
    },
    // 转换表格筛选下拉框数据
    getSelectOption(column) {
      let options = Object.keys(column.filter.option).map(key => {
        const option = {
          label: column.filter.option[key],
          value: key
        }
        return option
      })
      options.unshift({ value: '', label: column.label })
      return options
    },
    // 关闭popover
    doClosePopover(val) {
      for (const key in this.$refs) {
        if (key !== val) {
          this.$refs[key][0].$children[0].doClose()
        }
      }
    },
    // 分页---改变每页数量
    handleSizeChange(val) {
      this.page.pageSize = val
      this.initParams.limit = val
      this.getInit()
    },
    // 分页---改变页码
    handleCurrentChange(val) {
      this.page.pageNum = val
      this.initParams.offset = (val - 1) * this.initParams.limit
      this.getInit()
    }
  }
}
</script>
<style lang="scss">
@import './GwTable.scss';
</style>
