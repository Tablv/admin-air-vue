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
        <el-table-column prop="designation" label="名称" width />
        <el-table-column prop="userName" label="编码" width />
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#ff4949"
              inactive-color="#13ce66"
              active-text="关闭"
              inactive-text="启用"
              active-value="0"
              inactive-value="1"
              @change="active_text($event, scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="备注" width />
        <el-table-column prop="operation" label="操作" width>
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button type="text" @click="editBtnHandle(scope.$index, scope.row)">
                <i class="el-icon-edit" />
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="text" @click.native.prevent="delBtnHandle(scope.$index, tableData)">
                <i class="el-icon-delete" />
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="设置菜单" placement="top">
              <el-button
                type="text"
                @click.native.prevent="setMenuBtnHandle(scope.$index, tableData)"
              >
                <svg-icon icon-class="set-menu" />
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配人员" placement="top">
              <el-button
                type="text"
                @click.native.prevent="assignBtnHandle(scope.$index, tableData)"
              >
                <svg-icon icon-class="allot-per" />
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
    <el-dialog :title="(isEdit ? '修改' : '新增') + '用户基础信息'" :visible.sync="formDialogVisible">
      <el-form ref="mainForm" :model="formData" :rules="rules" label-width="100px" class="formData">
        <el-form-item label="姓名：" prop="designation">
          <el-input v-model="formData.designation" />
        </el-form-item>
        <el-form-item label="用户名：" prop="userName">
          <el-input v-model="formData.userName" />
        </el-form-item>
        <el-form-item label="角色：" prop="role">
          <el-input v-model="formData.role" />
        </el-form-item>
        <el-form-item label="状态：">
          <el-switch
            v-model="formData.status"
            active-color="#ff4949"
            inactive-color="#13ce66"
            active-text="关闭"
            inactive-text="启用"
            active-value="0"
            inactive-value="1"
            @change="active_text($event, formData)"
          ></el-switch>
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
    <!-- 设置菜单弹窗 -->
    <el-dialog title="设置角色菜单" :visible.sync="setMenuDialogVisible" class="setMenuDialog">
      <el-scrollbar class="page-component__scroll">
        <el-tree
          :data="setMenuData"
          show-checkbox
          node-key="id"
          :default-expanded-keys="[1, 2, 3]"
          :default-checked-keys="[5]"
          :props="defaultProps"
        ></el-tree>
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPwd">保 存</el-button>
        <el-button @click="cancelPwd">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 分配人员弹窗 -->
    <el-dialog title="分配人员设置" :visible.sync="assignDialogVisible" class="setMenuDialog">
      <el-scrollbar class="page-component__scroll">
        <el-transfer v-model="value" :data="data"></el-transfer>
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAssign">保 存</el-button>
        <el-button @click="cancelAssign">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  name: "Index",
  components: {},
  data() {
    const generateData = _ => {
      const data = [];
      for (let i = 1; i <= 15; i++) {
        data.push({
          key: i,
          label: `备选项 ${i}`,
          disabled: i % 4 === 0
        });
      }
      return data;
    };
    return {
      topTitle: "角色管理", // 主要弹窗title
      isEdit: false,
      formDialogVisible: false, // 主要弹窗
      setMenuDialogVisible: false, // 设置菜单弹窗
      assignDialogVisible: false, // 分配人员弹窗
      disabled: false,
      formData: this.getInitForm(),
      pwdData: "",
      rules: {
        designation: [
          { required: true, message: "请输入姓名", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        role: [
          { required: true, message: "请输入角色", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      tableData: [
        {
          designation: "张三",
          userName: "admin",
          status: "1",
          desc: "备注备注"
        },
        {
          designation: "张三",
          userName: "admin",
          status: "1",
          desc: "备注备注"
        },
        {
          designation: "张三",
          userName: "admin",
          status: "0",
          desc: "备注备注"
        },
        {
          designation: "张三",
          userName: "admin",
          status: "0",
          desc: "备注备注"
        },
        {
          designation: "张三",
          userName: "admin",
          status: "1",
          desc: "备注备注"
        }
      ],
      pagination: {
        total: 0,
        page_size: 10,
        current_page: 1,
        page_sizes: [10, 20, 30, 50]
      },
      // 分配菜单弹窗内容
      setMenuData: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 分配人员
      data: generateData(),
      value: [1, 4]
    };
  },
  created() {},
  methods: {
    // 初始化表单数据
    getInitForm() {
      return {
        name: "",
        userName: "",
        role: "",
        status: "",
        desc: ""
      };
    },
    // 翻页
    pageSizeChangeHandle(val) {
      this.getTableData(this.pagination.current_page, val);
    },
    pageChangeHandle(val) {
      this.getTableData(val, this.pagination.page_size);
    },
    // Table 状态开启和关闭
    active_text(value, row) {
      console.log(value, row);
    },
    // 新增按钮事件
    createBtnHandle() {
      this.formDialogVisible = true;
      this.isEdit = false;
      this.disabled = false;
      this.resetFlag && this.$refs["formData"].resetFields();
    },
    // 修改按钮事件
    editBtnHandle(index, row) {
      this.formDialogVisible = true;
      this.formData = _.cloneDeep(row);
      this.isEdit = true;
      // this.disabled = false;
    },
    // 删除按钮事件
    delBtnHandle(index, rows) {
      this.$confirm("此操作将永久删除该条信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        rows.splice(index, 1);
      });
    },
    submitForm(mainForm) {
      this.$refs.mainForm.validate(valid => {
        if (valid) {
          this.tableData.unshift({
            designation: this.formData.designation,
            userName: this.formData.userName,
            role: this.formData.role,
            status: this.formData.status,
            desc: this.formData.desc
          });
          this.$refs.mainForm.resetFields();
          this.formDialogVisible = false;
        } else {
          console.error("error submit!!");
          return false;
        }
      });
    },
    cancelForm() {
      this.formData = this.getInitForm();
      this.$refs["mainForm"]?.resetFields();
      this.formDialogVisible = false;
    },

    // 设置菜单按钮事件
    setMenuBtnHandle(index, rows) {
      this.setMenuDialogVisible = true;
    },
    //  设置菜单保存按钮
    submitPwd() {
      this.pwdData = "";
      this.setMenuDialogVisible = false;
    },
    //  设置菜单取消按钮
    cancelPwd() {
      this.pwdData = "";
      this.setMenuDialogVisible = false;
    },
    // 设置菜单按钮事件
    assignBtnHandle(index, rows) {
      this.assignDialogVisible = true;
    },
    //  设置菜单保存按钮
    submitAssign() {
      this.pwdData = "";
      this.assignDialogVisible = false;
    },
    //  设置菜单取消按钮
    cancelAssign() {
      this.pwdData = "";
      this.assignDialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep {
  .setMenuDialog .el-dialog {
    .el-dialog__body {
      height: 60vh;
    }
    .el-dialog__footer {
      position: relative;
      right: 20px;
      bottom: 0px;
    }
  }
  .page-component__scroll {
    height: 100%;
  }
  .page-component__scroll .el-scrollbar__wrap {
    overflow-y: auto;
    overflow-x: hidden;
  }
  .el-dialog__body {
    padding-top: 10px;
    padding-bottom: 10px;
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
  // 穿梭框样式
  .el-transfer-panel {
    width: 41.2%;
    height: 100%;
  }
  .el-transfer-panel__body,
  .el-transfer {
    height: 100%;
  }
  .el-transfer-panel__list {
    // height: 100%;
    height: 50vh;
    overflow-y: auto;
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
