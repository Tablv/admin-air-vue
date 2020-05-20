<template>
  <div class="user">
    <header class="header">
      <div class="header-left">
        <div class="header-title">用户管理</div>
      </div>
      <div class="header-right">
        <el-button type="primary" size="mini" icon="el-icon-plus" @click="handleOpenAdd">新增</el-button>
        <el-button size="mini" icon="el-icon-refresh"></el-button>
        <el-dropdown trigger="click">
          <el-button size="mini" icon="el-icon-upload2"><i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>导入 Excel</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown trigger="click">
          <el-button size="mini" icon="el-icon-download">
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>导出 Excel</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown trigger="click" :hide-on-click="false">
          <el-button size="mini" icon="el-icon-s-grid">
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
        @sort-change="sortChange"
        style="width: 100%"
        header-cell-class-name="header-cell">
        <el-table-column prop="name" label="姓名" v-if="checkList.includes('name')" sortable="custom">
          <template slot="header" slot-scope="scope">
            <span class="table-header-title">姓名</span>
            <div @click.stop>
              <el-input
                v-model="nameFilter"
                size="mini"
                placeholder="姓名"
                @change="tableFilter($event, 'name')"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" v-if="checkList.includes('username')" :formatter="formatter" sortable="custom">
          <template slot="header" slot-scope="scope">
            <span class="table-header-title">用户名</span>
            <div @click.stop>
              <el-input
                v-model="userNameFilter"
                size="mini"
                placeholder="用户名"
                @change="tableFilter($event, 'userName')"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" v-if="checkList.includes('status')" sortable="custom">
          <template slot="header" slot-scope="scope">
            <span class="table-header-title">状态</span>
            <el-select v-model="statusFilter" placeholder="" size="mini" @change="tableFilter($event, 'status')">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
          <template slot-scope="scope">
            <span :style="{ color: (scope.row.status === 1 ? '#80B762' : 'red')}">{{ scope.row.status === 1 ? '启用' : '禁用' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" v-if="checkList.includes('remark')" :formatter="formatter" sortable="custom">
        </el-table-column>
        <el-table-column prop="operation" label="操作" v-if="checkList.includes('operation')">
          <template slot-scope="scope">
            <el-button type="warning" icon="el-icon-edit" circle size="mini" @click="handleEdit(scope.$index, scope.row)" />
            <el-button type="primary" icon="el-icon-check" circle size="mini" @click="handleEdit(scope.$index, scope.row)" />
            <el-button type="danger" icon="el-icon-message" circle size="mini" @click="handleEdit(scope.$index, scope.row)" />
          </template>
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
    <el-dialog :modal-append-to-body="false" :visible.sync="addVisible" :before-close="handleCloseAdd" :destroy-on-close="true">
      <div slot="title" class="dialog-title">
        <span>新增</span>
      </div>
      <!-- <el-form :model="form">
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import { getUserList } from '@/api/system'
export default {
  data() {
    return {
      tableData: [
        { name: '系统管理员', username: 'admin', status: 1, remark: '123' },
        { name: '系统管理员', username: '', status: 0, remark: '' },
        { name: '系统管理员', username: 'admin', status: 1, remark: '' }
      ],
      headerList: [
        { prop: 'name', label: '姓名' },
        { prop: 'username', label: '用户名' },
        { prop: 'status', label: '状态' },
        { prop: 'remark', label: '备注' },
        { prop: 'operation', label: '操作' }
      ],
      checkList: ['name', 'username', 'status', 'remark', 'operation'],
      nameFilter: '',
      userNameFilter: '',
      statusFilter: '2',
      statusOptions: [
        { value: '2', label: ' ' },
        { value: '1', label: '启用' },
        { value: '0', label: '禁用' }
      ],
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      addVisible: false
    }
  },
  created() {
    // this.getInit()
  },
  methods: {
    // 初始化
    getInit() {
      let params = {
        r: 0.552986322181209,
        order: 'asc',
        offset: 0,
        limit: 10,
        _: 1589939099167
      }
      getUserList(params).then(res => {
        console.log(res)
      })
    },
    // 打开新增弹窗
    handleOpenAdd() {
      this.addVisible = true
    },
    // 关闭新增弹窗
    handleCloseAdd() {
      this.addVisible = false
    },
    // 表格配置
    changeCheckbox(value) {
      this.checkList = value
    },
    // 表格空数据格式化
    formatter(row, column) {
      if (row[column.property] === '') {
        return '-'
      } else {
        return row[column.property]
      }
    },
    // 表格远程排序
    sortChange(column) {
      console.log(column)
    },
    // 表格筛选
    tableFilter(value, type) {
      if (type === 'name') {
        this.nameFilter = value
      } else if (type === 'userName') {
        this.userNameFilter = value
      } else {
        this.statusFilter = value
      }
      console.log(value, type)
    },
    // 表格操作
    handleEdit(index, row) {
      console.log(index, row)
    },
    // 改变每页数量
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    // 改变页码
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
