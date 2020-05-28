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
            <el-button icon="el-icon-refresh" circle></el-button>
          </div>
        </div>
        <div class="pane-main">
          <el-select v-model="platform" filterable>
            <el-option
              v-for="item in platformOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-tree :data="treeData" :props="defaultProps" :highlight-current=true :expand-on-click-node=false @node-click="handleNodeClick"></el-tree>
        </div>
      </pane>
      <pane class="res-right">
        <header class="header">
          <div class="header-left">
            <div class="header-title">资源</div>
          </div>
          <div class="header-right">
            <el-button type="primary" icon="el-icon-plus" @click="handleOpenAdd('add')">新增</el-button>
            <el-button type="primary" icon="el-icon-edit-outline" @click="handleOpenAdd('edit')">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="handleDelete">删除</el-button>
            <el-button icon="el-icon-refresh"></el-button>
            <el-dropdown trigger="click" :hide-on-click="false">
              <el-button icon="el-icon-s-grid">
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-checkbox-group v-model="checkList" @change="changeCheckbox" :min="2">
                    <el-checkbox v-for="item in headerList" :key="item.prop" :label="item.prop" style="display:block;">{{ item.label }}</el-checkbox>
                    </el-checkbox-group>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </header>
        <article>
          <el-table
            :data="tableData"
            border
            size="medium"
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
            <el-table-column prop="name" label="名称" v-if="checkList.includes('name')" sortable="custom">
            </el-table-column>
            <el-table-column prop="license" label="许可" v-if="checkList.includes('license')"  sortable="custom">
            </el-table-column>
            <el-table-column prop="address" label="地址" v-if="checkList.includes('address')" sortable="custom">
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="page.pageSize"
              :current-page="page.pageNum"
              layout="sizes, total, next, pager, prev"
              :total="page.total">
            </el-pagination>
          </div>
        </article>
      </pane>
    </splitpanes>
    <el-dialog :modal-append-to-body="false" :visible.sync="addVisible" :before-close="handleCloseAdd" :destroy-on-close="true">
      <div slot="title" class="dialog-title">
        <span>{{ isEdit ? '修改' : '新增' }}</span>
      </div>
      <el-form ref="addForm" :model="addForm" :rules="addRules" label-position="right" label-width="70px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="名称" prop="name">
              <el-input v-model="addForm.name" placeholder="请输入名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="许可" prop="license">
              <el-input v-model="addForm.license" placeholder="请输入许可"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="地址" prop="address">
          <el-input v-model="addForm.address" placeholder="请输入地址"></el-input>
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
export default {
  name: 'resource',
  components: {},
  data() {
    return {
      // 平台选择框
      platform: 0,
      platformOptions: [
        { value: 0, label: '后台管理平台' },
        { value: 1, label: '测试终端平台' }
      ],
      // 树结构
      treeData: [
        {
          label: '系统管理',
          menuId: 1,
          children: [{
            label: '用户管理',
            menuId: 11
          }]
        },
        {
          label: '开发运维',
          menuId: 2,
          children: [{
            label: '代码生成',
            menuId: 21
          }]
        },
        {
          label: '数据源',
          menuId: 3
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 表格数据
      tableData: [
        { id: 1, name: '11', license: '11', address: '1' },
        { id: 2, name: '22', license: '22', address: '2' },
        { id: 3, name: '33', license: '33', address: '3' }
      ],
      // 表格配置
      headerList: [
        { prop: 'name', label: '名称' },
        { prop: 'license', label: '许可' },
        { prop: 'address', label: '地址' }
      ],
      // 表格配置选中
      checkList: ['name', 'license', 'address'],
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
        license: '',
        address: ''
      },
      // 弹窗表单必填项校验规则
      addRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        license: [
          { required: true, message: '请输入许可', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ]
      },
      // 是否编辑弹窗
      isEdit: false
    }
  },
  methods: {
    // 树结构选择
    handleNodeClick(data) {
      console.log(data)
    },
    // 新增弹窗-打开
    handleOpenAdd(type) {
      if (type === 'add') {
        this.addVisible = true
      } else {
        if (this.idRadio === '') {
          this.$message({
            message: '请选择一项数据',
            type: 'warning'
          })
        } else {
          this.isEdit = true
          this.addVisible = true
        }
      }
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
            console.log('确定删除')
          }
        }).catch(() => {})
      }
    },
    // 表格-配置
    changeCheckbox(value) {
      this.checkList = value
    },
    // 表格-远程排序
    sortChange(column) {
      console.log(column)
    },
    // 表格单选
    handleTableCurrentChange(val) {
      this.idRadio = val.id
      console.log(val.name)
    },
    // 分页-改变每页数量
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    // 分页-改变页码
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
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
