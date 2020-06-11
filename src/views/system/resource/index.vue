<template>
  <div class="container">
    <splitpanes>
      <pane size="30" min-size="30" max-size="40">
        <div class="pane-header">
          <div class="pane-headerL">
            <i class="el-icon-coin"></i>
            <span>菜单</span>
          </div>
          <div class="pane-headerR">
            <el-button icon="el-icon-refresh" circle @click="getMenuTreeData"></el-button>
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
        <header class="header">
          <el-row type="flex" justify="space-between">
            <el-col :span="6">
              <div class="header-title">资源</div>
            </el-col>
            <el-col :span="18">
              <div class="button-group">
                <el-button type="primary" icon="el-icon-plus" @click="handleOpenAdd('add')">新增</el-button>
                <el-button type="primary" icon="el-icon-edit-outline" @click="handleOpenAdd('edit')">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="handleDelete">删除</el-button>
                <el-button icon="el-icon-refresh" class="first-button" @click="initTable.menuId !== '' ? getTableList() : null"></el-button>
                <el-dropdown trigger="click" :hide-on-click="false" class="last-button">
                  <el-button icon="el-icon-s-grid">
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>
                      <el-checkbox-group v-model="checkedList" @change="changeCheckbox" :min="2">
                        <el-checkbox v-for="item in headerList" :key="item.prop" :label="item.prop" style="display:block;">{{ item.label }}</el-checkbox>
                        </el-checkbox-group>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </el-col>
          </el-row>
        </header>
        <article>
          <el-table
            :data="tableData"
            border
            size="medium"
            :max-height="tableHeight"
            v-loading="tableLoading"
            @sort-change="sortChange"
            highlight-current-row
            @current-change="handleTableCurrentChange"
            style="width: 100%"
            header-cell-class-name="header-cell">
            <el-table-column width="35">
              <template slot-scope="scope">
                <el-radio :label="scope.row.id" v-model="idRadio"></el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="名称" v-if="checkedList.includes('name')" sortable="custom">
            </el-table-column>
            <el-table-column prop="permission" label="许可" v-if="checkedList.includes('permission')"  sortable="custom">
            </el-table-column>
            <el-table-column prop="location" label="地址" v-if="checkedList.includes('location')" sortable="custom">
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-sizes="[5, 10, 20, 50, 100]"
              :page-size="page.pageSize"
              :current-page="page.pageNum"
              layout="sizes, total, ->, prev, pager, next"
              :total="page.total">
            </el-pagination>
          </div>
        </article>
      </pane>
    </splitpanes>
    <!-- 新增弹窗 -->
    <el-dialog :modal-append-to-body="false" :visible.sync="addVisible" :before-close="handleClose" :destroy-on-close="true">
      <div slot="title" class="dialog-title">
        <span>{{ isEdit ? '修改' : '新增' }}</span>
      </div>
      <el-form ref="addForm" :model="addForm" :rules="addRules" status-icon label-position="right" label-width="70px" status-icon :inline-message="true">
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
export default {
  name: 'SYSTEM_RESOURCE',
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
      initTable: {
        order: 'asc',
        offset: 0,
        limit: 10,
        menuId: ''
      },
      // 表格数据
      tableData: [],
      // 表格loading
      tableLoading: false,
      tableHeight: document.body.clientHeight - 255,
      // 表格配置
      headerList: [
        { prop: 'name', label: '名称' },
        { prop: 'permission', label: '许可' },
        { prop: 'location', label: '地址' }
      ],
      // 表格配置选中
      checkedList: ['name', 'permission', 'location'],
      // 表格单选
      idRadio: '',
      // 分页
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
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
  mounted() {
    window.onresize = () => {
      return (() => {
        this.tableHeight = document.body.clientHeight - 255
      })()
    }
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
      this.initTable.menuId = data.id
      this.getTableList()
    },
    // 获取右侧表格数据
    getTableList() {
      this.tableLoading = true
      getTableList(this.initTable).then(res => {
        this.tableLoading = false
        let { success, result } = res
        if (success === true) {}
        this.tableData = result.list
        this.page = {
          pageSize: result.pageSize,
          pageNum: result.pageNum,
          total: result.total
        }
        this.idRadio = ''
      })
    },
    // 新增弹窗-打开
    handleOpenAdd(type) {
      if (type === 'add') {
        if (!this.initTable.menuId) {
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
            this.addForm.menuId = this.initTable.menuId
            doAddRes(this.addForm).then(res => {
              if (res.success === true) {
                this.$message({
                  message: '操作成功！',
                  type: 'success'
                })
                this.getTableList()
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
                this.getTableList()
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
              this.getTableList()
            })
          }
        }).catch(() => {})
      }
    },
    // 表格-配置
    changeCheckbox(value) {
      this.checkedList = value
    },
    // 表格-远程排序
    sortChange(column) {
      if (column.order) {
        this.initTable.sort = column.prop
        this.initTable.order = column.order === 'descending' ? 'desc' : 'asc'
      } else {
        delete this.initTable.sort
        this.initTable.order = 'asc'
      }
      this.getTableList()
    },
    // 表格单选
    handleTableCurrentChange(val) {
      if (val) this.idRadio = val.id
    },
    // 分页-改变每页数量
    handleSizeChange(val) {
      this.page.pageSize = val
      this.initTable.limit = val
      this.getTableList()
    },
    // 分页-改变页码
    handleCurrentChange(val) {
      this.page.pageNum = val
      this.initTable.offset = (val - 1) * this.initTable.limit
      this.getTableList()
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
