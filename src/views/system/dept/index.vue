<template>
  <div class="container">
    <header class="header">
      <div class="header-left">
        <div class="header-title">组织管理</div>
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
        <el-table-column prop="path" label="全路径"></el-table-column>
        <el-table-column prop="lvl" label="层级"></el-table-column>
        <el-table-column prop="sortNum" label="排序号"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span :style="{ color: (scope.row.status === 1 ? '#80B762' : 'red')}">{{ scope.row.status === 1 ? '启用' : '禁用' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
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
        <el-row>
          <el-col :span="11">
            <el-form-item label="上级组织">
              <el-input v-model="addForm.preOga" disabled class="input-with-select">
                <el-button slot="append" :disabled="isEdit" icon="el-icon-search" @click="handleOpenTreeDialog"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="组织类型">
              <el-select v-model="addForm.orgType" filterable>
                <el-option
                  v-for="item in orgTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="组织名称" prop="orgName">
              <el-input v-model="addForm.orgName" placeholder="请输入组织名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="组织编码" prop="orgCode">
              <el-input v-model="addForm.orgCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="组织状态">
          <el-radio-group v-model="addForm.orgStatus">
            <el-radio :label="1">启用 </el-radio>
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
    <!-- 上级组织弹窗 -->
    <tree-dialog :treeVisible="treeVisible" @closeDialog="handleCloseTreeDialog" @getCurrentNode="getCurrentMenu"></tree-dialog>
  </div>
</template>

<script>
import treeDialog from '@/components/treeDialog'
export default {
  name: 'SYS_DEPT',
  components: {
    treeDialog
  },
  data() {
    return {
      // 表格数据
      tableData: [
        { id: 1, name: 'XXXX公司', code: 'company', type: '组织', path: '/XXXX公司', lvl: 0, sortNum: 0, status: 1, remark: '', hasChildren: true }
      ],
      // 新增弹窗
      addVisible: false,
      // 上级菜单弹窗
      treeVisible: false,
      // 弹窗表单
      addForm: {
        preOga: '',
        orgType: 0,
        orgName: '',
        orgCode: '',
        orgStatus: 1,
        remark: ''
      },
      orgTypeOptions: [
        { value: 0, label: '组织' },
        { value: 1, label: '部门' }
      ],
      // 弹窗表单必填项校验规则
      addRules: {
        orgName: [
          { required: true, message: '请输入组织名称', trigger: 'blur' }
        ],
        orgCode: [
          { required: true, message: '请输入组织编码', trigger: 'blur' }
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
    // 上级组织弹窗-关闭
    handleCloseTreeDialog(msg) {
      this.treeVisible = msg
    },
    // 获取选择的上级组织
    getCurrentMenu(data) {
      this.addForm.preOga = data.label
    },
    // 表格-树数据
    loadData(row, treeNode, resolve) {
      let allData = [
        { id: 11, parentId: 1, name: '人力资源部', code: 'HR', type: '部门', path: '	/XXXX公司/人力资源部', lvl: 0, sortNum: 0, status: 1, remark: '' }
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
