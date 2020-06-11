<template>
<div class="container">
    <header class="header">
      <el-row type="flex" justify="space-between">
        <el-col :span="6">
          <div class="header-title">数据维护</div>
        </el-col>
        <el-col :span="18">
          <div style="float: right">
            <el-button type="primary" icon="el-icon-plus" @click="handleOpenAdd">新增</el-button>
          </div>
        </el-col>
      </el-row>
    </header>
    <article>
      <gw-table
        ref="gwTable"
        :tableData="tableData"
        :tableColumn="tableColumn"
        :listLoading="listLoading"
        :hasTree="true"
        :tableTreeData="tableTreeData"
        @loadData="loadData"
      >
        <template slot-scope="operation">
          <el-button type="text" @click="handleAdd(operation.index, operation.row)">新增</el-button>
          <el-button type="text" @click="handleEdit(operation.index, operation.row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(operation.index, operation.row)">删除</el-button>
        </template>
      </gw-table>
    </article>
    <!-- 新增弹窗 -->
    <el-dialog :modal-append-to-body="false" :visible.sync="addVisible" :before-close="handleClose" :destroy-on-close="true">
      <div slot="title" class="dialog-title">
        <span>{{ isEdit === 3 ? '修改' : '新增' }}</span>
      </div>
      <el-form ref="addForm" :model="addForm" :rules="addRules" label-position="right" label-width="80px" status-icon :inline-message="true">
        <el-form-item label="上级名称" prop="parentName">
          <el-input v-model="addForm.parentName" disabled class="input-with-select">
            <el-button slot="append" :disabled="isEdit !== 1" icon="el-icon-search" @click="handleOpenTreeDialog"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="addForm.type">
            <el-radio :label="0">数据分组 </el-radio>
            <el-radio :label="1">数据项</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="addForm.code" placeholder="请输入编码"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="值" prop="value">
          <el-input v-model="addForm.value" placeholder="请输入编码"></el-input>
        </el-form-item>
        <el-form-item label="数据状态" prop="status">
          <el-radio-group v-model="addForm.status">
            <el-radio :label="0">启用 </el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 上级名称弹窗 -->
    <tree-dialog :treeVisible="treeVisible"
    :treeData="treeData"
    @closeDialog="handleCloseTreeDialog" @getCurrentNode="getCurrentMenu"></tree-dialog>
  </div>
</template>

<script>
import { getDataList, doDeleteData, getPreDataList, doAddData, getDataInfo, doUpdateData } from '@/api/system/dict'
import { doCheckRepeat } from '@/api/system/user'
import gwTable from '@/components/gwTable'
import treeDialog from '@/components/treeDialog'
export default {
  name: 'DICT',
  components: {
    gwTable,
    treeDialog
  },
  data() {
    var validCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('该项为必填项'))
      } else {
        this.preData.code ? value = `${this.preData.code}-${value}` : value = `${this.editPreData.code}-${value}`
        let data = {
          tableName: 'AD_DICT',
          columnName: 'CODE',
          value: value
        }
        if (this.isEdit === 3) data.oldval = this.oldVal.code
        doCheckRepeat(data).then(res => {
          if (res.valid === false) {
            return callback(new Error('编码重复'))
          } else {
            callback()
          }
        })
      }
    }
    return {
      // 表格数据
      tableData: [],
      // 表格列数据
      tableColumn: [
        { prop: 'name', label: '名称' },
        { prop: 'code', label: '编码' },
        { prop: 'dataType', label: '类型' },
        { prop: 'lvl', label: '层级' },
        { prop: 'sortnum', label: '排序号' },
        { prop: 'status', label: '状态' },
        { prop: 'operation', label: '操作', width: '180' }
      ],
      // 表格树数据
      tableTreeData: [],
      // 表格loading
      listLoading: false,
      // 新增弹窗
      addVisible: false,
      // 上级名称弹窗
      treeVisible: false,
      // 上级名称弹窗数据
      treeData: [],
      // 上级名称数据
      preData: {},
      // 编辑弹窗上级名称数据
      editPreData: {},
      // 弹窗表单
      addForm: {
        parentName: '',
        type: 0,
        code: '',
        name: '',
        value: '',
        status: 0
      },
      // 弹窗表单必填项校验规则
      addRules: {
        type: [
          { required: true, message: '该项为必填项', trigger: 'change' }
        ],
        code: [
          { required: true, validator: validCode, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '该项为必填项', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '该项为必填项', trigger: 'change' }
        ]
      },
      oldVal: {},
      // 是否编辑弹窗
      isEdit: 1
    }
  },
  created() {
    this.getInit()
  },
  watch: {
    'addForm.code': {
      handler: function() {
        this.addForm.code = this.addForm.code.toUpperCase()
        this.addForm.tencode = this.addForm.code
      }
    }
  },
  methods: {
    // 初始化
    getInit() {
      this.listLoading = true
      this.tableData.splice(0)
      // 获取全部数据
      getDataList({ nodeid: 0 }).then(res => {
        this.listLoading = false
        let { success, result } = res
        if (success === true) {
          this.tableData = result.map(item => {
            item.dataType = item.type
            return item
          })
        }
      })
      getPreDataList({ dictId: 0, type: 0 }).then(res => {
        let { success, result } = res
        if (success === true) {
          this.treeData = result
        }
      })
    },
    // 表格-树数据
    loadData(tree) {
      getDataList({ nodeid: tree.id, parentid: tree.parentId }).then(res => {
        let { success, result } = res
        if (success === true) {
          this.tableTreeData = result.map(item => {
            item.dataType = item.type
            return item
          })
        }
      })
    },
    // 新增弹窗-打开
    handleOpenAdd() {
      this.isEdit = 1
      this.addVisible = true
    },
    // 弹窗-保存
    handleSave() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          if (this.isEdit === 1 || this.isEdit === 2) {
            let addForm = {}
            addForm = {
              type: this.addForm.type,
              tencode: this.addForm.tencode,
              name: this.addForm.name,
              value: this.addForm.value,
              status: this.addForm.status
            }
            addForm.parentId = this.preData.id ? this.preData.id : ''
            addForm.parentName = this.preData.name ? this.preData.name : ''
            if (this.preData.code) {
              addForm.parentCode = this.preData.code
            } else {
              addForm.parentCode = ''
            }
            if (this.preData.lvl === 0) {
              addForm.lvl = this.preData.lvl + 1
            } else if (this.preData.lvl) {
              addForm.lvl = this.preData.lvl + 1
            } else {
              addForm.lvl = 0
            }
            addForm.code = addForm.parentCode ? `${addForm.parentCode}-${this.addForm.code}` : this.addForm.code
            doAddData(addForm).then(res => {
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
              id: this.addForm.id,
              lvl: this.addForm.lvl,
              parentId: this.addForm.parentId ? this.addForm.parentId : 0,
              parentName: this.addForm.parentName ? this.addForm.parentName : '',
              parentCode: this.addForm.parentCode ? this.addForm.parentCode : '',
              type: this.addForm.type,
              code: this.addForm.parentCode ? `${this.addForm.parentCode}-${this.addForm.code}` : this.addForm.code,
              tencode: this.addForm.tencode,
              name: this.addForm.name,
              value: this.addForm.value,
              status: this.addForm.status
            }
            doUpdateData(editForm).then(res => {
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
          this.isEdit = 1
          this.$refs['addForm'].resetFields()
        }
      })
    },
    // 弹窗-关闭
    handleClose() {
      this.addVisible = false
      this.isEdit = 1
      this.$refs['addForm'].resetFields()
    },
    // 上级名称弹窗-打开
    handleOpenTreeDialog() {
      this.treeVisible = true
      getPreDataList({ dictId: 0, type: 0 }).then(res => {
        let { success, result } = res
        if (success === true) {
          this.treeData = result
        }
      })
    },
    // 上级名称弹窗-关闭
    handleCloseTreeDialog(msg) {
      this.treeVisible = msg
    },
    // 获取选择的上级名称
    getCurrentMenu(data) {
      this.preData = data
      this.addForm.parentName = data.name
    },
    // 表格操作-新增
    handleAdd(index, row) {
      if (row.type === 1) {
        this.$message({
          message: '数据项不可新增！',
          type: 'warning'
        })
        return false
      }
      this.isEdit = 2
      this.addVisible = true
      this.preData = row
      this.addForm.parentName = row.name
    },
    // 表格操作-编辑
    handleEdit(index, row) {
      this.isEdit = 3
      this.addVisible = true
      getDataInfo({ id: row.id }).then(res => {
        let { success, result } = res
        if (success === true) {
          this.addForm = result
          this.editPreData = {}
          this.doSearchPreDept(this.treeData, result.parentId)
          if (this.editPreData) {
            this.addForm.parentId = this.editPreData.id
            this.addForm.parentName = this.editPreData.name
            this.addForm.parentCode = this.editPreData.code
          }
          this.oldVal = {
            code: result.code
          }
        }
      })
    },
    doSearchPreDept(arr, id) {
      arr.map(item => {
        if (item.id === id) {
          this.editPreData = item
        }
        if (item.children && item.children.length > 0) {
          this.doSearchPreDept(item.children, id)
        }
      })
    },
    // 表格操作-删除
    handleDelete(index, row) {
      if (row.isParent) {
        this.$message({
          message: '存在子节点，请先删除子节点！',
          type: 'warning'
        })
      } else {
        this.$confirm('确认删除吗？', '信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
          closeOnPressEscape: false,
          cancelButtonClass: 'messageBoxCancelButton'
        }).then(action => {
          if (action === 'confirm') {
            doDeleteData({ id: row.id }).then(res => {
              if (res.success === true) {
                this.$message({
                  message: '操作成功！',
                  type: 'success'
                })
                this.getInit()
                this.$set(this.$refs.gwTable.$children[0].store.states.lazyTreeNodeMap, row.parentId, [])
              }
            })
          }
        }).catch(() => {})
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
