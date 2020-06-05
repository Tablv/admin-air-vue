<template>
  <div class="gw-table">
    <el-table
      v-loading="listLoading"
      :data="tableData"
      border
      size="medium"
      :max-height="tableHeight"
      style="width: 100%"
      header-cell-class-name="header-cell"
      @sort-change="sortChange"
      :row-key="hasTree ? treeConfig.key : null"
      :lazy="hasTree ? true : false"
      :load="hasTree ? loadData : null"
      :tree-props="hasTree ? treeConfig.treeProps : {}"
    >
      <el-table-column
        v-for="item in tableColumns"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :width="item.width ? item.width : null"
        :sortable="item.sort ? item.sort : false"
      >
        <template slot="header" slot-scope="scope">
          <span>{{ item.label }}</span>
          <span @click.stop  v-if="item.filter">
            <el-popover
              :ref="item.prop"
              placement="bottom"
              :width="item.filter === 'date' ? 250 : 160"
              trigger="click"
            >
              <el-input
                v-if="item.filter === 'input'"
                v-model="filter[item.prop]"
                :placeholder="item.label"/>
              <el-select
                v-else-if="item.filter === 'select'"
                v-model="filter[item.prop]"
                placeholder="">
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <div v-else>
                <el-date-picker
                  v-model="filter[item.prop]"
                  type="daterange"
                  unlink-panels
                  :clearable="false"
                  value-format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="起始日期"
                  end-placeholder="截止日期">
                </el-date-picker>
              </div>
              <div class="table-filter-btn">
                <el-button type="primary" @click="tableFilter(item.prop)">筛选</el-button>
                <el-button style="float: right;" @click="tableFilter(item.prop, 'reset')">重置</el-button>
              </div>
              <i slot="reference" :style="{ color: (activedFilter[item.prop] ? '#409EFF' : '#909399') }" class="el-icon-search" @click="doClosePopover(item.prop)"></i>
            </el-popover>
          </span>
        </template>
        <template slot-scope="scope">
          <span v-if="item.prop === 'status'" :style="{ color: (scope.row.status === 0 ? '#80B762' : 'red')}">{{ scope.row.status === 0 ? '启用' : '禁用' }}</span>
          <span v-else-if="item.prop === 'type'">{{ scope.row.type === 0 ? '组织' : '部门' }}</span>
          <span v-else-if="item.prop === 'operation'">
            <slot :index='scope.$index' :row='scope.row'></slot>
          </span>
          <span v-else>{{ scope.row[scope.column.property] === null ? '-' : scope.row[scope.column.property] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination" v-if="Object.keys(page).length !== 0">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 20, 50, 100]"
        :page-size="page.pageSize"
        :current-page="page.pageNum"
        layout="sizes, total, ->, prev, pager, next"
        :total="page.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    // 表格数据
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 表格列数据
    tableColumn: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 表格配置
    checkedList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 表格loading
    listLoading: {
      type: Boolean,
      default: false
    },
    // 表格过滤
    filter: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 表格过滤启用
    activedFilter: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 分页
    page: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 树表格
    hasTree: {
      type: Boolean,
      default: false
    },
    // 树表格配置
    treeConfig: {
      type: Object,
      default: () => {
        return {
          key: 'id',
          treeProps: {
            children: 'children',
            hasChildren: 'isParent'
          }
        }
      }
    },
    // 表格树数据
    tableTreeData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      tableHeight: Object.keys(this.page).length !== 0 ? document.body.clientHeight - 255 : document.body.clientHeight - 223,
      statusOptions: [
        { value: '2', label: '全部' },
        { value: '0', label: '启用' },
        { value: '1', label: '禁用' }
      ]
    }
  },
  computed: {
    tableColumns: function() {
      return this.tableColumn.filter((item) => {
        if (Object.keys(this.checkedList).length === 0) return item
        if (this.checkedList.includes(item.prop)) return item
      })
    }
  },
  watch: {},
  created() {},
  mounted() {
    window.onresize = () => {
      return (() => {
        if (Object.keys(this.page).length !== 0) {
          this.tableHeight = document.body.clientHeight - 255
        } else {
          this.tableHeight = document.body.clientHeight - 223
        }
      })()
    }
  },
  methods: {
    // 表格---远程排序
    sortChange(column) {
      this.$emit('sort-change', column)
    },
    // 表格---远程筛选
    tableFilter(type, reset) {
      if (reset) {
        this.filter[type] = ''
        if (type === 'status') this.filter.status = '2'
      }
      let filterParams = {
        filter: this.filter,
        type: type,
        reset: reset
      }
      this.$emit('filter', filterParams)
      this.doClosePopover('close')
    },
    // 关闭popover
    doClosePopover(val) {
      for (const key in this.$refs) {
        if (key !== val) {
          this.$refs[key][0].doClose()
        }
      }
    },
    // 表格-树数据
    loadData(tree, treeNode, resolve) {
      this.$emit('loadData', tree)
      setTimeout(() => {
        resolve(this.tableTreeData)
      }, 500)
    },
    // 分页---改变每页数量
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val)
    },
    // 分页---改变页码
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val)
    }
  }
}
</script>
<style lang="scss">
@import './gwTable.scss';
</style>
