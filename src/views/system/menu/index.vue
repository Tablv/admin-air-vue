<template>
  <div class="container">
    <article>
      <gw-table
        ref="gwTable"
        title="菜单管理"
        api="/system/menu/findMenusAsync"
        type="tree"
        :pagination="false"
        :query-params="queryParams"
        :auto-load="false"
        :tree-load="loadData"
        :tree-config="treeConfig"
        :columns.sync="columnsConfig"
      >
        <gw-table-header
          slot="header"
          layout="slot, add"
          @add="handleOpenAdd"
        >
          <el-select
            slot="custom"
            v-model="platform"
            filterable
            placeholder="请选择"
            @change="handleChangeTerminal"
          >
            <el-option
              v-for="item in platformOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </gw-table-header>
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
        <span>{{ isEdit === 3 ? '修改' : '新增' }}</span>
      </div>
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="addRules"
        label-position="right"
        label-width="80px"
        status-icon
        :inline-message="true"
      >
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="上级菜单"
              prop="parentName"
            >
              <el-input
                v-model="addForm.parentName"
                disabled
                class="input-with-select"
              >
                <el-button
                  slot="append"
                  :disabled="isEdit !== 1"
                  icon="el-icon-search"
                  @click="handleOpenTreeDialog"
                />
              </el-input>
            </el-form-item>
          </el-col>
          <el-col
            :span="11"
            :offset="2"
          >
            <el-form-item
              label="菜单名称"
              prop="name"
            >
              <el-input
                v-model="addForm.name"
                placeholder="请输入菜单名称"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="菜单编码"
              prop="code"
            >
              <el-input
                v-model="addForm.code"
                placeholder="请输入菜单编码"
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="11"
            :offset="2"
          >
            <el-form-item
              label="菜单图标"
              prop="iconClass"
            >
              <el-input
                v-model="addForm.iconClass"
                class="input-with-select"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="handleOpenIconDialog"
                />
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          label="菜单地址"
          prop="path"
        >
          <el-input v-model="addForm.path" />
        </el-form-item>
        <el-row>
          <el-col :span="11">
            <el-form-item
              label="权限"
              prop="permission"
            >
              <el-input
                v-model="addForm.permission"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col
            :span="11"
            :offset="2"
          >
            <el-form-item
              label="打开方式"
              prop="popout"
            >
              <el-radio-group v-model="addForm.popout">
                <el-radio label="L">
                  <span>标签页</span>
                </el-radio>
                <el-radio label="W">
                  <span>新窗口</span>
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          label="菜单状态"
          prop="status"
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
    <!-- 菜单图标弹窗 -->
    <el-dialog
      title="图标选择（双击选中）"
      :visible.sync="iconVisible"
      width="60%"
      class="icon-dialog"
      :modal-append-to-body="false"
      :destroy-on-close="true"
    >
      <el-col
        v-for="(icon, index) in iconData"
        :key="index"
        class="icon-container"
        :span="6"
      >
        <el-button
          class="icon-item"
          @dblclick.native="handleSelectIcon(icon)"
        >
          <font-awesome-icon :icon="icon" />
          <span class="icon-name">{{ icon }}</span>
        </el-button>
      </el-col>
    </el-dialog>
    <!-- 上级菜单弹窗 -->
    <tree-dialog
      :tree-visible="treeVisible"
      :tree-data="treeData"
      @closeDialog="handleCloseTreeDialog"
      @getCurrentNode="getCurrentMenu"
    />
  </div>
</template>

<script>
import { getAllTerminal, getMenuList, getPreMenuList, getIconList, doAddMenu, doDeleteMenu, getMenuInfo, doEditMenu } from '@/api/system/menu'
import { doCheckRepeat } from '@/api/system/user'
import TreeDialog from '@/components/TreeDialog'
export default {
  name: 'SYSMENU',
  components: {
    TreeDialog
  },
  data() {
    var validName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('该项为必填项'))
      } else {
        let data = {
          tableName: 'AD_MENU',
          columnName: 'NAME',
          value,
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
          value,
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
      // 表格初始化参数
      queryParams: {
        nodeid: ''
      },
      // 表格列数据
      columnsConfig: [
        { prop: 'name', label: '名称' },
        { prop: 'code', label: '编码' },
        { prop: 'path', label: '链接地址' },
        { prop: 'lvl', label: '层级' },
        { prop: 'sortNum', label: '排序号' },
        { prop: 'status', label: '状态', option: { '0': '启用', '1': '禁用' },
          render(h, row) {
            const isActive = row.status === 0;
            const statusClass = isActive ? "is-active" : "not-active";
            const statusText = isActive ? "启用" : "禁用";
            return <span class={`status-label ${statusClass}`}>{ statusText }</span>
          }
        },
        { prop: 'operation', label: '操作', width: '180',
          render(h, row) {
            return (
              <section>
                <el-button
                  type="text"
                  onClick={ () => this.handleAdd(row) }
                >
                  <span>新增</span>
                </el-button>
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
              </section>
            )
          }
        }
      ],
      treeConfig: {
        key: 'id',
        treeProps: {
          children: 'children',
          hasChildren: 'isParent'
        }
      },
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
      isEdit: 1,
      // 当前节点ID
      nodeId: ''
    }
  },
  watch: {
    'addForm.code': {
      handler() {
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
      // 获取全部终端数据
      getAllTerminal().then(res => {
        let { result } = res
        this.platformOptions = result
        this.platform = result[0].id
        getPreMenuList({ menuId: this.platform }).then(res => {
          let { success, result } = res
          if (success === true) {
            this.treeData = result
          }
        })
      }).then(() => {
        this.queryParams.nodeid = this.platform
        this.$refs.gwTable.getInit()
      })
    },
    // 表格-树数据
    loadData(tree, treeNode, resolve) {
      getMenuList({ nodeid: tree.id, parentid: tree.parentId }).then(res => {
        let { success, result } = res
        if (success === true) {
          resolve(result)
        }
      })
    },
    // 改变终端
    handleChangeTerminal(val) {
      this.platform = val
      this.queryParams.nodeid = val
      this.$refs.gwTable.getInit()
    },
    // 新增弹窗-打开
    handleOpenAdd() {
      this.isEdit = 1
      this.preMenu = {}
      this.editPreMenu = {}
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
                if (addForm.parentId !== this.platform) {
                  this.handleUpdateTree(addForm.parentId)
                }
                this.$refs.gwTable.getInit()
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
                if (editForm.parentId !== this.platform) {
                  this.handleUpdateTree(editForm.parentId)
                }
                this.$refs.gwTable.getInit()
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
    handleAdd(row) {
      this.isEdit = 2
      this.addVisible = true
      this.preMenu = row
      this.addForm.parentName = row.name
    },
    // 表格操作-编辑
    handleEdit(row) {
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
    // 获取弹窗上级菜单数据
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
    handleDelete(row) {
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
                if (row.parentId !== this.platform) {
                  this.handleUpdateTree(row.parentId)
                }
                this.$refs.gwTable.getInit()
              }
            })
          }
        }).catch(() => {})
      }
    },
    // 表格树更新数据
    handleUpdateTree(id) {
      getMenuList({ nodeid: id }).then(res => {
        let { success, result } = res
        if (success === true) {
          this.$set(this.$refs.gwTable.$children[1].store.states.lazyTreeNodeMap, id, result)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-select {
  width: 120px;
  margin-right: 10px;
}
.icon-dialog {
  /deep/ .el-dialog__body {
    height: 289px;
    padding: 0 10px;
    overflow-y: auto;

    .icon-container {
      padding: 6px 8px;
      font-size: 16px;

      .icon-item {
        padding: 10px 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
        text-align: left;

        .icon-name {
          margin-left: 4px;
        }
      }
    }
  }
}
</style>
