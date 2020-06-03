<template>
  <div class="container">
    <header class="header">
      <el-row type="flex" justify="space-between">
        <el-col :span="6">
          <div class="header-title">用户管理</div>
        </el-col>
        <el-col :span="18">
          <div class="button-group">
            <el-button type="primary" icon="el-icon-plus" @click="handleOpenAdd">新增</el-button>
            <el-button icon="el-icon-refresh" @click="getInit" class="first-button"></el-button>
            <el-dropdown trigger="click" @command="handleOpenImportDialog" class="center-button">
              <el-button icon="el-icon-download"><i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="import">导入 Excel</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
        :data="tableData"
        border
        size="medium"
        @sort-change="sortChange"
        style="width: 100%"
        v-loading="listLoading"
        header-cell-class-name="header-cell">
        <el-table-column prop="name" label="姓名" v-if="checkList.includes('name')" sortable="custom">
          <template slot="header" slot-scope="scope">
            <span>姓名</span>
            <span @click.stop>
              <el-popover
                placement="bottom"
                width="160"
                trigger="click"
                v-model="activedPop[scope.column.property]">
                <el-input
                  v-model="filter.name"
                  placeholder="姓名"/>
                <div class="table-filter-btn">
                  <el-button type="primary" @click="tableFilter('name')">筛选</el-button>
                  <el-button style="float: right;" @click="tableFilter('name', 'reset')">重置</el-button>
                </div>
                <i slot="reference" :style="{ color: (activedFilter[scope.column.property] ? '#409EFF' : '#909399') }" class="el-icon-search"></i>
              </el-popover>
            </span>
            <!-- <div @click.stop>
              <el-input
                v-model="filter.name"
                placeholder="姓名"
                @change="tableFilter($event, 'name')"/>
            </div> -->
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" v-if="checkList.includes('username')" :formatter="formatter" sortable="custom">
          <template slot="header" slot-scope="scope">
            <span>用户名</span>
            <span @click.stop>
              <el-popover
                placement="bottom"
                width="160"
                trigger="click"
                v-model="activedPop[scope.column.property]">
                <el-input
                  v-model="filter.username"
                  placeholder="姓名"/>
                <div class="table-filter-btn">
                  <el-button type="primary" @click="tableFilter('username')">筛选</el-button>
                  <el-button style="float: right;" @click="tableFilter('username', 'reset')">重置</el-button>
                </div>
                <i slot="reference" :style="{ color: (activedFilter[scope.column.property] ? '#409EFF' : '#909399') }" class="el-icon-search"></i>
              </el-popover>
            </span>
            <!-- <div @click.stop>
              <el-input
                v-model="filter.username"
                placeholder="用户名"
                @change="tableFilter($event, 'username')"/>
            </div> -->
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" v-if="checkList.includes('status')" sortable="custom">
          <template slot="header" slot-scope="scope">
            <span>状态</span>
            <span @click.stop>
              <el-popover
                placement="bottom"
                width="160"
                trigger="click"
                v-model="activedPop[scope.column.property]">
                <el-select v-model="filter.status" placeholder="">
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <div class="table-filter-btn">
                  <el-button type="primary" @click="tableFilter('status')">筛选</el-button>
                  <el-button style="float: right;" @click="tableFilter('status', 'reset')">重置</el-button>
                </div>
                <i slot="reference" :style="{ color: (activedFilter[scope.column.property] ? '#409EFF' : '#909399') }" class="el-icon-search"></i>
              </el-popover>
            </span>
            <!-- <el-select v-model="filter.status" placeholder="" @change="tableFilter($event, 'status')">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select> -->
          </template>
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="0"
              :inactive-value="1"
              active-color="#80B762"
              inactive-color="#ff4949"
              @change="handleChangeStatus(scope.row)">
            </el-switch>
            <!-- <span :style="{ color: (scope.row.status === 0 ? '#80B762' : 'red')}">{{ scope.row.status === 0 ? '启用' : '禁用' }}</span> -->
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" v-if="checkList.includes('remark')" :formatter="formatter" sortable="custom">
        </el-table-column>
        <el-table-column prop="operation" label="操作" v-if="checkList.includes('operation')">
          <template slot-scope="scope">
            <el-button type="text" @click="handleResetPassword(scope.$index, scope.row)">重置密码</el-button>
            <el-button type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
              <el-input v-model="addForm.username" placeholder="请输入用户名" :disabled="showStatus"></el-input>
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
          <el-select v-model="addForm.roleIds" multiple filterable placeholder="请选择" @change="selectRole" clearable>
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
import { getUserList, getRoleList, getDeptList, doAddUser, doEditUser, doGetUserInfo, doResetPwd, doDeleteUser, doCheckRepeat } from '@/api/system/user'
import { validName } from '@/utils/validate'
import importDialog from '@/components/importDialog'
export default {
  name: 'SYS_USER',
  components: {
    importDialog
  },
  data() {
    var validUserName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('该项为必填项'))
      } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
        callback(new Error('必须为英文或数字'))
      } else {
        let data = {
          tableName: 'AD_USER',
          columnName: 'USERNAME',
          value: value,
          username: value
        }
        if (this.showStatus) data.oldval = value
        doCheckRepeat(data).then(res => {
          if (res.valid === false) {
            return callback(new Error('用户名已存在，请重新输入'))
          } else {
            callback()
          }
        })
      }
    }
    return {
      // 初始化参数
      initParams: {
        order: 'asc',
        offset: 0,
        limit: 10
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
      activedFilter: {
        name: false,
        username: false,
        status: false
      },
      activedPop: {
        name: false,
        username: false,
        status: false
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
          { required: true, validator: validName, trigger: 'blur' }
        ],
        username: [
          { required: true, validator: validUserName, trigger: 'blur' }
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
      getRoleList().then(res => {
        let { success, result } = res
        if (success === true) {
          this.roleOptions = result
        }
      })
      getDeptList({ deptId: 0 }).then(res => {
        let { success, result } = res
        // if (success === true) {}
        this.$refs.treeSelect.treeDataUpdateFun(result)
      })
    },
    // 弹窗---保存
    handleSave() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          let addForm = {}
          addForm = JSON.parse(JSON.stringify(this.addForm))
          if (!this.showStatus) delete addForm.status
          if (addForm.roleIds && addForm.roleIds.length > 0) {
            addForm.roleIds = addForm.roleIds.join(',')
          } else {
            delete addForm.roleIds
          }
          if (addForm.depts && addForm.depts.length > 0) {
            addForm.depts = addForm.depts.join(',')
          } else {
            delete addForm.depts
          }
          if (!this.showStatus) {
            doAddUser(addForm).then(res => {
              if (res.success === true) {
                this.$message({
                  message: '操作成功！',
                  type: 'success'
                })
                this.getInit()
              }
            })
          } else {
            let editForm = {}
            editForm = {
              id: addForm.id,
              name: addForm.name ? addForm.name : null,
              username: addForm.username ? addForm.username : null,
              status: this.showStatus ? addForm.status : null,
              roleIds: addForm.roleIds ? addForm.roleIds : null,
              depts: addForm.depts ? addForm.depts : null,
              remark: addForm.remark ? addForm.remark : null
            }
            Object.keys(editForm).forEach(item => {
              if (editForm[item] === null) delete editForm[item]
            })
            doEditUser(editForm).then(res => {
              if (res.success === true) {
                this.$message({
                  message: '操作成功！',
                  type: 'success'
                })
                this.getInit()
              }
            })
          }
          this.addVisible = false
          this.showStatus = false
          this.$refs['addForm'].resetFields()
        }
      })
    },
    // 弹窗---关闭
    handleClose() {
      this.addVisible = false
      this.showStatus = false
      this.$refs['addForm'].resetFields()
    },
    // 表格操作---改变状态
    handleChangeStatus(row) {
      doGetUserInfo({ id: row.id }).then(res => {
        let { success, result } = res
        if (success === true) {
          let editForm = {}
          editForm = {
            id: result.id,
            name: result.name,
            username: result.username,
            status: row.status,
            roleIds: result.roleIds ? result.roleIds : null,
            depts: result.depts ? result.depts : null,
            remark: result.remark ? result.remark : null
          }
          Object.keys(editForm).forEach(item => {
            if (editForm[item] === null) delete editForm[item]
          })
          doEditUser(editForm).then(res => {
            if (res.success === true) {
              this.$message({
                message: '操作成功！',
                type: 'success'
              })
              this.getInit()
            }
          })
        }
      })
    },
    // 表格操作---编辑
    handleEdit(index, row) {
      this.showStatus = true
      this.addVisible = true
      getRoleList().then(res => {
        let { success, result } = res
        if (success === true) {
          this.roleOptions = result
        }
      })
      getDeptList({ deptId: 0 }).then(res => {
        let { success, result } = res
        // if (success === true) {}
        this.$refs.treeSelect.treeDataUpdateFun(result)
      })
      doGetUserInfo({ id: row.id }).then(res => {
        let { success, result } = res
        if (success === true) {
          this.addForm = result
          result.roleIds !== '' ? this.addForm.roleIds = result.roleIds.split(', ') : this.addForm.roleIds = []
          result.depts !== '' ? this.addForm.depts = result.depts.split(', ') :this.addForm.depts = []
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
    tableFilter(type, reset) {
      switch (type) {
        case 'name':
          if (this.filter.name) {
            this.filterParams.name = this.filter.name
            this.activedFilter[type] = true
          } else {
            delete this.filterParams.name
            this.activedFilter[type] = false
          }
          if (reset === 'reset') {
            this.filter.name = ''
            delete this.filterParams.name
            this.activedFilter[type] = false
          }
          this.activedPop[type] = false
          break
        case 'username':
          if (this.filter.username) {
            this.filterParams.username = this.filter.username
            this.activedFilter[type] = true
          } else {
            delete this.filterParams.username
            this.activedFilter[type] = false
          }
          if (reset === 'reset') {
            this.filter.username = ''
            delete this.filterParams.username
            this.activedFilter[type] = false
          }
          this.activedPop[type] = false
          break
        case 'status':
          if (this.filter.status && this.filter.status !== '2') {
            this.filterParams.status = this.filter.status
            this.activedFilter[type] = true
          } else {
            delete this.filterParams.status
            this.activedFilter[type] = false
          }
          if (reset === 'reset') {
            this.filter.status = ''
            delete this.filterParams.status
            this.activedFilter[type] = false
          }
          this.activedPop[type] = false
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
          doResetPwd({ userId: row.id }).then(res => {
            if (res.success === true) {
              this.$message({
                message: '操作成功！',
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
          doDeleteUser({ id: row.id }).then(res => {
            if (res.success === true) {
              this.$message({
                message: '操作成功！',
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

<style lang="scss" scoped>

</style>
