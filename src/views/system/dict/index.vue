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
      <el-form ref="addForm" :model="addForm" :rules="addRules" label-position="right" label-width="80px">
        <el-form-item label="上级名称">
          <el-input v-model="addForm.preName" disabled class="input-with-select">
            <el-button slot="append" :disabled="isEdit !== 1" icon="el-icon-search" @click="handleOpenTreeDialog"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="addForm.type">
            <el-radio :label="1">数据分组 </el-radio>
            <el-radio :label="0">数据项</el-radio>
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
            <el-radio :label="1">启用 </el-radio>
            <el-radio :label="0">禁用</el-radio>
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
import { getDataList, doDeleteData } from '@/api/system/dict'
import gwTable from '@/components/gwTable'
import treeDialog from '@/components/treeDialog'
export default {
  name: 'DICT',
  components: {
    gwTable,
    treeDialog
  },
  data() {
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
      // 弹窗表单
      addForm: {
        preName: '',
        type: 1,
        code: '',
        name: '',
        value: '',
        status: 1
      },
      // 弹窗表单必填项校验规则
      addRules: {
        type: [
          { required: true, message: '该项为必填项', trigger: 'change' }
        ],
        code: [
          { required: true, message: '该项为必填项', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '该项为必填项', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '该项为必填项', trigger: 'change' }
        ]
      },
      // 是否编辑弹窗
      isEdit: 1
    }
  },
  created() {
    this.getInit()
  },
  methods: {
    // 初始化
    getInit() {
      this.listLoading = true
      this.tableData.splice(0)
      // 获取全部终端数据
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
    },
    // 表格-树数据
    loadData(tree) {
      getDataList({ nodeid: tree.id, parentid: tree.parentId }).then(res => {
        let { success, result } = res
        if (success === true) {
          this.tableTreeData = result
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
      this.addVisible = false
      this.isEdit = 1
    },
    // 弹窗-关闭
    handleClose() {
      this.addVisible = false
      this.isEdit = 1
    },
    // 上级名称弹窗-打开
    handleOpenTreeDialog() {
      this.treeVisible = true
    },
    // 上级名称弹窗-关闭
    handleCloseTreeDialog(msg) {
      this.treeVisible = msg
    },
    // 获取选择的上级名称
    getCurrentMenu(data) {
      this.addForm.preName = data.label
    },
    // 表格操作-新增
    handleAdd(index, row) {
      this.isEdit = 2
      this.addVisible = true
    },
    // 表格操作-编辑
    handleEdit(index, row) {
      this.isEdit = 3
      this.addVisible = true
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
