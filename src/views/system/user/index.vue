<template>
  <div class="container">
    <article>
      <gw-table
        ref="gwTable"
        :table-config="tableConfig"
        @changeColumns="changeColumns"
        @add="handleOpenAdd"
        @import="handleOpenImportDialog"
      >
        <template
          slot="conver"
          slot-scope="conver"
        >
          <span
            v-if="conver.column.property === 'status'"
            :style="{ color: (conver.row.status === 0 ? '#80B762' : '#ff0000')}"
          >{{ conver.row.status === 0 ? '启用' : '禁用' }}</span>
        </template>
        <template
          slot="operation"
          slot-scope="operation"
        >
          <el-button
            type="text"
            @click="handleResetPassword(operation.index, operation.row)"
          >
            重置密码
          </el-button>
          <el-button
            type="text"
            @click="handleEdit(operation.index, operation.row)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            @click="handleDelete(operation.index, operation.row)"
          >
            删除
          </el-button>
        </template>
      </gw-table>
    </article>
    <!-- 新增弹窗 -->
    <el-dialog
      :modal-append-to-body="false"
      :visible.sync="addVisible"
      :before-close="handleClose"
      :destroy-on-close="true"
    >
      <div
        slot="title"
        class="dialog-title"
      >
        <span>{{ showStatus ? '修改' : '新增' }}</span>
      </div>
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="addRules"
        label-position="right"
        label-width="70px"
        status-icon
        :inline-message="true"
      >
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="姓名"
              prop="name"
            >
              <el-input
                v-model="addForm.name"
                placeholder="请输入姓名"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="11"
            :offset="2"
          >
            <el-form-item
              label="用户名"
              prop="username"
            >
              <el-input
                v-model="addForm.username"
                placeholder="请输入用户名"
                :disabled="showStatus"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          v-if="showStatus"
          label="状态"
          prop="status"
        >
          <el-radio-group v-model="addForm.status">
            <el-radio :label="0">
              启用
            </el-radio>
            <el-radio :label="1">
              禁用
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="角色"
          prop="roleIds"
        >
          <el-select
            v-model="addForm.roleIds"
            multiple
            filterable
            placeholder="请选择"
            clearable
            @change="selectRole"
          >
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="组织"
          prop="depts"
        >
          <el-tree-select
            ref="treeSelect"
            v-model="addForm.depts"
            :select-params="selectParams"
            :tree-params="treeParams"
            @searchFun="handleTreeSelectFilter"
          />
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark"
        >
          <el-input
            v-model="addForm.remark"
            type="textarea"
            :rows="5"
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="handleSave"
        >
          保存
        </el-button>
        <el-button @click="handleClose">
          关闭
        </el-button>
      </div>
    </el-dialog>
    <!-- 导入 -->
    <import-dialog
      :import-visible="importVisible"
      template-num="SYS_USER"
      :import-table-data="importTableData"
      @closeDialog="handleCloseImportDialog"
    />
  </div>
</template>

<script>
import { getRoleList, getDeptList, doAddUser, doEditUser, doGetUserInfo, doResetPwd, doDeleteUser, doCheckRepeat } from '@/api/system/user'
import { validName } from '@/utils/validate'
import importDialog from '@/components/importDialog'
import GwTable from '@/components/GwTable'
export default {
  name: 'SYSUSER',
  components: {
    importDialog,
    GwTable
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
          value,
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
      // 表格
      tableConfig: {
        api: '/system/user/list',
        // 表格列数据
        columns: [
          { prop: 'name', label: '姓名', sort: 'custom', filter: { type: 'input', data: 'name' } },
          { prop: 'username', label: '用户名', sort: 'custom', filter: { type: 'input', data: 'username' } },
          // { prop: 'status', label: '状态', sort: 'custom', conver: true, filter: { type: 'select', data: 'status', option: '/modelling/base/category/CO215' } },
          // { prop: 'remark', label: '备注', sort: 'custom', filter: { type: 'select', data: 'remark', option: '/modelling/base/category/CO063' } },
          { prop: 'status', label: '状态', sort: 'custom', conver: true, filter: { type: 'select', data: 'status', option: { '0': '启用', '1': '禁用' } } },
          { prop: 'remark', label: '备注', sort: 'custom' },
          { prop: 'operation', label: '操作', width: '180' }
        ],
        // 表格配置选中
        checkedColumns: ['name', 'username', 'status', 'remark', 'operation'],
        title: '用户管理',
        // 按钮配置
        buttons: ['add', 'refresh', 'import', 'export', 'columns'],
        // 是否分页
        pagination: true
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
  mounted() {},
  methods: {
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
        let { result } = res
        this.$refs.treeSelect.treeDataUpdateFun(result)
      })
    },
    // 弹窗---保存
    handleSave() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          if (!this.showStatus) {
            let addForm = {}
            addForm = {
              name: this.addForm.name,
              username: this.addForm.username,
              remark: this.addForm.remark
            }
            if (this.addForm.roleIds && this.addForm.roleIds.length > 0) {
              addForm.roleIds = this.addForm.roleIds.join(',')
            }
            if (this.addForm.depts && this.addForm.depts.length > 0) {
              addForm.depts = this.addForm.depts.join(',')
            }
            doAddUser(addForm).then(res => {
              if (res.success === true) {
                this.$message({
                  message: '操作成功！',
                  type: 'success'
                })
                this.$refs.gwTable.getInit()
              }
            })
          } else {
            let editForm = {}
            editForm = {
              id: this.addForm.id,
              name: this.addForm.name ? this.addForm.name : null,
              username: this.addForm.username ? this.addForm.username : null,
              status: this.showStatus ? this.addForm.status : null,
              remark: this.addForm.remark ? this.addForm.remark : null
            }
            if (this.addForm.roleIds && this.addForm.roleIds.length > 0) {
              editForm.roleIds = this.addForm.roleIds.join(',')
            }
            if (this.addForm.depts && this.addForm.depts.length > 0) {
              editForm.depts = this.addForm.depts.join(',')
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
                this.$refs.gwTable.getInit()
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
              this.$refs.gwTable.getInit()
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
        let { result } = res
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
              this.$refs.gwTable.getInit()
            }
          })
        }
      }).catch(() => {})
    },
    // 表格---配置
    changeColumns(value) {
      this.tableConfig.checkedColumns = value
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
