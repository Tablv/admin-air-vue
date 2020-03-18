<template>
  <div class="user-manage">
    <div class="top">
      <div class="left title">{{ topTitle }}</div>
      <div class="right">
        <el-button type="primary" icon="el-icon-plus" @click="createBtnHandle">新增</el-button>
      </div>
    </div>
    <div class="content">
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        :data="tableData"
        border
        style="width: 100%;"
      >
        <el-table-column prop="name" label="姓名" width />
        <el-table-column prop="username" label="用户名" width />
        <!-- <el-table-column prop="state" label="状态" width /> -->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="0"
              :inactive-value="1"
              @change="activeStatus(scope.$index, status)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" width>
          <template slot-scope="scope">
            <el-tooltip class="item" effect="light" content="编辑" placement="top">
              <el-button type="text" @click="editBtnHandle(scope.$index, scope.row)">
                <i class="el-icon-edit" />
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="删除" placement="top">
              <el-button type="text" @click.native.prevent="delBtnHandle(scope.row.id)">
                <i class="el-icon-delete" />
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="light" content="修改密码" placement="top">
              <el-button type="text" @click.native.prevent="pwdBtnHandle(scope.$index, scope.row)">
                <svg-icon icon-class="modifyPassword" />
              </el-button>
            </el-tooltip>
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
    <!-- 主要弹窗 -->
    <el-dialog
      :title="(isEdit ? '修改' : '新增') + '用户基础信息'"
      :visible.sync="formDialogVisible"
      class="formDialog"
    >
      <el-form ref="formData" :model="formData" :rules="rules" label-width="100px" class="formData">
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="formData.username" />
        </el-form-item>
        <el-form-item label="角色：" prop="role">
          <!-- <el-input v-model="formData.role" /> -->
          <el-select v-model="formData.role" placeholder="请选择">
            <el-option
              v-for="item in role"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：">
          <el-switch
            v-model="formData.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="0"
            :inactive-value="1"
            @change="activeDialogStatus($event, formData)"
          ></el-switch>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="formData.desc" type="textarea" :rows="5" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">保 存</el-button>
          <el-button @click="cancelForm">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 修改密码弹窗 -->
    <el-dialog title="修改密码" :visible.sync="pwdDialogVisible">
      <el-form ref="pwdForm" label-width="100px" class="pwdData">
        <el-form-item label="新密码：" prop="pwd">
          <el-input v-model="pwdData" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitPwd('tableData')">保 存</el-button>
          <el-button @click="cancelPwd">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
import { getToken } from "@/utils/auth";
import {
  userList,
  userListAdd,
  deleteUser,
  update,
  resetPwd
} from "@/api/system-manage/user-manage";
export default {
  name: "Index",
  components: {},
  data() {
    return {
      topTitle: "用户管理", // 主要弹窗title
      isEdit: false,
      loading: true,
      formDialogVisible: false, // 主要弹窗
      pwdDialogVisible: false, // 修改密码弹窗下标
      disabled: false,
      formData: this.getInitForm(),
      dialogStatus: "",
      pwdData: "",
      rules: {
        name: [
          { required: true, message: "请输入姓名", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        role: [
          { required: true, message: "请输入角色", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      tableData: [],
      pagination: {
        total: 0,
        page_size: 10,
        current_page: 1,
        page_sizes: [10, 20, 30, 50]
      },
      role: [
        {
          value: "1",
          label: "管理员1"
        },
        {
          value: "2",
          label: "管理员2"
        },
        {
          value: "3",
          label: "管理员3"
        }
      ]
    };
  },
  created() {
    // 初始化用户管理tableData数据
    this.loadData();
  },
  methods: {
    loadData() {
      userList({
        current: this.pagination.current_page,
        limit: this.pagination.page_size
      })
        .then(res => {
          this.tableData = res.result.list;
          this.loading = false;
          this.pagination.total = parseInt(res.result.total);
        })
        .catch(err => {
          console.error(err);
          this.$message.error("这是一条错误的用户信息，请稍后重试");
          return false;
        });
    },
    // 初始化表单数据
    getInitForm() {
      return {
        name: "",
        username: "",
        role: [],
        status: 0,
        desc: ""
      };
    },
    // 翻页
    pageSizeChangeHandle(val) {
      this.pagination.current_page = val;
      this.loadData(this.pagination.current_page, val);
    },
    pageChangeHandle(val) {
      this.pagination.page_size = val;
      this.loadData(val, this.pagination.page_size);
    },
    // Table 状态开启和关闭
    activeStatus() {
      //console.log(status);
    },
    // Dialog状态开启和关闭
    activeDialogStatus() {
      //console.log(status);
    },
    // 新增按钮事件
    createBtnHandle() {
      this.$refs["formData"]?.resetFields();
      this.formDialogVisible = true;
      this.isEdit = false;
      this.disabled = false;
      this.dialogStatus = "create";
    },
    // 编辑按钮事件
    editBtnHandle(index, row) {
      this.create = false;
      this.formDialogVisible = true;
      this.formData = _.cloneDeep(row);
      this.isEdit = true;
      this.resetFlag && this.$refs["formData"].resetFields();
    },
    // 删除按钮事件
    delBtnHandle(id) {
      deleteUser({
        id,
        authorization: getToken()
      });
      this.$confirm("确定删除多条数据吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(res => {
          this.loadData();
        })
        .catch(err => {
          console.error(err);
          this.$message.error("这是一条错误的用户信息，请稍后重试");
          return false;
        });
    },
    createData() {
      userListAdd(this.formData)
        .then(res => {
          this.loadData();
          this.formDialogVisible = false;
        })
        .catch(err => {
          console.error("error submit!!");
          this.$message.error("这是一条错误的用户信息，请稍后重试");
          return false;
        });
    },
    updateData() {
      update(this.formData)
        .then(res => {
          this.loadData();
          this.formDialogVisible = false;
        })
        .catch(err => {
          console.error("error submit!!");
          this.$message.error("这是一条错误的用户信息，请稍后重试");
          return false;
        });
    },
    cancelForm() {
      this.formData = this.getInitForm();
      this.$refs["formData"]?.resetFields();
      this.formDialogVisible = false;
    },
    // 修改密码按钮事件
    pwdBtnHandle(id) {
      console.log(id);
      this.pwdDialogVisible = true;
    },
    //  修改密码保存按钮
    submitPwd(index, row) {
      resetPwd({
        row: this.row.id,
        userId: this.pwdData,
        authorization: getToken()
      })
        .then(res => {
          console.log(id);
          this.pwdDialogVisible = false;
          debugger;
        })
        .catch(err => {
          console.error("error submit!!");
          this.$message.error("这是一条错误的用户信息，请稍后重试");
          return false;
        });
    },
    //  修改密码取消按钮
    cancelPwd() {
      this.pwdData = "";
      this.pwdDialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep {
  /*elementui loading */
  .el-loading-spinner .circular {
    width: 80px;
    height: 80px;
  }
  .el-loading-spinner {
    top: 32%;
    .el-loading-text {
      font-size: 18px;
      line-height: 40px;
    }
  }
  .el-dialog {
    width: 35%;
  }
  .el-dialog__body {
    padding-top: 10px;
    padding-bottom: 15px;
  }
  .el-table th,
  .el-table td {
    padding: 0px 0px;
  }
  .el-table th.is-leaf {
    padding: 10px 0px;
  }
  .el-table .cell {
    line-height: 20px;
  }
  .el-form-item__label {
    font-weight: normal;
  }
  .el-icon-edit,
  .el-icon-delete {
    font-size: 19px;
  }
  .svg-icon {
    font-size: 13px;
    position: relative;
    top: -2px;
  }
  .el-dialog__body {
    padding-right: 50px;
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
      font-size: 18px;
    }
  }
  .content {
    .el-icon-delete:before {
      color: #f00;
    }
  }
}
</style>
