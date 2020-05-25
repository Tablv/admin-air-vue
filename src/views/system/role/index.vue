<template>
  <div class="container">
    <header class="header">
      <div class="header-left">
        <div class="header-title">角色管理</div>
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
        <el-table-column prop="name" label="名称" v-if="checkList.includes('name')" sortable="custom">
          <template slot="header" slot-scope="scope">
            <span class="table-header-title">名称</span>
            <div @click.stop>
              <el-input
                v-model="filter.nameFilter"
                placeholder="名称"
                @change="tableFilter($event, 'name')"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="编码" v-if="checkList.includes('code')" :formatter="formatter" sortable="custom">
          <template slot="header" slot-scope="scope">
            <span class="table-header-title">编码</span>
            <div @click.stop>
              <el-input
                v-model="filter.codeFilter"
                placeholder="编码"
                @change="tableFilter($event, 'code')"/>
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
            <el-button type="primary" icon="el-icon-edit-outline" circle @click="handleEdit(scope.$index, scope.row)" />
            <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.$index, scope.row)" />
            <el-button type="success" icon="el-icon-s-custom" circle @click="handleAssignUser(scope.$index, scope.row)" />
            <el-button type="info" icon="el-icon-s-tools" circle @click="handleAssignMenu(scope.$index, scope.row)" />
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
            <el-form-item label="名称" prop="name">
              <el-input v-model="addForm.name" placeholder="请输入名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="编码" prop="code">
              <el-input v-model="addForm.code" placeholder="请输入编码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="状态" v-if="addForm.showStatus">
          <el-radio-group v-model="addForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
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
    <importDialog :importVisible="importVisible" templateNum="SYS_ROLE" @closeDialog="handleCloseImportDialog" :importTableData="importTableData"></importDialog>
  </div>
</template>

<script>
import importDialog from '@/components/importDialog'
export default {
  name: 'role',
  components: {
    importDialog
  },
  data() {
    return {
      // 表格数据
      tableData: [
        { name: '访客', code: 'GUEST', status: 1, remark: '' },
        { name: '超级管理员', code: 'SUPERADMIN', status: 1, remark: '' }
      ],
      // 表格配置
      headerList: [
        { prop: 'name', label: '名称' },
        { prop: 'code', label: '编码' },
        { prop: 'status', label: '状态' },
        { prop: 'remark', label: '备注' },
        { prop: 'operation', label: '操作' }
      ],
      // 表格配置选中
      checkList: ['name', 'code', 'status', 'remark', 'operation'],
      // 表格过滤
      filter: {
        nameFilter: '',
        codeFilter: '',
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
        code: '',
        remark: '',
        showStatus: false,
        status: 0
      },
      // 弹窗表单必填项校验规则
      addRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入编码', trigger: 'blur' }
        ]
      },
      // 导入弹窗表格数据
      importTableData: [
        { name: '状态', number: 3 },
        { name: '编码', number: 2 },
        { name: '名称', number: 1 }
      ]
    }
  },
  methods: {
    // 新增弹窗-打开
    handleOpenAdd() {
      this.addVisible = true
    },
    // 新增弹窗-关闭
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
    // 弹窗-选择角色
    selectRole(val) {
      console.log(val)
    },
    // 弹窗-选择组织
    selectOgn(val) {
      console.log(val)
    },
    // 导入弹窗-打开
    handleOpenImportDialog(command) {
      if (command === 'import') {
        this.importVisible = true
      }
    },
    // 导入弹窗-关闭
    handleCloseImportDialog(msg) {
      this.importVisible = msg
    },
    // 表格-配置
    changeCheckbox(value) {
      this.checkList = value
    },
    // 表格-空数据格式化
    formatter(row, column) {
      if (row[column.property] === '') {
        return '-'
      } else {
        return row[column.property]
      }
    },
    // 表格-远程排序
    sortChange(column) {
      console.log(column)
    },
    // 表格-筛选
    tableFilter(value, type) {
      if (type === 'name') {
        this.filter.nameFilter = value
      } else if (type === 'code') {
        this.filter.codeFilter = value
      } else {
        this.filter.statusFilter = value
      }
      console.log(value, type)
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
    // 表格操作-分配用户
    handleAssignUser(index, row) {

    },
    // 表格操作-分配菜单
    handleAssignMenu(index, row) {

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
