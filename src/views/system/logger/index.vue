<template>
  <div class="container">
    <header class="header">
      <el-row type="flex" justify="space-between">
        <el-col :span="6">
          <div class="header-title">日志管理</div>
        </el-col>
        <el-col :span="18">
          <div class="button-group">
            <el-button type="primary" icon="el-icon-delete-solid" @click="handleDelete">清空</el-button>
            <el-button icon="el-icon-refresh" @click="getInit" class="first-button"></el-button>
            <el-dropdown trigger="click" class="center-button">
              <el-button icon="el-icon-upload2">
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="import">导出 Excel</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown trigger="click" :hide-on-click="false" class="last-button">
              <el-button icon="el-icon-s-grid">
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-checkbox-group v-model="checkedList" @change="changeCheckbox" :min="2">
                    <el-checkbox v-for="item in headerList" :key="item.prop" :label="item.prop" style="display:block;">{{ item.label }}</el-checkbox>
                    </el-checkbox-group>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
      </el-row>
    </header>
    <article>
      <gw-table
        :tableData="tableData"
        :tableColumn="tableColumn"
        :checkedList="checkedList"
        :listLoading="listLoading"
        :activedFilter="activedFilter"
        :filter="filter"
        :page="page"
        @sort-change="sortChange"
        @filter="tableFilter"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></gw-table>
    </article>
  </div>
</template>

<script>
import { getLogList, doDeleteAll } from '@/api/system/logger'
import gwTable from '@/components/gwTable'
export default {
  name: 'SYS_LOG',
  components: {
    gwTable
  },
  data() {
    return {
      // 初始化参数
      initParams: {
        order: 'asc',
        offset: 0,
        limit: 10
      },
      // 表格数据
      tableData: [],
      // 表格列数据
      tableColumn: [
        { prop: 'content', label: '日志内容', width: '150' },
        { prop: 'userName', label: '用户名', sort: 'custom', filter: 'input', width: '130' },
        { prop: 'realName', label: '操作人', sort: 'custom', filter: 'input', width: '130' },
        { prop: 'operateDate', label: '操作时间', sort: 'custom', filter: 'date', width: '160' },
        { prop: 'browser', label: '浏览器', width: '130' },
        { prop: 'operatingSystem', label: '操作系统', width: '130' },
        { prop: 'ipAddress', label: 'IP地址', width: '150' },
        { prop: 'requestPath', label: '请求地址', width: '300' },
        { prop: 'logType', label: '日志类型', width: '100' }
      ],
      // 表格loading
      listLoading: false,
      // 表格配置
      headerList: [
        { prop: 'content', label: '日志内容' },
        { prop: 'userName', label: '用户名' },
        { prop: 'realName', label: '操作人' },
        { prop: 'operateDate', label: '操作时间' },
        { prop: 'browser', label: '浏览器' },
        { prop: 'operatingSystem', label: '操作系统' },
        { prop: 'ipAddress', label: 'IP地址' },
        { prop: 'requestPath', label: '请求地址' },
        { prop: 'logType', label: '日志类型' }
      ],
      // 表格配置选中
      checkedList: ['content', 'userName', 'realName', 'operateDate', 'browser', 'operatingSystem', 'ipAddress', 'requestPath', 'logType'],
      // 表格过滤
      filter: {
        userName: '',
        realName: '',
        operateDate: ''
      },
      activedFilter: {
        userName: false,
        realName: false,
        operateDate: false
      },
      filterParams: {},
      // 分页
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      }
    }
  },
  created() {
    this.getInit()
  },
  methods: {
    // 初始化
    getInit() {
      this.listLoading = true
      getLogList(this.initParams).then(res => {
        this.listLoading = false
        let { success, result } = res
        if (success === true) {}
        this.tableData = result.list
        this.page = {
          pageSize: result.pageSize,
          pageNum: result.pageNum,
          total: result.total
        }
      })
    },
    // 清空
    handleDelete() {
      this.$confirm('确认删除吗？', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        cancelButtonClass: 'messageBoxCancelButton'
      }).then(action => {
        if (action === 'confirm') {
          doDeleteAll().then(res => {
            if (res.success === true) {}
            this.$message({
              message: '操作成功！',
              type: 'success'
            })
            this.getInit()
          })
        }
      }).catch(() => {})
    },
    // 表格-配置
    changeCheckbox(value) {
      this.checkedList = value
    },
    // 表格-远程排序
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
    // 表格-筛选
    tableFilter({ filter, type, reset }) {
      switch (type) {
        case 'userName':
          if (filter.userName) {
            this.filterParams.userName = filter.userName
            this.activedFilter[type] = true
          } else {
            delete this.filterParams.userName
            this.activedFilter[type] = false
          }
          if (reset === 'reset') {
            delete this.filterParams.userName
            this.activedFilter[type] = false
          }
          break
        case 'realName':
          if (filter.realName) {
            this.filterParams.realName = filter.realName
            this.activedFilter[type] = true
          } else {
            delete this.filterParams.realName
            this.activedFilter[type] = false
          }
          if (reset === 'reset') {
            delete this.filterParams.realName
            this.activedFilter[type] = false
          }
          break
        case 'operateDate':
          if (filter.operateDate.length !== 0) {
            this.filterParams.operateDate_start = filter.operateDate[0]
            this.filterParams.operateDate_end = filter.operateDate[1]
            this.activedFilter[type] = true
          } else {
            delete this.filterParams.operateDate_start
            delete this.filterParams.operateDate_end
            this.activedFilter[type] = false
          }
          if (reset === 'reset') {
            delete this.filterParams.operateDate_start
            delete this.filterParams.operateDate_end
            this.activedFilter[type] = false
          }
          break
      }
      Object.keys(this.filterParams).length !== 0 ? this.initParams.filter = this.filterParams : delete this.initParams.filter
      this.getInit()
    },
    // 分页-改变每页数量
    handleSizeChange(val) {
      this.page.pageSize = val
      this.initParams.limit = val
      this.getInit()
    },
    // 分页-改变页码
    handleCurrentChange(val) {
      this.page.pageNum = val
      this.initParams.offset = (val - 1) * this.initParams.limit
      this.getInit()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
