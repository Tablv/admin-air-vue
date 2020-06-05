<template>
  <div class="container">
    <header class="header">
      <el-row type="flex" justify="space-between">
        <el-col :span="6">
          <div class="header-title">终端管理</div>
        </el-col>
        <el-col :span="18">
          <div class="button-group">
            <el-button type="primary" icon="el-icon-plus" @click="handleOpenAdd">新增</el-button>
            <el-button icon="el-icon-refresh" class="first-button" @click="getInit"></el-button>
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
      <gw-table
        :tableData="tableData"
        :tableColumn="tableColumn"
        :checkedList="checkedList"
        :listLoading="listLoading"
        :activedFilter="activedFilter"
        :filter="filter"
        :page="page"
        @sort-change="sortChange"
        @filter="tableFilter"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      >
        <template slot-scope="operation">
          <el-button type="text" @click="handleEdit(operation.index, operation.row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(operation.index, operation.row)">删除</el-button>
        </template>
      </gw-table>
    </article>
    <!-- 新增弹窗 -->
    <el-dialog :modal-append-to-body="false" :visible.sync="addVisible" :before-close="handleClose" :destroy-on-close="true">
      <div slot="title" class="dialog-title">
        <span>{{ showStatus ? '修改' : '新增' }}</span>
      </div>
      <el-form ref="addForm" :model="addForm" :rules="addRules" label-position="right" label-width="auto">
        <el-row>
          <el-col :span="11">
            <el-form-item label="名称" prop="name">
              <el-input v-model="addForm.name" placeholder="请输入名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-form-item label="编码" prop="code">
              <el-input v-model="addForm.code" placeholder="请输入编码"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="状态" prop="status" v-if="showStatus">
          <el-radio-group v-model="addForm.status">
            <el-radio :label="0">启用</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="AppKey" prop="appKey" v-if="showStatus">
          <el-input v-model="addForm.appKey" disabled></el-input>
        </el-form-item>
        <el-form-item label="AppSecret" prop="appSecret" v-if="showStatus">
          <el-input v-model="addForm.appSecret" disabled></el-input>
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
  </div>
</template>

<script>
import { getTerminalList, doAddTerminal, doEditTerminal, getTerminalInfo, doDeleteTerminal } from '@/api/system/terminal'
import { doCheckRepeat } from '@/api/system/user'
import gwTable from '@/components/gwTable'
export default {
  name: 'SYS_TERMINAL',
  components: {
    gwTable
  },
  data() {
    var validName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('该项为必填项'))
      } else {
        let data = {
          tableName: 'AD_TERMINAL',
          columnName: 'NAME',
          value: value,
          name: value
        }
        if (this.showStatus) data.oldval = this.oldVal.name
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
          tableName: 'AD_TERMINAL',
          columnName: 'CODE',
          value: value,
          code: value
        }
        if (this.showStatus) data.oldval = this.oldVal.code
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
      // 初始化参数
      initParams: {
        order: 'asc',
        offset: 0,
        limit: 10
      },
      // 表格数据
      tableData: [],
      // 表格列数据
      tableColumn: [
        { prop: 'name', label: '名称', sort: 'custom', filter: 'input' },
        { prop: 'code', label: '编码', sort: 'custom', filter: 'input' },
        { prop: 'status', label: '状态', sort: 'custom', filter: 'select' },
        { prop: 'remark', label: '备注', sort: 'custom' },
        { prop: 'operation', label: '操作', width: '180' }
      ],
      // 表格loading
      listLoading: false,
      // 表格配置
      headerList: [
        { prop: 'name', label: '名称' },
        { prop: 'code', label: '编码' },
        { prop: 'status', label: '状态' },
        { prop: 'remark', label: '备注' },
        { prop: 'operation', label: '操作' }
      ],
      // 表格配置选中
      checkedList: ['name', 'code', 'status', 'remark', 'operation'],
      // 表格过滤
      filter: {
        name: '',
        code: '',
        status: '2'
      },
      activedFilter: {
        name: false,
        code: false,
        status: false
      },
      filterParams: {},
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
        code: '',
        status: 0,
        appKey: '',
        appSecret: '',
        remark: ''
      },
      showStatus: false,
      // 弹窗表单必填项校验规则
      addRules: {
        name: [
          { required: true, validator: validName, trigger: 'blur' }
        ],
        code: [
          { required: true, validator: validCode, trigger: 'blur' }
        ]
      },
      oldVal: {}
    }
  },
  created() {
    this.getInit()
  },
  methods: {
    // 初始化
    getInit() {
      this.listLoading = true
      getTerminalList(this.initParams).then(res => {
        this.listLoading = false
        let { success, result } = res
        if (success === true) {}
        this.tableData = result.list
        this.page = {
          pageSize: result.pageSize,
          pageNum: result.pageNum,
          total: result.total
        }
      })
    },
    // 新增弹窗-打开
    handleOpenAdd() {
      this.addVisible = true
    },
    // 弹窗-保存
    handleSave() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          let addForm = {}
          addForm = JSON.parse(JSON.stringify(this.addForm))
          if (!this.showStatus) {
            delete addForm.status
            delete addForm.appKey
            delete addForm.appSecret
          }
          if (!this.showStatus) {
            doAddTerminal(addForm).then(res => {
              if (res.success === true) {
                this.$message({
                  message: '操作成功！',
                  type: 'success'
                })
                this.getInit()
              }
            })
          } else {
            let editForm = {}
            editForm = {
              id: addForm.id,
              name: addForm.name,
              coed: addForm.code,
              status: addForm.status,
              remark: addForm.remark,
              appKey: addForm.appKey,
              appSecret: addForm.appSecret
            }
            doEditTerminal(editForm).then(res => {
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
          this.showStatus = false
          this.$refs['addForm'].resetFields()
        }
      })
    },
    // 弹窗-关闭
    handleClose() {
      this.addVisible = false
      this.showStatus = false
      this.$refs['addForm'].resetFields()
    },
    // 表格操作-编辑
    handleEdit(index, row) {
      this.showStatus = true
      this.addVisible = true
      getTerminalInfo({ id: row.id }).then(res => {
        let { success, result } = res
        if (success === true) {}
        this.addForm = result
        this.oldVal = {
          name: result.name,
          code: result.code
        }
      })
    },
    // 表格操作-删除
    handleDelete(index, row) {
      this.$confirm('删除后将不可恢复，确认删除吗？', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        cancelButtonClass: 'messageBoxCancelButton'
      }).then(action => {
        if (action === 'confirm') {
          doDeleteTerminal({ id: row.id }).then(res => {
            if (res.success === true) {
              this.$message({
                message: '操作成功！',
                type: 'success'
              })
              this.getInit()
            }
          })
        }
      }).catch(() => {})
    },
    // 表格-配置
    changeCheckbox(value) {
      this.checkedList = value
    },
    // 表格-远程排序
    sortChange(column) {
      if (column.order) {
        this.initParams.sort = column.prop
        this.initParams.order = column.order === 'descending' ? 'desc' : 'asc'
      } else {
        delete this.initParams.sort
        this.initParams.order = 'asc'
      }
      this.getInit()
    },
    // 表格-筛选
    tableFilter({ filter, type, reset }) {
      switch (type) {
        case 'name':
          if (filter.name) {
            this.filterParams.name = filter.name
            this.activedFilter[type] = true
          } else {
            delete this.filterParams.name
            this.activedFilter[type] = false
          }
          if (reset === 'reset') {
            delete this.filterParams.name
            this.activedFilter[type] = false
          }
          break
        case 'code':
          if (filter.code) {
            this.filterParams.code = filter.code
            this.activedFilter[type] = true
          } else {
            delete this.filterParams.code
            this.activedFilter[type] = false
          }
          if (reset === 'reset') {
            delete this.filterParams.code
            this.activedFilter[type] = false
          }
          break
        case 'status':
          if (filter.status && filter.status !== '2') {
            this.filterParams.status = filter.status
            this.activedFilter[type] = true
          } else {
            delete this.filterParams.status
            this.activedFilter[type] = false
          }
          if (reset === 'reset') {
            delete this.filterParams.status
            this.activedFilter[type] = false
          }
          break
      }
      Object.keys(this.filterParams).length !== 0 ? this.initParams.filter = this.filterParams : delete this.initParams.filter
      this.getInit()
    },
    // 分页-改变每页数量
    handleSizeChange(val) {
      this.page.pageSize = val
      this.initParams.limit = val
      this.getInit()
    },
    // 分页-改变页码
    handleCurrentChange(val) {
      this.page.pageNum = val
      this.initParams.offset = (val - 1) * this.initParams.limit
      this.getInit()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
