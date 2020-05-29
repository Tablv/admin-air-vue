<template>
  <div class="container">
    <header class="header">
      <div class="header-left">
        <div class="header-title">日志管理</div>
      </div>
      <div class="header-right">
        <el-button type="primary" icon="el-icon-delete-solid" @click="handleDelete">清空</el-button>
        <el-button icon="el-icon-refresh"></el-button>
        <el-dropdown trigger="click" @command="">
          <el-button icon="el-icon-upload2">
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="import">导出 Excel</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown trigger="click" :hide-on-click="false">
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
    </header>
    <article>
      <el-table
        :data="tableData"
        border
        size="medium"
        @sort-change="sortChange"
        style="width: 100%"
        header-cell-class-name="header-cell">
        <el-table-column prop="logContent" label="日志内容" width="150" v-if="checkList.includes('logContent')">
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="130" v-if="checkList.includes('username')"  sortable="custom">
          <template slot="header" slot-scope="scope">
            <span class="table-header-title">用户名</span>
            <div @click.stop>
              <el-input
                v-model="filter.userNameFilter"
                placeholder="用户名"
                @change="tableFilter($event, 'userName')"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作人" width="130" v-if="checkList.includes('operator')" sortable="custom">
          <template slot="header" slot-scope="scope">
            <span class="table-header-title">操作人</span>
            <div @click.stop>
              <el-input
                v-model="filter.operatorFilter"
                placeholder="操作人"
                @change="tableFilter($event, 'operator')"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="操作时间" width="160" v-if="checkList.includes('time')"  sortable="custom">
          <template slot="header" slot-scope="scope">
            <span class="table-header-title">操作时间</span>
            <div @click.stop>
              <el-date-picker
                v-model="filter.startTimeFilter"
                type="date"
                placeholder="起始日期"
                value-format="yyyy-MM-dd"
                @change="tableFilter($event, 'startTime')">
              </el-date-picker>
              <el-date-picker
                v-model="filter.endTimeFilter"
                type="date"
                placeholder="截止日期"
                value-format="yyyy-MM-dd"
                @change="tableFilter($event, 'endTime')">
              </el-date-picker>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="browser" label="浏览器" width="130" v-if="checkList.includes('browser')">
        </el-table-column>
        <el-table-column prop="system" label="操作系统" width="130" v-if="checkList.includes('system')">
        </el-table-column>
        <el-table-column prop="ipAddress" label="IP地址" width="150" v-if="checkList.includes('ipAddress')">
        </el-table-column>
        <el-table-column prop="requestAddress" label="请求地址" width="300" v-if="checkList.includes('requestAddress')">
        </el-table-column>
        <el-table-column prop="logType" label="日志类型" width="100" v-if="checkList.includes('logType')">
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 50, 100]"
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
export default {
  name: 'SYS_LOG',
  data() {
    return {
      // 表格数据
      tableData: [
        { logContent: '查询数据集中所有列信息', username: 'admin', operator: '系统管理员', time: '2020-04-30 15:38:48', browser: 'Chrome 8', system: 'Windows 10', ipAddress: '192.168.111.83', requestAddress: 'http://127.0.0.1:8080/admin-air/dataset/tableinfo/findAllOfDataset', logType: 'info' },
        { logContent: '查询数据集中所有列信息', username: 'admin', operator: '系统管理员', time: '2020-04-30 15:38:48', browser: 'Chrome 8', system: 'Windows 10', ipAddress: '192.168.111.83', requestAddress: 'http://127.0.0.1:8080/admin-air/dataset/tableinfo/findAllOfDataset', logType: 'info' },
        { logContent: '查询数据集中所有列信息', username: 'admin', operator: '系统管理员', time: '2020-04-30 15:38:48', browser: 'Chrome 8', system: 'Windows 10', ipAddress: '192.168.111.83', requestAddress: 'http://127.0.0.1:8080/admin-air/dataset/tableinfo/findAllOfDataset', logType: 'info' }
      ],
      // 表格配置
      headerList: [
        { prop: 'logContent', label: '日志内容' },
        { prop: 'username', label: '用户名' },
        { prop: 'operator', label: '操作人' },
        { prop: 'time', label: '操作时间' },
        { prop: 'browser', label: '浏览器' },
        { prop: 'system', label: '操作系统' },
        { prop: 'ipAddress', label: 'IP地址' },
        { prop: 'requestAddress', label: '请求地址' },
        { prop: 'logType', label: '日志类型' }
      ],
      // 表格配置选中
      checkList: ['logContent', 'username', 'operator', 'time', 'browser', 'system', 'ipAddress', 'requestAddress', 'logType'],
      // 表格过滤
      filter: {
        userNameFilter: '',
        operatorFilter: '',
        startTimeFilter: '',
        endTimeFilter: ''
      },
      // 分页
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      }
    }
  },
  methods: {
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
          console.log('确定删除')
        }
      }).catch(() => {})
    },
    // 表格-配置
    changeCheckbox(value) {
      this.checkList = value
    },
    // 表格-远程排序
    sortChange(column) {
      console.log(column)
    },
    // 表格-筛选
    tableFilter(value, type) {
      console.log(value, type)
      if (type === 'userName') {
        this.filter.userNameFilter = value
      } else if (type === 'operator') {
        this.filter.operatorFilter = value
      } else if (type === 'startTime') {
        this.filter.startTimeFilter = value
      } else {
        this.filter.endTimeFilter = value
      }
    },
    // 分页-改变每页数量
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    // 分页-改变页码
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
