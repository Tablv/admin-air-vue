<template>
  <div class="container">
    <header class="header">
      <el-row type="flex" justify="space-between">
        <el-col :span="6">
          <div class="header-title">菜单管理</div>
        </el-col>
        <el-col :span="18">
          <div style="float: right">
            <el-select v-model="platform" filterable placeholder="请选择" @change="handleChangeTerminal">
              <el-option
                v-for="item in platformOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
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
        <el-row>
          <el-col :span="11">
            <el-form-item label="上级菜单" prop="parentName">
              <el-input v-model="addForm.parentName" disabled class="input-with-select">
                <el-button slot="append" :disabled="isEdit !== 1" icon="el-icon-search" @click="handleOpenTreeDialog"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="菜单名称" prop="name">
              <el-input v-model="addForm.name" placeholder="请输入菜单名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="菜单编码" prop="code">
              <el-input v-model="addForm.code" placeholder="请输入菜单编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="菜单图标" prop="iconClass">
              <el-input v-model="addForm.iconClass" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="handleOpenIconDialog"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="菜单地址" prop="path">
          <el-input v-model="addForm.path"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="11">
            <el-form-item label="权限" prop="permission">
              <el-input v-model="addForm.permission" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="打开方式" prop="popout">
              <el-radio-group v-model="addForm.popout">
                <el-radio label="L">标签页 </el-radio>
                <el-radio label="W">新窗口</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="菜单状态" prop="status">
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
    <!-- 菜单图标弹窗 -->
    <el-dialog title="图标选择（双击选中）" :visible.sync="iconVisible" width="60%" class="icon-dialog" :modal-append-to-body="false" :destroy-on-close="true">
      <div class="icon-container" v-for="(item, index) in iconData" :key="index">
        <div class="icon-item" @dblclick="handleSelectIcon(item)">
          <i class="el-icon-edit"></i>
          <span class="icon-name">{{item}}</span>
        </div>
      </div>
    </el-dialog>
    <!-- 上级菜单弹窗 -->
    <tree-dialog :treeVisible="treeVisible" :treeData="treeData" @closeDialog="handleCloseTreeDialog" @getCurrentNode="getCurrentMenu"></tree-dialog>
  </div>
</template>

<script>
import { getAllTerminal, getMenuList, getPreMenuList, getIconList, doAddMenu, doDeleteMenu, getMenuInfo, doEditMenu } from '@/api/system/menu'
import { doCheckRepeat } from '@/api/system/user'
import gwTable from '@/components/gwTable'
import treeDialog from '@/components/treeDialog'
export default {
  name: 'SYS_MENU',
  components: {
    gwTable,
    treeDialog
  },
  data() {
    var validName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('该项为必填项'))
      } else {
        let data = {
          tableName: 'AD_MENU',
          columnName: 'NAME',
          value: value,
          name: value
        }
        if (this.isEdit === 3) data.oldval = this.oldVal.name
        doCheckRepeat(data).then(res => {
          if (res.valid === false) {
            return callback(new Error('菜单名称已存在，请重新输入'))
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
          tableName: 'AD_MENU',
          columnName: 'CODE',
          value: value,
          code: value
        }
        if (this.isEdit === 3) data.oldval = this.oldVal.code
        doCheckRepeat(data).then(res => {
          if (res.valid === false) {
            return callback(new Error('菜单编码已存在，请重新输入'))
          } else {
            callback()
          }
        })
      }
    }
    return {
      // 平台选择框
      platform: null,
      platformOptions: [],
      // 表格数据
      tableData: [],
      // 表格列数据
      tableColumn: [
        { prop: 'name', label: '名称' },
        { prop: 'code', label: '编码' },
        { prop: 'path', label: '链接地址' },
        { prop: 'lvl', label: '层级' },
        { prop: 'sortNum', label: '排序号' },
        { prop: 'status', label: '状态' },
        { prop: 'operation', label: '操作', width: '180' }
      ],
      // 表格树数据
      tableTreeData: [],
      // 表格loading
      listLoading: false,
      // 新增弹窗
      addVisible: false,
      // 上级菜单弹窗
      treeVisible: false,
      // 上级菜单弹窗数据
      treeData: [],
      // 上级菜单数据
      preMenu: {},
      // 编辑弹窗上级菜单数据
      editPreMenu: {},
      // 菜单图标弹窗
      iconVisible: false,
      // 图标数据
      iconData: [],
      // 弹窗表单
      addForm: {
        parentName: '',
        name: '',
        code: '',
        iconClass: '',
        path: '',
        permission: '',
        popout: 'L',
        status: 0
      },
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
        this.addForm.permission = this.addForm.code.toLowerCase()
        this.addForm.code = this.addForm.code.toUpperCase()
      }
    }
  },
  created() {
    this.getInit()
  },
  methods: {
    // 初始化
    getInit() {
      this.listLoading = true
      // 获取全部终端数据
      getAllTerminal().then(res => {
        let { success, result } = res
        // if (success === true) {}
        this.platformOptions = result
        this.platform = result[0].id
        // 获取表格数据
        getMenuList({ nodeid: this.platform }).then(res => {
          this.listLoading = false
          let { success, result } = res
          if (success === true) {
            this.tableData = result
          }
        })
        getPreMenuList({ menuId: this.platform }).then(res => {
          let { success, result } = res
          if (success === true) {
            this.treeData = result
          }
        })
      })
    },
    // 表格-树数据
    loadData(tree) {
      getMenuList({ nodeid: tree.id, parentid: tree.parentId }).then(res => {
        let { success, result } = res
        if (success === true) {
          this.tableTreeData = result
        }
      })
    },
    // 改变终端
    handleChangeTerminal(val) {
      this.platform = val
      this.listLoading = true
      getMenuList({ nodeid: val }).then(res => {
        this.listLoading = false
        let { success, result } = res
        if (success === true) {
          this.tableData = result
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
              parentName: this.addForm.parentName,
              name: this.addForm.name,
              code: this.addForm.code,
              iconClass: this.addForm.iconClass,
              path: this.addForm.path,
              permission: this.addForm.permission,
              popout: this.addForm.popout,
              status: this.addForm.status
            }
            addForm.terminalId = this.platform
            addForm.parentId = this.preMenu.id ? this.preMenu.id : this.platform
            if (this.preMenu.lvl === 0) {
              addForm.lvl = this.preMenu.lvl + 1
            } else if (this.preMenu.lvl) {
              addForm.lvl = this.preMenu.lvl + 1
            } else {
              addForm.lvl = 0
            }
            doAddMenu(addForm).then(res => {
              if (res.success === true) {
                this.$message({
                  message: '新增成功！',
                  type: 'success'
                })
                this.getTableData()
              }
            })
          } else {
            let editForm = {}
            editForm = {
              id: this.addForm.id,
              lvl: this.addForm.lvl,
              terminalId: this.addForm.terminalId ? this.addForm.terminalId : '',
              parentId: this.addForm.parentId ? this.addForm.parentId : this.addForm.terminalId,
              parentName: this.addForm.parentName ? this.addForm.parentName : '',
              name: this.addForm.name,
              code: this.addForm.code,
              iconClass: this.addForm.iconClass ? this.addForm.iconClass : '',
              path: this.addForm.path ? this.addForm.path : '',
              permission: this.addForm.permission ? this.addForm.permission : '',
              popout: this.addForm.popout,
              status: this.addForm.status
            }
            doEditMenu(editForm).then(res => {
              if (res.success === true) {
                this.$message({
                  message: '操作成功！',
                  type: 'success'
                })
                this.getTableData()
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
    // 上级菜单弹窗-打开
    handleOpenTreeDialog() {
      this.treeVisible = true
      getPreMenuList({ menuId: this.platform }).then(res => {
        let { success, result } = res
        if (success === true) {
          this.treeData = result
        }
      })
    },
    // 上级菜单弹窗-关闭
    handleCloseTreeDialog(msg) {
      this.treeVisible = msg
    },
    // 获取选择的上级菜单
    getCurrentMenu(data) {
      this.preMenu = data
      this.addForm.parentName = data.name
    },
    // 菜单图标弹窗-打开
    handleOpenIconDialog() {
      this.iconVisible = true
      getIconList().then(res => {
        this.iconData = res
      })
    },
    // 双击选择图标
    handleSelectIcon(val) {
      this.addForm.iconClass = val
      this.iconVisible = false
    },
    // 表格操作-新增
    handleAdd(index, row) {
      this.isEdit = 2
      this.addVisible = true
      this.preMenu = row
      this.addForm.parentName = row.name
    },
    // 表格操作-编辑
    handleEdit(index, row) {
      this.isEdit = 3
      this.addVisible = true
      getMenuInfo({ id: row.id }).then(res => {
        let { success, result } = res
        if (success === true) {
          this.addForm = result
          this.editPreMenu = {}
          this.doSearchPreDept(this.treeData, result.parentId)
          if (this.editPreMenu) {
            this.addForm.parentId = this.editPreMenu.id
            this.addForm.parentName = this.editPreMenu.name
          }
          this.oldVal = {
            name: result.name,
            code: result.code
          }
        }
      })
    },
    doSearchPreDept(arr, id) {
      arr.map(item => {
        if (item.id === id) {
          this.editPreMenu = item
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
            doDeleteMenu({ id: row.id }).then(res => {
              if (res.success === true) {
                this.$message({
                  message: '操作成功！',
                  type: 'success'
                })
                this.getTableData()
                this.$set(this.$refs.gwTable.$children[0].store.states.lazyTreeNodeMap, row.parentId, [])
              }
            })
          }
        }).catch(() => {})
      }
    },
    // 获取表格数据
    getTableData() {
      this.listLoading = true
      getMenuList({ nodeid: this.platform }).then(res => {
        this.tableData.splice(0)
        this.listLoading = false
        let { success, result } = res
        if (success === true) {
          this.tableData = result
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-select {
  width: 120px;
}
.icon-dialog {
  /deep/ .el-dialog__body {
    height: 289px;
    padding: 10px;
    overflow-y: auto;
    .icon-container {
      width: 25%;
      padding: 10px;
      float: left;
      font-size: 14px;
      .icon-item {
        padding: 4px 12px;
        line-height: 22px;
        background-color: #f4f4f4;
        color: #444;
        border: 1px solid #ddd;
        border-radius: 3px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:hover {
          background-color: #e7e7e7;
          border: 1px solid #adadad;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
