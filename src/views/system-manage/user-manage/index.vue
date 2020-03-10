<template>
  <div class="user-manage">
    <div class="top">
      <div class="left title">{{ topTitle }}</div>
      <div class="right">
        <el-button type="primary" icon="el-icon-plus" @click="createBtnHandle">新增</el-button>
      </div>
    </div>
    <div class="content">
      <el-table :data="tableData" border style="width: 100%;">
        <el-table-column prop="Name" label="姓名" width />
        <el-table-column prop="UserName" label="用户名" width />
        <el-table-column prop="state" label="状态" width />
        <el-table-column prop="operation" label="操作" width>
          <template slot-scope="scope">
            <el-button type="text" @click="editBtnHandle(scope.$index, scope.row)">
              <i class="el-icon-edit" />
            </el-button>
            <el-button type="text" @click.native.prevent="delBtnHandle(scope.$index, tableData)">
              <i class="el-icon-delete" />
            </el-button>
            <el-button type="text" @click.native.prevent="pwdBtnHandle(scope.$index, tableData)">
              <svg-icon icon-class="modifyPassword" />
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 翻页 -->
    <div class="y-pagination">
      <el-pagination
        :current-page="pagination.current_page"
        :page-sizes="pagination.page_sizes"
        :page-size="pagination.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="pageSizeChangeHandle"
        @current-change="pageChangeHandle"
      />
    </div>
    <!-- 弹窗 -->
    <el-dialog :title="(isEdit ? '修改' : '新增') + '用户基础信息'" :visible.sync="formDialogVisible">
      <el-form
        ref="mainForm"
        :model="formData"
        :rules="rules"
        label-width="100px"
        class="demo-formData"
      >
        <el-form-item label="姓名：" prop="Name">
          <el-input v-model="formData.Name" />
        </el-form-item>
        <el-form-item label="用户名：" prop="UserName">
          <el-input v-model="formData.UserName" />
        </el-form-item>
        <el-form-item label="角色：" prop="state">
          <el-input v-model="formData.state" />
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="formData.desc" type="textarea" :rows="5" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('formData')">保 存</el-button>
          <el-button @click="cancelForm">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'Index',
  components: {},
  data() {
    return {
      topTitle: "用户管理",
      isEdit: false,
      formDialogVisible: false, // 弹窗
      disabled: false,
      formData: this.getInitForm(),
      rules: {
        Name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        UserName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        state: [
          { required: true, message: '请输入角色', trigger: 'blur' }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      tableData: [
        {
          Name: '张三',
          UserName: 'admin',
          state: '启用'
        },
        {
          Name: '张三',
          UserName: 'admin',
          state: '启用'
        },
        {
          Name: '张三',
          UserName: 'admin',
          state: '启用'
        },
        {
          Name: '张三',
          UserName: 'admin',
          state: '启用'
        },
        {
          Name: '张三',
          UserName: 'admin',
          state: '启用'
        }
      ],
      pagination: {
        total: 0,
        page_size: 10,
        current_page: 1,
        page_sizes: [10, 20, 30, 50]
      }
    }
  },
  created() {},
  methods: {
    // 初始化表单数据
    getInitForm() {
      return {
        Name: '',
        UserName: '',
        state: '',
        desc: ''
      }
    },
    // 翻页
    pageSizeChangeHandle(val) {
      console.log(`每页 ${val} 条`)
      const that = this
      that.pagination.page_size = val
      that.getTableData(this.pagination.current_page, val)
    },
    pageChangeHandle(val) {
      console.log(`当前页: ${val}`)
      const that = this
      that.pagination.current_page = val
      that.getTableData(val, this.pagination.page_size)
    },
    // 新增按钮事件
    createBtnHandle() {
      this.formDialogVisible = true
      this.disabled = false
      this.resetFlag && this.$refs['formData'].resetFields()
    },
    // 修改按钮事件
    editBtnHandle(index, row) {
      this.formDialogVisible = true
      this.formData = _.cloneDeep(row)
      // this.disabled = false;
    },
    // 删除按钮事件
    delBtnHandle(index, rows) {
      this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        rows.splice(index, 1)
      })
    },
    // 修改密码按钮事件
    pwdBtnHandle(index, rows) {},
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.tableData.unshift({
            Name: this.formData.Name,
            UserName: this.formData.UserName,
            state: this.formData.state
          })
          this.$refs[formName].resetFields()
          this.formDialogVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancelForm() {
      this.formData = this.getInitForm();
      this.$refs['mainForm']?.resetFields();
      this.formDialogVisible = false;
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-table th,
  .el-table td {
    padding: 5px 0px;
  }
  .el-form-item__label {
    font-weight: normal;
  }
  .el-icon-edit,
  .el-icon-delete,
  .svg-icon {
    font-size: 18px;
  }
}
.y-pagination {
  text-align: right;
  padding: 30px 0px;
}
.left {
  float: left;
}
.right {
  float: right;
}
.clear {
  clear: both;
}
.user-manage {
  padding: 30px;
  .top {
    overflow: hidden;
    margin-bottom: 20px;
    .title {
      line-height: 36px;
    }
  }
  .content {
    .el-icon-delete:before {
      color: #f00;
    }
  }
}
</style>
