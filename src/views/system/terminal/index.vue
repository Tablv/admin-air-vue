<template>
  <div class="container">
    <article>
      <gw-table
        ref="gwTable"
        :table-config="tableConfig"
        @changeColumns="changeColumns"
        @add="handleOpenAdd"
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
        label-width="auto"
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
          v-if="showStatus"
          label="AppKey"
          prop="appKey"
        >
          <el-input
            v-model="addForm.appKey"
            disabled
          />
        </el-form-item>
        <el-form-item
          v-if="showStatus"
          label="AppSecret"
          prop="appSecret"
        >
          <el-input
            v-model="addForm.appSecret"
            disabled
          />
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark"
        >
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
          保存
        </el-button>
        <el-button @click="handleClose">
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { doAddTerminal, doEditTerminal, getTerminalInfo, doDeleteTerminal } from '@/api/system/terminal'
import { doCheckRepeat } from '@/api/system/user'
import GwTable from '@/components/GwTable'
export default {
  name: 'SYSTERMINAL',
  components: {
    GwTable
  },
  data() {
    var validName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('该项为必填项'))
      } else {
        let data = {
          tableName: 'AD_TERMINAL',
          columnName: 'NAME',
          value,
          name: value
        }
        if (this.showStatus) data.oldval = this.oldVal.name
        doCheckRepeat(data).then(res => {
          if (res.valid === false) {
            return callback(new Error('名称已存在，请重新输入'))
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
          tableName: 'AD_TERMINAL',
          columnName: 'CODE',
          value,
          code: value
        }
        if (this.showStatus) data.oldval = this.oldVal.code
        doCheckRepeat(data).then(res => {
          if (res.valid === false) {
            return callback(new Error('编码已存在，请重新输入'))
          } else {
            callback()
          }
        })
      }
    }
    return {
     // 表格
      tableConfig: {
        api: '/system/terminal/list',
        // 表格列数据
        columns: [
          { prop: 'name', label: '名称', sort: 'custom', filter: { type: 'input', data: 'name' } },
          { prop: 'code', label: '编码', sort: 'custom', filter: { type: 'input', data: 'code' } },
          { prop: 'status', label: '状态', conver: true, sort: 'custom', filter: { type: 'select', data: 'status', option: { '0': '启用', '1': '禁用' } } },
          { prop: 'remark', label: '备注', sort: 'custom' },
          { prop: 'operation', label: '操作', width: '180' }
        ],
        // 表格配置选中
        checkedColumns: ['name', 'code', 'status', 'remark', 'operation'],
        title: '终端管理',
        // 按钮配置
        buttons: ['add', 'refresh', 'columns'],
        // 是否分页
        pagination: true
      },
      // 新增弹窗
      addVisible: false,
      // 弹窗表单
      addForm: {
        name: '',
        code: '',
        status: 0,
        appKey: '',
        appSecret: '',
        remark: ''
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
      oldVal: {}
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
            doAddTerminal(addForm).then(res => {
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
              name: this.addForm.name,
              coed: this.addForm.code,
              status: this.addForm.status,
              remark: this.addForm.remark,
              appKey: this.addForm.appKey,
              appSecret: this.addForm.appSecret
            }
            doEditTerminal(editForm).then(res => {
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
    handleEdit(index, row) {
      this.showStatus = true
      this.addVisible = true
      getTerminalInfo({ id: row.id }).then(res => {
        let { result } = res
        this.addForm = result
        this.oldVal = {
          name: result.name,
          code: result.code
        }
      })
    },
    // 表格操作-删除
    handleDelete(index, row) {
      this.$confirm('删除后将不可恢复，确认删除吗？', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        cancelButtonClass: 'messageBoxCancelButton'
      }).then(action => {
        if (action === 'confirm') {
          doDeleteTerminal({ id: row.id }).then(res => {
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
