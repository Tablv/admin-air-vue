<template>
  <div class="container">
    <splitpanes>
      <pane size="30" min-size="30" max-size="40">
        <div class="pane-header">
          <div class="pane-headerL">
            <font-awesome-icon icon="cubes" />
            <span>菜单</span>
          </div>
          <div class="pane-headerR">
            <el-button circle @click="getMenuTreeData">
              <font-awesome-icon icon="sync-alt" />
            </el-button>
          </div>
        </div>
        <div class="pane-main">
          <el-select v-model="platform" filterable>
            <el-option
              v-for="item in platformOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-tree
            v-loading="treeLoading"
            :data="treeData"
            :props="defaultProps"
            :highlight-current=true
            :expand-on-click-node=false
            @node-click="handleNodeClick"></el-tree>
        </div>
      </pane>
      <pane class="res-right">
        <article>
          <gw-table
            ref="gwTable"
            :queryParams="queryParams"
            :tableConfig="tableConfig"
            @changeColumns="changeColumns"
            @handleTableCurrentChange="handleTableCurrentChange"
            @add="handleOpenAdd('add')"
            @update="handleOpenAdd('edit')"
            @delete="handleDelete"
          >
          </gw-table>
        </article>
      </pane>
    </splitpanes>
    <!-- 新增弹窗 -->
    <el-dialog :modal-append-to-body="false" :visible.sync="addVisible" :before-close="handleClose" :destroy-on-close="true">
      <div slot="title" class="dialog-title">
        <span>{{ isEdit ? '修改' : '新增' }}</span>
      </div>
      <el-form ref="addForm" :model="addForm" :rules="addRules" label-position="right" label-width="70px" status-icon :inline-message="true">
        <el-row>
          <el-col :span="11">
            <el-form-item label="名称" prop="name">
              <el-input v-model="addForm.name" placeholder="请输入名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="许可" prop="permission">
              <el-input v-model="addForm.permission" placeholder="请输入许可"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="地址" prop="location">
          <el-input v-model="addForm.location" placeholder="请输入地址"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTerminalList, getMenuList, getTableList, doAddRes, getResInfo, doUpdateRes, doDeleteRes } from '@/api/system/resource'
import gwTable from '@/components/gwTable'
export default {
  name: 'SYSTEM_RESOURCE',
  components: {
    gwTable
  },
  data() {
    return {
      // 平台选择框
      platform: null,
      platformOptions: [],
      // 树结构
      treeData: [],
      // 树loading
      treeLoading: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 表格初始化参数
      queryParams: {
        menuId: ''
      },
      // 表格
      tableConfig: {
        api: '/system/resource/findOfPage',
        // 表格列数据
        columns: [
          { prop: 'name', label: '名称', sort: 'custom' },
          { prop: 'permission', label: '许可', sort: 'custom' },
          { prop: 'location', label: '地址', sort: 'custom' }
        ],
        // 表格配置选中
        checkedColumns: ['name', 'permission', 'location'],
        title: '资源',
        // 按钮配置
        buttons: ['add', 'update', 'delete', 'refresh', 'columns'],
        // 是否单选
        hasRadio: true,
        // 是否分页
        pagination: true
      },
      // 表格单选
      idRadio: '',
      // 新增弹窗
      addVisible: false,
      // 弹窗表单
      addForm: {
        name: '',
        permission: '',
        location: ''
      },
      // 弹窗表单必填项校验规则
      addRules: {
        name: [
          { required: true, message: '该项为必填项', trigger: 'blur' }
        ],
        permission: [
          { required: true, message: '该项为必填项', trigger: 'blur' }
        ],
        location: [
          { required: true, message: '该项为必填项', trigger: 'blur' }
        ]
      },
      // 是否编辑弹窗
      isEdit: false
    }
  },
  created() {
    this.getInit()
  },
  methods: {
    // 初始化
    getInit() {
      getTerminalList().then(res => {
        let { success, result } = res
        this.platformOptions = result
        this.platform = result[0].id
        this.getMenuTreeData()
      })
    },
    // 获取菜单树数据
    getMenuTreeData() {
      this.treeLoading = true
      getMenuList({ menuId: this.platform }).then(res => {
        this.treeLoading = false
        let { success, result } = res
        if (success === true) {
          this.treeData = result
        }
      })
    },
    // 树结构选择
    handleNodeClick(data) {
      this.queryParams.menuId = data.id
      this.$refs.gwTable.getInit()
      this.idRadio = ''
    },
    // 新增弹窗-打开
    handleOpenAdd(type) {
      if (type === 'add') {
        if (!this.queryParams.menuId) {
          this.$message({
            message: '请选择一个菜单',
            type: 'warning'
          })
          return false
        }
        this.addVisible = true
      } else {
        if (this.idRadio === '') {
          this.$message({
            message: '请选择一项数据',
            type: 'warning'
          })
        } else {
          getResInfo({ id: this.idRadio }).then(res => {
            let { success, result } = res
            if (success === true) {}
            this.addForm = {
              name: result.name,
              permission: result.permission,
              location: result.location
            }
          })
          this.isEdit = true
          this.addVisible = true
        }
      }
    },
    // 弹窗-保存
    handleSave() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          if (!this.isEdit) {
            this.addForm.menuId = this.queryParams.menuId
            doAddRes(this.addForm).then(res => {
              if (res.success === true) {
                this.$message({
                  message: '操作成功！',
                  type: 'success'
                })
                this.$refs.gwTable.getInit()
                this.idRadio = ''
              }
            })
          } else {
            this.addForm.id = this.idRadio
            doUpdateRes(this.addForm).then(res => {
              if (res.success === true) {
                this.$message({
                  message: '操作成功！',
                  type: 'success'
                })
                this.$refs.gwTable.getInit()
                this.idRadio = ''
              }
            })
          }
        }
      })
      this.addVisible = false
      this.isEdit = false
      this.$refs['addForm'].resetFields()
    },
    // 弹窗-关闭
    handleClose() {
      this.addVisible = false
      this.isEdit = false
      this.$refs['addForm'].resetFields()
    },
    // 删除
    handleDelete() {
      if (this.idRadio === '') {
        this.$message({
          message: '请选择一项数据',
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
            doDeleteRes({ id: this.idRadio }).then(res => {
              if (res.success === true) {}
              this.$message({
                message: '操作成功！',
                type: 'success'
              })
              this.$refs.gwTable.getInit()
              this.idRadio = ''
            })
          }
        }).catch(() => {})
      }
    },
    // 表格-配置
    changeColumns(value) {
      this.tableConfig.checkedColumns = value
    },
    // 表格单选
    handleTableCurrentChange(val) {
      if (Object.keys(val).length > 0) this.idRadio = val.id
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  padding: 0;
  min-height: 473px;
  // border: 1px solid #d3d3d3;
  // 拆分窗格
  .splitpanes__pane {
    min-height: 473px;
    .pane-main {
      padding: 10px;
      .el-select {
        margin-bottom: 5px;
      }
    }
  }
  .splitpanes__splitter {
    min-height: 473px;
  }
  .res-right {
    padding: 10px;
  }
}
</style>
