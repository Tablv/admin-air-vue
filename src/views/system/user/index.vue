<template>
  <div class="container">
    <header class="header">
      <div class="header-left">
        <div class="header-title">用户管理</div>
      </div>
      <div class="header-right">
        <el-button type="primary" icon="el-icon-plus" @click="handleOpenAdd">新增</el-button>
        <el-button icon="el-icon-refresh"></el-button>
        <el-dropdown trigger="click" @command="handleOpenImportDialog">
          <el-button icon="el-icon-download"><i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="import">导入 Excel</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
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
        <el-table-column prop="name" label="姓名" v-if="checkList.includes('name')" sortable="custom">
          <template slot="header" slot-scope="scope">
            <span class="table-header-title">姓名</span>
            <div @click.stop>
              <el-input
                v-model="filter.nameFilter"
              
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
                v-model="filter.userNameFilter"
              
                placeholder="用户名"
                @change="tableFilter($event, 'userName')"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" v-if="checkList.includes('status')" sortable="custom">
          <template slot="header" slot-scope="scope">
            <span class="table-header-title">状态</span>
            <el-select v-model="filter.statusFilter" placeholder="" @change="tableFilter($event, 'status')">
              <el-option
                v-for="item in filter.statusOptions"
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
            <el-button type="warning" icon="el-icon-key" circle @click="handleResetPassword(scope.$index, scope.row)" />
            <el-button type="primary" icon="el-icon-edit-outline" circle @click="handleEdit(scope.$index, scope.row)" />
            <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.$index, scope.row)" />
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
    <!-- 新增弹窗 -->
    <el-dialog :modal-append-to-body="false" :visible.sync="addVisible" :before-close="handleCloseAdd" :destroy-on-close="true">
      <div slot="title" class="dialog-title">
        <span>{{ addForm.showStatus ? '修改' : '新增' }}</span>
      </div>
      <el-form ref="addForm" :model="addForm" :rules="addRules" label-position="right" label-width="70px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="addForm.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="addForm.userName" placeholder="请输入用户名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="状态" v-if="addForm.showStatus">
          <el-radio-group v-model="addForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="addForm.role" multiple placeholder="请选择" @change="selectRole">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组织">
          <el-select v-model="addForm.organization" multiple placeholder="请选择" @change="selectOgn">
            <el-option
              v-for="item in ognOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" :rows="4" v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 导入 -->
    <importDialog :importVisible="importVisible" templateNum="SYS_USER" @closeDialog="handleCloseImportDialog" :importTableData="importTableData"></importDialog>
  </div>
</template>

<script>
import importDialog from '@/components/importDialog'
import { getUserList } from '@/api/system'
export default {
  name: 'user',
  components: {
    importDialog
  },
  data() {
    return {
      // 表格数据
      tableData: [
        { name: '系统管理员', username: 'admin', status: 1, remark: '123' },
        { name: '系统管理员', username: '', status: 0, remark: '' },
        { name: '系统管理员', username: 'admin', status: 1, remark: '' }
      ],
      // 表格配置
      headerList: [
        { prop: 'name', label: '姓名' },
        { prop: 'username', label: '用户名' },
        { prop: 'status', label: '状态' },
        { prop: 'remark', label: '备注' },
        { prop: 'operation', label: '操作' }
      ],
      // 表格配置选中
      checkList: ['name', 'username', 'status', 'remark', 'operation'],
      // 表格过滤
      filter: {
        nameFilter: '',
        userNameFilter: '',
        statusFilter: '2',
        statusOptions: [
          { value: '2', label: ' ' },
          { value: '1', label: '启用' },
          { value: '0', label: '禁用' }
        ]
      },
      // 分页
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      // 新增弹窗
      addVisible: false,
      // 导入弹窗
      importVisible: false,
      // 弹窗表单
      addForm: {
        name: '',
        userName: '',
        role: [],
        organization: [],
        remark: '',
        showStatus: false,
        status: 0
      },
      // 弹窗表单必填项校验规则
      addRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
      },
      // 角色选择框
      roleOptions: [
        { value: '1', label: '访客' },
        { value: '2', label: '超级管理员' }
      ],
      // 组织选择框
      ognOptions: [
        { value: '1', label: 'XXX公司' },
        { value: '2', label: '人力资源部' }
      ],
      // 导入弹窗表格数据
      importTableData: [
        { name: '用户名', number: 2 },
        { name: '姓名', number: 3 },
        { name: '状态', number: 4 },
        { name: '密码', number: 5 }
      ]
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
      this.addForm.showStatus = false
    },
    // 弹窗-保存
    handleSave() {
      this.addVisible = false
      this.addForm.showStatus = false
    },
    // 弹窗-关闭
    handleClose() {
      this.addVisible = false
      this.addForm.showStatus = false
    },
    // 表格操作-编辑
    handleEdit(index, row) {
      console.log(index, row)
      this.addForm.showStatus = true
      this.addVisible = true
    },
    // 弹窗选择角色
    selectRole(val) {
      console.log(val)
    },
    // 弹窗选择组织
    selectOgn(val) {
      console.log(val)
    },
    // 打开导入弹窗
    handleOpenImportDialog(command) {
      if (command === 'import') {
        this.importVisible = true
      }
    },
    // 关闭导入弹窗
    handleCloseImportDialog(msg) {
      this.importVisible = msg
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
        this.filter.nameFilter = value
      } else if (type === 'userName') {
        this.filter.userNameFilter = value
      } else {
        this.filter.statusFilter = value
      }
      console.log(value, type)
    },
    // 表格操作-重置密码
    handleResetPassword(index, row) {
      console.log(index, row)
      this.$confirm('确认重置吗？重置后将恢复到系统默认设置的密码！', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        cancelButtonClass: 'messageBoxCancelButton'
      }).then(action => {
        if (action === 'confirm') {
          console.log('确定重置')
        }
      }).catch(() => {})
    },
    // 表格操作-删除
    handleDelete(index, row) {
      console.log(index, row)
      this.$confirm('删除后将不可恢复，确认删除吗？', '信息', {
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
