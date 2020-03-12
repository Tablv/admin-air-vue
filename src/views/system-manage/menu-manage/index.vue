<template>
  <div class="menu-manager">
    <div class="tree left">
      <div class="tilte">
        <div class="left">
          <svg-icon icon-class="s-menu-m" />
          <span>菜单管理</span>
        </div>
        <div class="right">
          <el-tooltip class="item" effect="light" content="添加" placement="top">
            <el-button type="text" class="padding" @click="addBtnHandle(data)">
              <svg-icon icon-class="add-tree" />
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="light" content="删除" placement="top">
            <el-button type="text" class="padding" @click.native.prevent="delBtnHandle(data)">
              <i class="el-icon-delete" />
            </el-button>
          </el-tooltip>
        </div>
      </div>
      <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </div>
    <div class="tree-main left">
      <div class="tilte">
        <svg-icon icon-class="s-menu-i" />
        <span>菜单信息</span>
      </div>
      <div class="menu-manager-form">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="菜单编码：" prop="menuNumber">
            <el-input v-model="ruleForm.menuNumber"></el-input>
          </el-form-item>
          <el-form-item label="菜单名称：" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="菜单地址：" prop="MenuAddress">
            <el-input v-model="ruleForm.MenuAddress"></el-input>
          </el-form-item>
          <el-form-item label="菜单图标：" prop="MenuAddress" class="position">
            <el-input v-model="ruleForm.MenuAddress"></el-input>
            <el-tooltip class="item" effect="light" content="菜单图标选择" placement="top">
              <el-button type="primary" class="select-icon" @click.native.prevent="fixIcon()">
                <svg-icon icon-class="select-icon" />
              </el-button>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="权限：" prop="MenuAddress">
            <el-input v-model="ruleForm.MenuAddress" disabled="disabled"></el-input>
          </el-form-item>
          <el-form-item label="菜单状态：" prop="resource">
            <el-radio-group v-model="ruleForm.resource">
              <el-radio v-model="ruleForm.resource" label="1">启用</el-radio>
              <el-radio v-model="ruleForm.resource" label="2">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 菜单图标弹窗 -->
    <el-dialog
      title="菜单图标选择"
      :visible.sync="iconDialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-scrollbar class="page-component__scroll"></el-scrollbar>
      <span slot="footer" class="dialog-footer">
        <el-button @click="iconDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="iconDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  name: "MenuManager",
  components: {},
  data() {
    return {
      iconDialogVisible: false,
      ruleForm: {
        menuNumber: "",
        name: "",
        resource: "1"
      },
      data: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1"
                }
              ]
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1"
                }
              ]
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1"
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      rules: {
        menuNumber: [
          { required: true, message: "请输入菜单编码", trigger: "blur" }
          //{ min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        name: [
          { required: true, message: "请输入菜单名称", trigger: "blur" }
          //{ min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      }
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    handleNodeClick(data) {
      // console.log(data);
      this.ruleForm.name = data.label;
      this.ruleForm.menuNumber = data.$treeNodeId;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 表单重置按钮
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 添加菜单按钮
    addBtnHandle(data) {
      console.log(data);
    },
    delBtnHandle() {},
    // 菜单图标选择按钮
    fixIcon() {
      this.iconDialogVisible = true;
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-form-item.position {
    position: relative;
    .select-icon {
      padding: 6px 9px;
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
      position: absolute;
      right: 0px;
      bottom: 0px;
    }
  }
  .padding {
    padding: 0px 0px;
  }
  .el-icon-delete {
    font-size: 18px;
    color: #000;
    position: relative;
    top: 2px;
  }
  .el-form-item__label {
    font-weight: normal;
    font-size: 14px;
  }
  .el-tree {
    padding: 20px;
  }
}
.left {
  float: left;
}
.right {
  float: right;
}
.menu-manager {
  padding: 30px;
  .tilte {
    border-bottom: 1px solid #dcdfe6;
    padding: 10px 10px;
    overflow: hidden;
    span {
      padding-left: 5px;
    }
  }
  .tree {
    border: 1px solid #dcdfe6;
    // min-width: 260px;
    width: 20%;
    min-height: 86vh;
    margin-right: 20px;
  }
  .tree-main {
    width: 77%;
    border: 1px solid #dcdfe6;
    .menu-manager-form {
      min-height: 81.5vh;
      padding: 50px 0px 20px 50px;
      width: 50%;
    }
  }
  .left {
    float: left;
  }
}
</style>