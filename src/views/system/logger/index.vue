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
                  <el-checkbox-group v-model="checkList" @change="changeCheckbox" :min="2">
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
      <el-table
        v-loading="listLoading"
        :data="tableData"
        border
        size="medium"
        :max-height="tableHeight"
        style="width: 100%"
        @sort-change="sortChange">
        <el-table-column prop="content" label="日志内容" width="150" v-if="checkList.includes('content')">
        </el-table-column>
        <el-table-column prop="userName" label="用户名" width="130" v-if="checkList.includes('userName')" sortable="custom">
          <template slot="header" slot-scope="scope">
            <span class="table-header-title">用户名</span>
            <span @click.stop>
              <el-popover
                placement="bottom"
                width="160"
                trigger="click"
                v-model="activedPop[scope.column.property]">
                <el-input
                  v-model="filter.userName"
                  placeholder="用户名"/>
                <div class="table-filter-btn">
                  <el-button type="primary" @click="tableFilter('userName')">筛选</el-button>
                  <el-button style="float: right;" @click="tableFilter('userName', 'reset')">重置</el-button>
                </div>
                <i slot="reference" :style="{ color: (activedFilter[scope.column.property] ? '#409EFF' : '#909399') }" class="el-icon-search"></i>
              </el-popover>
            </span>
            <!-- <div @click.stop>
              <el-input
                v-model="filter.userName"
                placeholder="用户名"
                @change="tableFilter($event, 'userName')"/>
            </div> -->
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="操作人" width="130" v-if="checkList.includes('realName')" sortable="custom">
          <template slot="header" slot-scope="scope">
            <span class="table-header-title">操作人</span>
            <span @click.stop>
              <el-popover
                placement="bottom"
                width="160"
                trigger="click"
                v-model="activedPop[scope.column.property]">
                <el-input
                  v-model="filter.realName"
                  placeholder="操作人"/>
                <div class="table-filter-btn">
                  <el-button type="primary" @click="tableFilter('realName')">筛选</el-button>
                  <el-button style="float: right;" @click="tableFilter('realName', 'reset')">重置</el-button>
                </div>
                <i slot="reference" :style="{ color: (activedFilter[scope.column.property] ? '#409EFF' : '#909399') }" class="el-icon-search"></i>
              </el-popover>
            </span>
            <!-- <div @click.stop>
              <el-input
                v-model="filter.realName"
                placeholder="操作人"
                @change="tableFilter($event, 'realName')"/>
            </div> -->
          </template>
        </el-table-column>
        <el-table-column prop="operateDate" label="操作时间" width="160" v-if="checkList.includes('operateDate')"  sortable="custom">
          <template slot="header" slot-scope="scope">
            <span class="table-header-title">操作时间</span>
            <span @click.stop>
              <el-popover
                placement="bottom"
                width="160"
                trigger="click"
                v-model="activedPop[scope.column.property]">
                <el-date-picker
                  v-model="filter.operateDate_start"
                  type="date"
                  placeholder="起始日期"
                  value-format="yyyy-MM-dd"
                  :style="{ marginBottom: '10px' }">
                </el-date-picker>
                <el-date-picker
                  v-model="filter.operateDate_end"
                  type="date"
                  placeholder="截止日期"
                  value-format="yyyy-MM-dd">
                </el-date-picker>
                <div class="table-filter-btn">
                  <el-button type="primary" @click="tableFilter('operateDate')">筛选</el-button>
                  <el-button style="float: right;" @click="tableFilter('operateDate', 'reset')">重置</el-button>
                </div>
                <i slot="reference" :style="{ color: (activedFilter[scope.column.property] ? '#409EFF' : '#909399') }" class="el-icon-search"></i>
              </el-popover>
            </span>
            <!-- <div @click.stop>
              <el-date-picker
                v-model="filter.operateDate_start"
                type="date"
                placeholder="起始日期"
                value-format="yyyy-MM-dd"
                @change="tableFilter($event, 'operateDate_start')">
              </el-date-picker>
              <el-date-picker
                v-model="filter.operateDate_end"
                type="date"
                placeholder="截止日期"
                value-format="yyyy-MM-dd"
                @change="tableFilter($event, 'operateDate_end')">
              </el-date-picker>
            </div> -->
          </template>
        </el-table-column>
        <el-table-column prop="browser" label="浏览器" width="130" v-if="checkList.includes('browser')">
        </el-table-column>
        <el-table-column prop="operatingSystem" label="操作系统" width="130" v-if="checkList.includes('operatingSystem')">
        </el-table-column>
        <el-table-column prop="ipAddress" label="IP地址" width="150" v-if="checkList.includes('ipAddress')">
        </el-table-column>
        <el-table-column prop="requestPath" label="请求地址" width="300" v-if="checkList.includes('requestPath')">
        </el-table-column>
        <el-table-column prop="logType" label="日志类型" width="100" v-if="checkList.includes('logType')">
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[5, 10, 20, 50, 100]"
          :page-size="page.pageSize"
          :current-page="page.pageNum"
          layout="sizes, total, next, pager, prev"
          :total="page.total">
        </el-pagination>
      </div>
    </article>
  </div>
</template>

<script>
import { getLogList, doDeleteAll } from '@/api/system/logger'
export default {
  name: 'SYS_LOG',
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
      tableHeight: 369,
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
      checkList: ['content', 'userName', 'realName', 'operateDate', 'browser', 'operatingSystem', 'ipAddress', 'requestPath', 'logType'],
      // 表格过滤
      filter: {
        userName: '',
        realName: '',
        operateDate_start: '',
        operateDate_end: ''
      },
      filterParams: {},
      activedFilter: {
        userName: false,
        realName: false,
        operateDate: false
      },
      activedPop: {
        userName: false,
        realName: false,
        operateDate: false
      },
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
  mounted() {
    window.onresize = () => {
      return (() => {
        this.tableHeight = document.body.clientHeight - 255
      })()
    }
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
      this.checkList = value
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
    tableFilter(type, reset) {
      switch (type) {
        case 'userName':
          if (this.filter.userName) {
            this.filterParams.userName = this.filter.userName
            this.activedFilter[type] = true
          } else {
            delete this.filterParams.userName
            this.activedFilter[type] = false
          }
          if (reset === 'reset') {
            this.filter.userName = ''
            delete this.filterParams.userName
            this.activedFilter[type] = false
          }
          this.activedPop[type] = false
          break
        case 'realName':
          if (this.filter.realName) {
            this.filterParams.realName = this.filter.realName
            this.activedFilter[type] = true
          } else {
            delete this.filterParams.realName
            this.activedFilter[type] = false
          }
          if (reset === 'reset') {
            this.filter.realName = ''
            delete this.filterParams.realName
            this.activedFilter[type] = false
          }
          this.activedPop[type] = false
          break
        case 'operateDate':
          if (this.filter.operateDate_start) {
            this.filterParams.operateDate_start = this.filter.operateDate_start
            this.activedFilter[type] = true
          } else {
            delete this.filterParams.operateDate_start
          }
          if (this.filter.operateDate_end) {
            this.filterParams.operateDate_end = this.filter.operateDate_end
            this.activedFilter[type] = true
          } else {
            delete this.filterParams.operateDate_end
          }
          if (!this.filter.operateDate_start && !this.filter.operateDate_start) {
            this.activedFilter[type] = false
          }
          if (reset === 'reset') {
            this.filter.operateDate_start = ''
            this.filter.operateDate_end = ''
            delete this.filterParams.operateDate_start
            delete this.filterParams.operateDate_end
            this.activedFilter[type] = false
          }
          this.activedPop[type] = false
          break
      }
      Object.keys(this.filterParams).length !== 0 ? this.initParams.filter = this.filterParams : delete this.initParams.filter
      this.getInit()
    },
    // tableFilter(value, type) {
    //   switch (type) {
    //     case 'userName':
    //       value ? this.filterParams.userName = value : delete this.filterParams.userName
    //       break
    //     case 'realName':
    //       value ? this.filterParams.realName = value : delete this.filterParams.realName
    //       break
    //     case 'operateDate_start':
    //       value && value !== '2' ? this.filterParams.operateDate_start = value : delete this.filterParams.operateDate_start
    //       break
    //     case 'operateDate_end':
    //       value && value !== '2' ? this.filterParams.operateDate_end = value : delete this.filterParams.operateDate_end
    //       break
    //   }
    //   Object.keys(this.filterParams).length !== 0 ? this.initParams.filter = this.filterParams : delete this.initParams.filter
    //   this.getInit()
    // },
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
