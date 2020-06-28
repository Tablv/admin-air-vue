<template>
  <div class="container">
    <article>
      <gw-table
        ref="gwTable"
        title="角色管理"
        api="/system/role/list"
        :pagination="true"
        :columns.sync="columnsConfig"
      >
        <gw-table-header
          slot="header"
          layout="add, [refresh, columns]"
          @add="handleOpenAdd"
        />
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
              label="名称"
              prop="name"
            >
              <el-input
                v-model="addForm.name"
                placeholder="请输入名称"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="11"
            :offset="2"
          >
            <el-form-item
              label="编码"
              prop="code"
            >
              <el-input
                v-model="addForm.code"
                placeholder="请输入编码"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          v-if="showStatus"
          label="状态"
        >
          <el-radio-group v-model="addForm.status">
            <el-radio :label="0">
              <span>启用</span>
            </el-radio>
            <el-radio :label="1">
              <span>禁用</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="addForm.remark"
            type="textarea"
            :rows="4"
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
          <span>保存</span>
        </el-button>
        <el-button @click="handleClose">
          <span>关闭</span>
        </el-button>
      </div>
    </el-dialog>
    <!-- 分配用户 -->
    <assign-user
      :assign-user-visible="assignUserVisible"
      :assign-params="assignParams"
      @closeDialog="handleCloseAssignUserDialog"
    />
    <!-- 分配菜单 -->
    <assign-menu
      :drawer="drawer"
      :assign-params="assignParams"
      @closeDrawer="handleCloseDrawer"
    />
    <!-- 导入 -->
    <import-dialog
      :import-visible="importVisible"
      template-num="SYS_ROLE"
      :import-table-data="importTableData"
      @closeDialog="handleCloseImportDialog"
    />
  </div>
</template>

<script>
import { doAddRole, getRoleInfo, doEditRole, doDeleteRole } from '@/api/system/role'
import { doCheckRepeat } from '@/api/system/user'
import assignUser from './assignUserDialog'
import assignMenu from './assignMenuDrawer'
import ImportDialog from '@/components/ImportDialog'
export default {
  name: 'SYSROLE',
  components: {
    assignUser,
    assignMenu,
    ImportDialog
  },
  data() {
    var validName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('该项为必填项'))
      } else {
        let data = {
          tableName: 'AD_ROLE',
          columnName: 'NAME',
          value,
          username: value
        }
        if (this.showStatus) data.oldval = this.oldVal.name
        doCheckRepeat(data).then(res => {
          if (res.valid === false) {
            return callback(new Error('角色名称已存在，请重新输入'))
          } else {
            callback()
          }
        })
      }
    }
    var validCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('该项为必填项'))
      } else {
        let data = {
          tableName: 'AD_ROLE',
          columnName: 'CODE',
          value,
          username: value
        }
        if (this.showStatus) data.oldval = this.oldVal.code
        doCheckRepeat(data).then(res => {
          if (res.valid === false) {
            return callback(new Error('角色编码已存在，请重新输入'))
          } else {
            callback()
          }
        })
      }
    }
    return {
      // 表格列数据
      columnsConfig: [
        { prop: 'name', label: '名称', sort: true, filter: { type: 'input', prop: 'name' } },
        { prop: 'code', label: '编码', sort: true, filter: { type: 'input', prop: 'code' } },
        { prop: 'status', label: '状态', conver: true, sort: true, filter: { type: 'select', prop: 'status', option: { '0': '启用', '1': '禁用' } },
        render(h, row) {
            const isActive = row.status === 0;
            const statusClass = isActive ? "is-active" : "not-active";
            const statusText = isActive ? "启用" : "禁用";
            return <span class={`status-label ${statusClass}`}>{ statusText }</span>
          }
        },
        { prop: 'remark', label: '备注', sort: true },
        { prop: 'operation', label: '操作', width: '250',
          render(h, row) {
            return (
              <section>
                <el-button
                  type="text"
                  onClick={ () => this.handleEdit(row) }
                >
                  <span>编辑</span>
                </el-button>
                <el-button
                  type="text"
                  onClick={ () => this.handleDelete(row) }
                >
                  <span>删除</span>
                </el-button>
                <el-button
                  type="text"
                  onClick={ () => this.handleAssignUser(row) }
                >
                  <span>分配用户</span>
                </el-button>
                <el-button
                  type="text"
                  onClick={ () => this.handleAssignMenu(row) }
                >
                  <span>分配菜单</span>
                </el-button>
              </section>
            )
          }
        }
      ],
      // 新增弹窗
      addVisible: false,
      // 分配用户弹窗
      assignUserVisible: false,
      // 分配菜单抽屉
      drawer: false,
      // 分配用户、分配菜单参数
      assignParams: {},
      // 导入弹窗
      importVisible: false,
      // 弹窗表单
      addForm: {
        name: '',
        code: '',
        remark: '',
        status: 0
      },
      showStatus: false,
      // 弹窗表单必填项校验规则
      addRules: {
        name: [
          { required: true, validator: validName, trigger: 'blur' }
        ],
        code: [
          { required: true, validator: validCode, trigger: 'blur' }
        ]
      },
      oldVal: {},
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
    // 弹窗-保存
    handleSave() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          if (!this.showStatus) {
            let addForm = {}
            addForm = {
              name: this.addForm.name,
              code: this.addForm.code,
              remark: this.addForm.remark
            }
            doAddRole(addForm).then(res => {
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
              code: this.addForm.code ? this.addForm.code : null,
              status: this.showStatus ? this.addForm.status : null,
              remark: this.addForm.remark ? this.addForm.remark : null
            }
            doEditRole(editForm).then(res => {
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
    // 弹窗-关闭
    handleClose() {
      this.addVisible = false
      this.showStatus = false
      this.$refs['addForm'].resetFields()
    },
    // 表格操作-编辑
    handleEdit(row) {
      this.showStatus = true
      this.addVisible = true
      getRoleInfo({ id: row.id }).then(res => {
        let { success, result } = res
        if (success === true) {
          this.addForm = result
          this.oldVal = {
            name: result.name,
            code: result.code
          }
        }
      })
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
    // 表格操作-删除
    handleDelete(row) {
      this.$confirm('删除后将不可恢复，确认删除吗？', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        cancelButtonClass: 'messageBoxCancelButton'
      }).then(action => {
        if (action === 'confirm') {
          doDeleteRole({ id: row.id }).then(res => {
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
    // 表格操作-分配用户
    handleAssignUser(row) {
      this.assignParams = row
      this.assignUserVisible = true
    },
    // 分配用户弹窗-关闭
    handleCloseAssignUserDialog(msg) {
      this.assignUserVisible = msg
    },
    // 表格操作-分配菜单
    handleAssignMenu(row) {
      this.assignParams = row
      this.drawer = true
    },
    // 分配菜单抽屉-关闭
    handleCloseDrawer(msg) {
      this.drawer = msg
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
