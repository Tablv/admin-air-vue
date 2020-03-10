<template>
  <div class="user-manage">
    <div class="top">
      <div class="left title">{{ title }}</div>
      <div class="right">
        <el-button type="primary" icon="el-icon-plus" @click="handleBtnClick">新增</el-button>
      </div>
    </div>
    <div class="content">
      <el-table :data="tableData" border style="width: 100%;">
        <el-table-column prop="Name" label="姓名" width />
        <el-table-column prop="UserName" label="用户名" width />
        <el-table-column prop="state" label="状态" width />
        <el-table-column prop="operation" label="操作" width>
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.$index, scope.row)">
              <i class="el-icon-edit" />
            </el-button>
            <el-button type="text" @click.native.prevent="deleteRow(scope.$index, tableData)">
              <i class="el-icon-delete" />
            </el-button>
            <el-button type="text" @click.native.prevent="deleteRow(scope.$index, tableData)">
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 弹窗 -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="姓名：" prop="Name">
          <el-input v-model="ruleForm.Name" />
        </el-form-item>
        <el-form-item label="用户名：" prop="UserName">
          <el-input v-model="ruleForm.UserName" />
        </el-form-item>
        <el-form-item label="角色：" prop="state">
          <el-input v-model="ruleForm.state" />
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="ruleForm.desc" type="textarea" :rows="5" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
function resetForm() {
  return {
    Name: '',
    UserName: '',
    state: '',
    desc: ''
  }
}
export default {
  name: 'Index',
  components: {},
  data() {
    return {
      dialogFormVisible: false, // 弹窗
      title: '新增数据表单',
      disabled: false,
      resetFlag: false,
      ruleForm: resetForm(),
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
    // 翻页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      const that = this
      that.pagination.page_size = val
      that.getTableData(this.pagination.current_page, val)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      const that = this
      that.pagination.current_page = val
      that.getTableData(val, this.pagination.page_size)
    },
    // 修改
    handleEdit(index, row) {
      this.dialogFormVisible = true
      this.ruleForm = _.cloneDeep(row)
      this.title = '修改'
      // this.disabled = false;
      // this.resetFlag = true;
    },
    // 删除
    deleteRow(index, rows) {
      this.$confirm('此操作将永久删除该条信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        rows.splice(index, 1)
      })
    },
    // 修改密码
    password(index, rows) {},
    // 新增
    handleBtnClick() {
      this.dialogFormVisible = true
      this.title = '新增用户基础信息'
      this.disabled = false
      this.resetFlag && this.$refs['ruleForm'].resetFields()
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.tableData.unshift({
            Name: this.ruleForm.Name,
            UserName: this.ruleForm.UserName,
            state: this.ruleForm.state
          })
          this.$refs[formName].resetFields()
          this.dialogFormVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-table--medium th,
  .el-table--medium td {
    padding: 5px 0px;
  }
  .el-form-item--medium .el-form-item__label {
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
