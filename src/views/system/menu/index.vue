<template>
  <div class="container">
    <header class="header">
      <div class="header-left">
        <div class="header-title">菜单管理</div>
      </div>
      <div class="header-right">
        <el-select v-model="platform" filterable placeholder="请选择">
          <el-option
            v-for="item in platformOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
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
        <el-table-column prop="path" label="链接地址"></el-table-column>
        <el-table-column prop="lvl" label="层级"></el-table-column>
        <el-table-column prop="sortNum" label="排序号"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span :style="{ color: (scope.row.status === 1 ? '#80B762' : 'red')}">{{ scope.row.status === 1 ? '启用' : '禁用' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作">
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
            <el-form-item label="上级菜单">
              <el-input v-model="addForm.preMenu" disabled class="input-with-select">
                <el-button slot="append" :disabled="isEdit" icon="el-icon-search" @click="handleOpenTreeDialog"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="addForm.menuName" placeholder="请输入菜单名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="菜单编码" prop="menuCode">
              <el-input v-model="addForm.menuCode" placeholder="请输入菜单编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="菜单图标">
              <el-input v-model="addForm.menuIcon" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="handleOpenIconDialog"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="菜单地址">
          <el-input v-model="addForm.menuAddress"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="11">
            <el-form-item label="权限">
              <el-input v-model="addForm.auth" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="打开方式">
              <el-radio-group v-model="addForm.openWay">
                <el-radio :label="1">标签页 </el-radio>
                <el-radio :label="0">新窗口</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="菜单状态">
          <el-radio-group v-model="addForm.menuStatus">
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
    <tree-dialog :treeVisible="treeVisible" @closeDialog="handleCloseTreeDialog" @getCurrentNode="getCurrentMenu"></tree-dialog>
  </div>
</template>

<script>
import treeDialog from '@/components/treeDialog'
export default {
  name: 'menuM',
  components: {
    treeDialog
  },
  data() {
    return {
      // 平台选择框
      platform: 0,
      platformOptions: [
        { value: 0, label: '后台管理平台' },
        { value: 1, label: '测试终端平台' }
      ],
      // 表格数据
      tableData: [
        { id: 1, name: '系统管理', code: 'SYS', path: '', lvl: 0, sortNum: 100, status: 1, hasChildren: true },
        { id: 2, name: '开发运维', code: 'BAYMAX_OO', path: '', lvl: 0, sortNum: 5000, status: 1, hasChildren: true },
        { id: 3, name: '数据源', code: 'STORAGE', path: '/storage', lvl: 0, sortNum: 5001, status: 0 }
      ],
      // 新增弹窗
      addVisible: false,
      // 上级菜单弹窗
      treeVisible: false,
      // 菜单图标弹窗
      iconVisible: false,
      // 图标数据
      iconData: [
        'gw-icon gw-icon-qiehuandaochaxunmoshi',
        'gw-icon gw-icon-jixianguanli',
        'gw-icon gw-icon-renwucaiji',
        'gw-icon gw-icon-shujuanquan',
        'gw-icon gw-icon-shujuku',
        'gw-icon gw-icon-sanjishijian',
        'gw-icon gw-icon-suoxiao',
        'gw-icon gw-icon-xitong',
        'gw-icon gw-icon-tongyijiancha',
        'gw-icon gw-icon-xitonganquan',
        'gw-icon gw-icon-anquanjianbaotongzhiguanli'
      ],
      // 弹窗表单
      addForm: {
        preMenu: '',
        menuName: '',
        menuCode: '',
        menuIcon: '',
        menuAddress: '',
        auth: '',
        openWay: 1,
        menuStatus: 1
      },
      // 弹窗表单必填项校验规则
      addRules: {
        menuName: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        menuCode: [
          { required: true, message: '请输入菜单编码', trigger: 'blur' }
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
    // 上级菜单弹窗-关闭
    handleCloseTreeDialog(msg) {
      this.treeVisible = msg
    },
    // 获取选择的上级菜单
    getCurrentMenu(data) {
      this.addForm.preMenu = data.label
    },
    // 菜单图标弹窗-打开
    handleOpenIconDialog() {
      this.iconVisible = true
    },
    // 双击选择图标
    handleSelectIcon(val) {
      this.addForm.menuIcon = val
      this.iconVisible = false
    },
    // 表格-树数据
    loadData(row, treeNode, resolve) {
      let allData = [
            { id: 11, parentId: 1, name: '用户管理', code: 'SYS_USER', path: '/system/user', lvl: 1, sortNum: 1, status: 1 },
            { id: 21, parentId: 2, name: '代码生成', code: 'BAYMAX_CODE', path: '/baymax/coder', lvl: 1, sortNum: 0, status: 1 }
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
