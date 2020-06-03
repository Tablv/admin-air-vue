<template>
  <div class="assignUser">
    <el-dialog title="分配用户" :visible.sync="assignUserVisible" :modal-append-to-body="false"  :before-close="handleCloseAssignUser" :destroy-on-close="true" width="70%">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="选择用户" name="user"></el-tab-pane>
        <el-tab-pane label="选择部门" name="department"></el-tab-pane>
        <el-row :gutter="20" v-if="activeName === 'user'">
          <el-col :span="11">
            <el-table
              :data="leftList"
              :height="300"
              border
              fit
              v-loading="userLoadingL"
              @selection-change="handleLeftChange">
              <el-table-column type="selection" width="35"></el-table-column>
              <el-table-column prop="name" label="姓名">
              </el-table-column>
              <el-table-column prop="userName" label="用户名">
              </el-table-column>
            </el-table>
            <div class="dialog-pagination">
              <el-pagination
                background
                @size-change="handleLeftSizeChange"
                @current-change="handleLeftCurrentChange"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="leftPage.pageSize"
                :current-page="leftPage.pageNum"
                layout="prev, pager, next, jumper, total, sizes"
                :total="leftPage.total">
              </el-pagination>
            </div>
          </el-col>
          <el-col :span="2" class="center-button">
            <el-button
              type="primary"
              plain
              :disabled="!leftSelected.length"
              icon="el-icon-arrow-right"
              @click="doAddUser"
            ></el-button>
            <el-button
              type="primary"
              plain
              :disabled="!rightSelected.length"
              icon="el-icon-arrow-left"
              style="margin-left: 0;margin-top: 10px;"
              @click="doRemoveUser"
            ></el-button>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-table
              :data="rightList"
              :height="300"
              border
              fit
              v-loading="userLoadingR"
              @selection-change="handleRightChange">
              <el-table-column type="selection" width="35"></el-table-column>
              <el-table-column prop="name" label="姓名">
              </el-table-column>
              <el-table-column prop="userName" label="用户名">
              </el-table-column>
            </el-table>
            <div class="dialog-pagination">
              <el-pagination
                background
                @size-change="handleRightSizeChange"
                @current-change="handleRightCurrentChange"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="rightPage.pageSize"
                :current-page="rightPage.pageNum"
                layout="prev, pager, next, jumper, total, sizes"
                :total="rightPage.total">
              </el-pagination>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="activeName === 'department'">
          <el-col :span="11" class="dept-left">
            <el-tree ref="tree":data="treeData" node-key="id" :props="defaultProps" default-expand-all show-checkbox @check-change="handleCheckChange"></el-tree>
          </el-col>
          <el-col :span="2" class="center-button">
            <el-button
              type="primary"
              plain
              :disabled="!deptLeftSelected.length"
              icon="el-icon-arrow-right"
              @click="doAddDept"
            ></el-button>
            <el-button
              type="primary"
              plain
              :disabled="!deptRightSelected.length"
              icon="el-icon-arrow-left"
              style="margin-left: 0;margin-top: 10px;"
              @click="doRemoveDept"
            ></el-button>
          </el-col>
          <el-col :span="11" :offset="2">
            <el-table
              :data="deptRightList"
              :height="300"
              border
              fit
              v-loading="deptLoadingR"
              @selection-change="handleDeptRightChange">
              <el-table-column type="selection" width="35"></el-table-column>
              <el-table-column prop="code" label="部门编码">
              </el-table-column>
              <el-table-column prop="name" label="部门名称">
              </el-table-column>
            </el-table>
            <div class="dialog-pagination">
              <el-pagination
                background
                @size-change="handleDeptRightSizeChange"
                @current-change="handleDeptRightCurrentChange"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="deptRightPage.pageSize"
                :current-page="deptRightPage.pageNum"
                layout="prev, pager, next, jumper, total, sizes"
                :total="deptRightPage.total">
              </el-pagination>
            </div>
          </el-col>
        </el-row>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClose">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUnBindUser, getBindedUser } from '@/api/system/role'
export default {
  name: 'assignUser',
  props: {
    assignUserVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 默认选中标签
      activeName: 'user',
      userLoadingL: true,
      userLoadingR: true,
      deptLoadingR: true,
      // 选择用户-左侧表格
      leftList: [],
      // 左侧选中数据
      leftSelected: [],
      // 左侧分页
      leftPage: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      // 右侧表格
      rightList: [],
      // 右侧选中数据
      rightSelected: [],
      // 右侧分页
      rightPage: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      // 选择部门-左侧树结构
      treeData: [
        {
          label: 'XXXX公司',
          id: 1,
          children: [
            { label: '人力资源部', id: 11 },
            { label: '资源部', id: 12 }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 左侧选中数据
      deptLeftSelected: [],
      // 右侧表格
      deptRightList: [],
      // 右侧选中数据
      deptRightSelected: [],
      // 右侧分页
      deptRightPage: {
        pageSize: 10,
        pageNum: 1,
        total: 0
      }
    }
  },
  computed: {},
  watch: {},
  created() {
    this.doInit()
  },
  mounted() {},
  methods: {
    // 切换标签
    handleClick(tab, event) {
      if (tab.name === 'user') {
        this.doInit()
      } else {
        this.doDeptInit()
      }
    },
    // 选择用户-初始化获取数据
    doInit() {
      this.leftList = [
        { name: '新增', userName: '' },
        { name: '系统管理员', userName: 'admin' }
      ]
      this.rightList = [
        { name: 'guest', userName: 'guest' }
      ]
      this.userLoadingL = false
      this.userLoadingR = false
    },
    // 选择用户-左侧选中数据
    handleLeftChange(rows) {
      console.log('左侧', rows)
      this.leftSelected = rows
    },
    // 选择用户-右侧选中数据
    handleRightChange(rows) {
      console.log('右侧', rows)
      this.rightSelected = rows
    },
    // 选择用户-向右添加用户
    doAddUser() {

    },
    // 选择用户-向左删除用户
    doRemoveUser() {

    },
    // 选择用户-左侧分页-改变每页数量
    handleLeftSizeChange(val) {
      console.log(`左每页 ${val} 条`)
    },
    // 选择用户-左侧分页-改变页码
    handleLeftCurrentChange(val) {

    },
    // 选择用户-右侧分页-改变每页数量
    handleRightSizeChange(val) {
      console.log(`右每页 ${val} 条`)
    },
    // 选择用户-右侧分页-改变页码
    handleRightCurrentChange(val) {

    },
    // 选择部门-初始化获取数据
    doDeptInit() {
      this.deptRightList = [
        { code: 'company', name: 'XXXX公司' },
        { code: 'HR', name: '人力资源部' }
      ]
      this.deptLoadingR = false
    },
    // 选择部门-左侧选中数据
    handleCheckChange(data, checked, indeterminate) {
      this.deptLeftSelected = this.$refs.tree.getCheckedNodes()
    },
    // 选择部门-右侧选中数据
    handleDeptRightChange(rows) {
      this.deptRightSelected = rows
    },
    // 选择部门-向右添加部门
    doAddDept() {

    },
    // 选择部门-向左删除部门
    doRemoveDept() {

    },
    // 选择部门-右侧分页-改变每页数量
    handleDeptRightSizeChange(val) {
      console.log(`右每页 ${val} 条`)
    },
    // 选择部门-右侧分页-改变页码
    handleDeptRightCurrentChange(val) {

    },
    // 关闭弹窗
    handleCloseAssignUser() {
      this.$emit('closeDialog', false)
    },
    handleClose() {
      this.$emit('closeDialog', false)
    }
  }
}
</script>
<style lang="scss">
.assignUser{
  .el-dialog__wrapper .el-dialog .el-dialog__body{
    padding: 0;
    .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
      padding-left: 20px;
    }
    .el-tabs--top .el-tabs__item.is-top:last-child {
      padding-right: 20px;
    }
    .el-tabs__content {
      padding: 0 10px 10px;
      .dept-left {
        height: 333px;
        border: 1px solid #EBEEF5;
      }
      .center-button {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
      }
      .el-table-column--selection {
        .cell {
          text-overflow: unset;
        }
      }
      .dialog-pagination {
        border: 1px solid #EBEEF5;
        border-top: none;
        overflow: hidden;
        .el-pagination__jump {
          margin-left: 0;
        }
        .el-pagination__total{
          margin-left: 18px
        }
      }
    }
  }
}
</style>
