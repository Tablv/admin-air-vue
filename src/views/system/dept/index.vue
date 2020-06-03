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
        v-loading="listLoading"
        header-cell-class-name="header-cell"
        :tree-props="{children: 'children', hasChildren: 'isParent'}">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="code" label="编码"></el-table-column>
        <el-table-column prop="type" label="类型">
          <template slot-scope="scope">
            <span>{{ scope.row.type === 0 ? '组织' : '部门' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fullPath" label="全路径"></el-table-column>
        <el-table-column prop="lvl" label="层级"></el-table-column>
        <el-table-column prop="sortNum" label="排序号"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span :style="{ color: (scope.row.status === 0 ? '#80B762' : 'red')}">{{ scope.row.status === 0 ? '启用' : '禁用' }}</span>
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
    <el-dialog :modal-append-to-body="false" :visible.sync="addVisible" :before-close="handleClose" :destroy-on-close="true">
      <div slot="title" class="dialog-title">
        <span>{{ isEdit === 3 ? '修改' : '新增' }}</span>
      </div>
      <el-form ref="addForm" :model="addForm" :rules="addRules" label-position="right" label-width="80px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="上级组织" prop="parentName">
              <el-input v-model="addForm.parentName" disabled class="input-with-select">
                <el-button slot="append" :disabled="isEdit !== 1" icon="el-icon-search" @click="handleOpenTreeDialog"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="组织类型" prop="type">
              <el-select v-model="addForm.type" filterable>
                <el-option
                  v-for="item in typeOptions"
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
            <el-form-item label="组织名称" prop="name">
              <el-input v-model="addForm.name" placeholder="请输入组织名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="组织编码" prop="code">
              <el-input v-model="addForm.code"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="组织状态" prop="status">
          <el-radio-group v-model="addForm.status">
            <el-radio :label="0">启用 </el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="4" v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 上级组织弹窗 -->
    <tree-dialog :treeVisible="treeVisible" @closeDialog="handleCloseTreeDialog" :treeData="treeData" @getCurrentNode="getCurrentDept"></tree-dialog>
  </div>
</template>

<script>
import { getDeptGroup, doAddDept, doDeleteDept, getDeptInfo, doEditDept } from '@/api/system/dept'
import { doCheckRepeat, getDeptList } from '@/api/system/user'
import treeDialog from '@/components/treeDialog'
export default {
  name: 'SYS_DEPT',
  components: {
    treeDialog
  },
  data() {
    var validName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('该项为必填项'))
      } else {
        let data = {
          tableName: 'AD_DEPT',
          columnName: 'NAME',
          value: value,
          name: value
        }
        if (this.isEdit === 3) data.oldval = this.oldVal.name
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
          tableName: 'AD_DEPT ',
          columnName: 'CODE',
          value: value,
          code: value
        }
        if (this.isEdit === 3) data.oldval = this.oldVal.code
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
      // 表格数据
      tableData: [],
      // 表格loading
      listLoading: false,
      // 新增弹窗
      addVisible: false,
      // 上级组织弹窗
      treeVisible: false,
      treeData: [],
      // 上级组织数据
      preDept: {},
      // 弹窗表单
      addForm: {
        parentName: '',
        type: 0,
        name: '',
        code: '',
        status: 0,
        remark: ''
      },
      typeOptions: [
        { value: 0, label: '组织' },
        { value: 1, label: '部门' }
      ],
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
      // 是否编辑弹窗
      isEdit: 1
    }
  },
  watch: {
    'addForm.code': {
      handler: function() {
        this.addForm.code = this.addForm.code.toUpperCase()
      }
    }
  },
  created() {
    this.getInit()
    getDeptList({ deptId: 0 }).then(res => {
      let { success, result } = res
      // if (success === true) {}
      this.treeData = result
    })
  },
  methods: {
    // 初始化
    getInit() {
      this.listLoading = true
      this.tableData = []
      getDeptGroup({ nodeid: 0 }).then(res => {
        this.listLoading = false
        let { success, result } = res
        if (success === true) {}
        this.tableData = result
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
          let addForm = {}
          addForm = JSON.parse(JSON.stringify(this.addForm))
          addForm.terminalId = ''
          if (this.isEdit === 1 || this.isEdit === 2) {
            addForm.fullPath = this.preDept.fullPath ? `${this.preDept.fullPath}/${addForm.code}` : `/${addForm.code}`
            addForm.parentId = this.preDept.id ? this.preDept.id : ''
            if (this.preDept.lvl === 0) {
              addForm.lvl = this.preDept.lvl + 1
            } else if (this.preDept.lvl) {
              addForm.lvl = this.preDept.lvl + 1
            } else {
              addForm.lvl = 0
            }
            if (this.isEdit === 2) {
              if (this.preDept.type === 1 && addForm.type === 0) {
                this.$message({
                  message: '不符合组织结构关系!',
                  type: 'warning'
                })
                return false
              }
            }
            doAddDept(addForm).then(res => {
              if (res.success === true) {
                this.$message({
                  message: '新增成功！',
                  type: 'success'
                })
                this.getInit()
              }
            })
          } else {
            let editForm = {}
            editForm = {
              id: addForm.id,
              lvl: addForm.lvl ? addForm.lvl : null,
              terminalId: addForm.terminalId ? addForm.terminalId : null,
              parentId: addForm.parentId ? addForm.parentId : null,
              parentName: addForm.parentName ? addForm.parentName : null,
              name: addForm.name,
              code: addForm.code,
              status: addForm.status,
              type: addForm.type,
              remark: addForm.remark ? addForm.remark :null
            }
            doEditDept(editForm).then(res => {
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
    // 上级组织弹窗-打开
    handleOpenTreeDialog() {
      this.treeVisible = true
      getDeptList({ deptId: 0 }).then(res => {
        let { success, result } = res
        // if (success === true) {}
        this.treeData = result
      })
    },
    // 上级组织弹窗-关闭
    handleCloseTreeDialog(msg) {
      this.treeVisible = msg
    },
    // 获取选择的上级组织
    getCurrentDept(data) {
      this.preDept = data
      this.addForm.parentName = data.name
    },
    // 表格-树数据
    loadData(row, treeNode, resolve) {
      getDeptGroup({ nodeid: row.id, parentid: row.parentId }).then(res => {
        let { success, result } = res
        if (success === true) {}
        resolve(result)
      })
    },
    // 表格操作-新增
    handleAdd(index, row) {
      this.isEdit = 2
      this.addVisible = true
      this.preDept = row
      this.addForm.parentName = row.name
    },
    // 表格操作-编辑
    handleEdit(index, row) {
      this.isEdit = 3
      this.addVisible = true
      getDeptInfo({ id: row.id }).then(res => {
        let { success, result } = res
        if (success === true) {
          this.addForm = result
          let preDept = this.doSearchPreDept(this.treeData, result.parentId)
          if (preDept) {
            this.addForm.parentId = preDept.id
            this.addForm.parentName = preDept.name
          }
          this.oldVal = {
            name: result.name,
            code: result.code
          }
        }
      })
    },
    doSearchPreDept(arr, id) {
      for (let index = 0; index < arr.length; index++) {
        let item = arr[index]
        if (item.id === id) {
          return item
        } else if (item.children && item.children.length > 0) {
          this.doSearchPreDept(item.children, id)
        }
      }
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
            doDeleteDept({ id: row.id }).then(res => {
              if (res.success === true) {
                this.$message({
                  message: '删除成功！',
                  type: 'success'
                })
                this.getInit()
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
