<template>
<div class="container">
    <header class="header">
      <div class="header-left">
        <div class="header-title">数据维护</div>
      </div>
      <div class="header-right">
        <el-button type="primary" icon="el-icon-plus" @click="handleOpenAdd">新增</el-button>
      </div>
    </header>
    <article>
      <el-table
        :data="tableData"
        row-key="id"
        size="medium"
        border
        lazy
        :load="loadData"
        header-cell-class-name="header-cell"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="code" label="编码"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="lvl" label="层级"></el-table-column>
        <el-table-column prop="sortNum" label="排序号"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span :style="{ color: (scope.row.status === 1 ? '#80B762' : 'red')}">{{ scope.row.status === 1 ? '启用' : '禁用' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-plus" circle @click="handleAdd(scope.$index, scope.row)" />
            <el-button type="primary" icon="el-icon-edit-outline" circle @click="handleEdit(scope.$index, scope.row)" />
            <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.$index, scope.row)" />
          </template>
        </el-table-column>
      </el-table>
    </article>
    <!-- 新增弹窗 -->
    <el-dialog :modal-append-to-body="false" :visible.sync="addVisible" :before-close="handleCloseAdd" :destroy-on-close="true">
      <div slot="title" class="dialog-title">
        <span>{{ isEdit ? '修改' : '新增' }}</span>
      </div>
      <el-form ref="addForm" :model="addForm" :rules="addRules" label-position="right" label-width="80px">
        <el-form-item label="上级名称">
          <el-input v-model="addForm.preName" disabled class="input-with-select">
            <el-button slot="append" :disabled="isEdit" icon="el-icon-search" @click="handleOpenTreeDialog"></el-button>
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
    <tree-dialog :treeVisible="treeVisible" @closeDialog="handleCloseTreeDialog" @getCurrentNode="getCurrentMenu"></tree-dialog>
  </div>
</template>

<script>
import treeDialog from '@/components/treeDialog'
export default {
  name: 'DICT',
  components: {
    treeDialog
  },
  data() {
    return {
      // 表格数据
      tableData: [
        { id: 1, name: 'A', code: 'A', type: '数据分组', lvl: 0, sortNum: 2, status: 1, hasChildren: true },
        { id: 2, name: 'B', code: 'B', type: '数据分组', lvl: 0, sortNum: 4, status: 1, hasChildren: true },
        { id: 3, name: 'C', code: 'C', type: '数据分组', lvl: 0, sortNum: 5, status: 1 }
      ],
      // 新增弹窗
      addVisible: false,
      // 上级菜单弹窗
      treeVisible: false,
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
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入编码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择数据状态', trigger: 'change' }
        ]
      },
      // 是否编辑弹窗
      isEdit: false
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
      this.isEdit = false
    },
    // 弹窗-保存
    handleSave() {
      this.addVisible = false
      this.isEdit = false
    },
    // 弹窗-关闭
    handleClose() {
      this.addVisible = false
      this.isEdit = false
    },
    // 上级菜单弹窗-打开
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
    // 表格-树数据
    loadData(row, treeNode, resolve) {
      let allData = [
        { id: 11, parentId: 1, name: 'D', code: 'D', type: '数据分组', lvl: 0, sortNum: 5, status: 1, hasChildren: true },
        { id: 111, parentId: 11, name: 'E', code: 'E', type: '数据分组', lvl: 0, sortNum: 5, status: 1, hasChildren: true },
        { id: 1111, parentId: 111, name: 'F', code: 'F', type: '数据分组', lvl: 0, sortNum: 5, status: 1 },
        { id: 21, parentId: 2, name: 'G', code: 'G', type: '数据分组', lvl: 0, sortNum: 5, status: 1 }
      ]
      let data = allData.filter(item => item.parentId === row.id)
      setTimeout(() => {
        resolve(data)
      }, 1000)
    },
    // 表格操作-新增
    handleAdd(index, row) {
      this.addVisible = true
    },
    // 表格操作-编辑
    handleEdit(index, row) {
      this.isEdit = true
      this.addVisible = true
    },
    // 表格操作-删除
    handleDelete(index, row) {
      console.log(index, row)
      this.$message({
        message: '存在子节点，请先删除子节点！',
        type: 'warning'
      })
      this.$confirm('确认删除吗？', '信息', {
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
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
