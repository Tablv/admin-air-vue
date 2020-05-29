<template>
  <div class="container">
    <header class="header">
      <div class="header-left">
        <div class="header-title">用户管理</div>
      </div>
      <div class="header-right">
        <el-button type="primary" icon="el-icon-plus" @click="handleOpenAdd">新增</el-button>
        <el-button icon="el-icon-refresh" @click="getInit"></el-button>
        <el-dropdown trigger="click" @command="handleOpenImportDialog">
          <el-button icon="el-icon-download"><i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="import">导入 Excel</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dropdown trigger="click">
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
        v-loading="listLoading"
        header-cell-class-name="header-cell">
        <el-table-column prop="name" label="姓名" v-if="checkList.includes('name')" sortable="custom">
          <template slot="header" slot-scope="scope">
            <span class="table-header-title">姓名</span>
            <div @click.stop>
              <el-input
                v-model="filter.name"
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
                v-model="filter.username"
                placeholder="用户名"
                @change="tableFilter($event, 'username')"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" v-if="checkList.includes('status')" sortable="custom">
          <template slot="header" slot-scope="scope">
            <span class="table-header-title">状态</span>
            <el-select v-model="filter.status" placeholder="" @change="tableFilter($event, 'status')">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
          <template slot-scope="scope">
            <span :style="{ color: (scope.row.status === 0 ? '#80B762' : 'red')}">{{ scope.row.status === 0 ? '启用' : '禁用' }}</span>
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
          :page-sizes="[5, 10, 20, 50, 100]"
          :page-size="page.pageSize"
          :current-page="page.pageNum"
          layout="sizes, total, next, pager, prev"
          :total="page.total">
        </el-pagination>
      </div>
    </article>
    <!-- 新增弹窗 -->
    <el-dialog :modal-append-to-body="false" :visible.sync="addVisible" :before-close="handleClose" :destroy-on-close="true">
      <div slot="title" class="dialog-title">
        <span>{{ showStatus ? '修改' : '新增' }}</span>
      </div>
      <el-form ref="addForm" :model="addForm" :rules="addRules" label-position="right" label-width="70px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="addForm.name" placeholder="请输入姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="状态" v-if="showStatus" prop="status">
          <el-radio-group v-model="addForm.status">
            <el-radio :label="0">启用</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="addForm.roleIds" multiple filterable placeholder="请选择"@change="selectRole" clearable>
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组织" prop="depts">
          <el-tree-select
            v-model="addForm.depts"
            :selectParams="selectParams"
            :treeParams="treeParams"
            @searchFun="handleTreeSelectFilter"
            ref="treeSelect"/>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="5" v-model="addForm.remark"></el-input>
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
import { getUserList, getRoleList, getDeptList, doAddUser, doGetUserInfo, doResetPwd, doDeleteUser } from '@/api/system'
import { validName, validUserName } from '@/utils/validate'
import importDialog from '@/components/importDialog'
export default {
  name: 'user',
  components: {
    importDialog
  },
  data() {
    return {
      // 初始化参数
      initParams: {
        r: Math.random(),
        order: 'asc',
        offset: 0,
        limit: 10,
        _: new Date().getTime()
      },
      // 表格数据
      tableData: [],
      // 表格loading
      listLoading: false,
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
        name: '',
        username: '',
        status: '2'
      },
      statusOptions: [
        { value: '2', label: ' ' },
        { value: '0', label: '启用' },
        { value: '1', label: '禁用' }
      ],
      filterParams: {},
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
        username: '',
        roleIds: [],
        depts: [],
        remark: '',
        status: 0
      },
      showStatus: false,
      // 弹窗表单必填项校验规则
      addRules: {
        name: [
          { required: true, validator: validName, trigger: ['blur', 'change'] }
        ],
        username: [
          { required: true, validator: validUserName, trigger: ['blur', 'change'] }
        ]
      },
      // 角色选择框
      roleOptions: [],
      selectParams: {
        multiple: true,
        clearable: true,
        placeholder: '请选择'
      },
      treeParams: {
        clickParent: false,
        filterable: true,
        'check-strictly': true,
        'default-expand-all': true,
        'expand-on-click-node': false,
        data: [],
        props: {
          children: 'children',
          label: 'name',
          value: 'id'
        }
      },
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
    this.getInit()
  },
  mounted() {},
  methods: {
    // 初始化
    getInit() {
      this.listLoading = true
      getUserList(this.initParams).then(res => {
        this.listLoading = false
        let { success, result } = res
        if (success === true) {
          this.tableData = result.list
          this.page = {
            pageSize: result.pageSize,
            pageNum: result.pageNum,
            total: result.total
          }
        }
      })
    },
    // 新增弹窗---打开
    handleOpenAdd() {
      this.addVisible = true
      getRoleList({ r: Math.random(), _type: 'query' }).then(res => {
        let { success, result } = res
        if (success === true) {
          this.roleOptions = result
        }
      })
      getDeptList({ deptId: 0, r: Math.random() }).then(res => {
        let { success, result } = res
        // if (success === true) {}
        this.$refs.treeSelect.treeDataUpdateFun(result)
      })
    },
    // 弹窗---保存
    handleSave() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          if (!this.showStatus) delete this.addForm.status
          if (this.addForm.roleIds.length === 0) delete this.addForm.roleIds
          if (this.addForm.depts.length === 0) delete this.addForm.depts
          console.log(this.addForm)
          // doAddUser().then(res => {
          //   this.addVisible = false
          //   this.showStatus = false
          // })
          // this.$message({
          //   message: '操作成功',
          //   type: 'success'
          // })
          // this.$refs['addForm'].resetFields()
        }
      })
    },
    // 弹窗---关闭
    handleClose() {
      this.addVisible = false
      this.showStatus = false
      this.$refs['addForm'].resetFields()
    },
    // 表格操作---编辑
    handleEdit(index, row) {
      this.showStatus = true
      this.addVisible = true
      getRoleList({ r: Math.random(), _type: 'query' }).then(res => {
        let { success, result } = res
        if (success === true) {
          this.roleOptions = result
        }
      })
      getDeptList({ deptId: 0, r: Math.random() }).then(res => {
        let { success, result } = res
        // if (success === true) {}
        this.$refs.treeSelect.treeDataUpdateFun(result)
      })
      doGetUserInfo({ id: row.id, r: Math.random() }).then(res => {
        let { success, result } = res
        if (success === true) {
          console.log(result)
          this.addForm = result
          this.addForm.roleIds = result.roleIds.split(', ')
          this.addForm.depts = result.depts.split(', ')
          console.log(this.addForm)
        }
      })
    },
    // 弹窗---选择角色
    selectRole(val) {
      this.addForm.roleIds = val
    },
    // 弹窗---组织树过滤
    handleTreeSelectFilter(value) {
      this.$refs.treeSelect.filterFun(value)
    },
    // 导入弹窗---打开
    handleOpenImportDialog(command) {
      if (command === 'import') {
        this.importVisible = true
      }
    },
    // 导入弹窗---关闭
    handleCloseImportDialog(msg) {
      this.importVisible = msg
    },
    // 表格---配置
    changeCheckbox(value) {
      this.checkList = value
    },
    // 表格---空数据格式化
    formatter(row, column) {
      if (row[column.property] === null) {
        return '-'
      } else {
        return row[column.property]
      }
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
    // 表格---筛选
    tableFilter(value, type) {
      switch (type) {
        case 'name':
          value ? this.filterParams.name = value : delete this.filterParams.name
          break
        case 'username':
          value ? this.filterParams.username = value : delete this.filterParams.username
          break
        case 'status':
          value && value !== '2' ? this.filterParams.status = value : delete this.filterParams.status
          break
      }
      Object.keys(this.filterParams).length !== 0 ? this.initParams.filter = this.filterParams : delete this.initParams.filter
      this.getInit()
    },
    // 表格操作---重置密码
    handleResetPassword(index, row) {
      this.$confirm('确认重置吗？重置后将恢复到系统默认设置的密码！', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        cancelButtonClass: 'messageBoxCancelButton'
      }).then(action => {
        if (action === 'confirm') {
          doResetPwd({ userId: row.id, r: Math.random() }).then(res => {
            if (res.success === true) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
            }
          })
        }
      }).catch(() => {})
    },
    // 表格操作---删除
    handleDelete(index, row) {
      this.$confirm('删除后将不可恢复，确认删除吗？', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        cancelButtonClass: 'messageBoxCancelButton'
      }).then(action => {
        if (action === 'confirm') {
          doDeleteUser({ id: row.id, r: Math.random() }).then(res => {
            if (res.success === true) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.getInit()
            }
          })
        }
      }).catch(() => {})
    },
    // 分页---改变每页数量
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    // 分页---改变页码
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
