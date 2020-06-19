<template>
  <div class="assignUser">
    <el-dialog title="分配用户" :visible.sync="assignUserVisible" :modal-append-to-body="false"  :before-close="handleClose" :destroy-on-close="true" width="70%">
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
              @click="doBindUser"
            ></el-button>
            <el-button
              type="primary"
              plain
              :disabled="!rightSelected.length"
              icon="el-icon-arrow-left"
              style="margin-left: 0;margin-top: 10px;"
              @click="doUnBindUser"
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
            <el-tree
              ref="tree"
              :data="treeData"
              node-key="id"
              :props="defaultProps"
              default-expand-all
              show-checkbox
              v-loading="deptLoadingL"
              @check-change="handleCheckChange"></el-tree>
              <!-- :default-checked-keys="checkedTree" -->
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
import { getUnBindUser, getBindedUser, doBindUser, doUnBindUser, getAllDept, getUnBindDept,getBindedDept, doBindDept, doUnBindDept } from '@/api/system/role'
import { isArray } from 'util';
export default {
  name: 'assignUser',
  props: {
    assignUserVisible: {
      type: Boolean,
      default: false
    },
    assignParams: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      // 默认选中标签
      activeName: 'user',
      userLoadingL: false,
      userLoadingR: false,
      deptLoadingL: false,
      deptLoadingR: false,
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
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 左侧已选中数据
      checkedTree: [],
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
  watch: {
    assignUserVisible(val) {
      if (val) {
        this.activeName = 'user'
        this.doInit()
      }
    }
  },
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
      this.userLoadingL = true
      this.userLoadingR = true
      let UnBindParams = {
        current: this.leftPage.pageNum,
        limit: this.leftPage.pageSize,
        filter: { roleId: this.assignParams.id }
      }
      getUnBindUser(UnBindParams).then(res => {
        this.userLoadingL = false
        let { success, result } = res
        if (success === true) {
          this.leftList = result.list
          this.leftPage = {
            pageSize: result.pageSize,
            pageNum: result.pageNum,
            total: result.total
          }
        }
      })
      let BindedParams = {
        current: this.rightPage.pageNum,
        limit: this.rightPage.pageSize,
        filter: { roleId: this.assignParams.id }
      }
      getBindedUser(BindedParams).then(res => {
        this.userLoadingR = false
        let { success, result } = res
        // if (success === true) {}
        this.rightList = result.list
        this.rightPage = {
          pageSize: result.pageSize,
          pageNum: result.pageNum,
          total: result.total
        }
      })
    },
    // 选择用户-左侧选中数据
    handleLeftChange(rows) {
      this.leftSelected = rows
    },
    // 选择用户-右侧选中数据
    handleRightChange(rows) {
      this.rightSelected = rows
    },
    // 选择用户-向右绑定用户
    doBindUser() {
      let bindUser = {
        roleId: this.assignParams.id,
        userIds: this.leftSelected.map(item => {
          return item.id
        }).join(',')
      }
      doBindUser(bindUser).then(res => {
        if (res.success === true) {
          this.doInit()
        }
      })
    },
    // 选择用户-向左解绑用户
    doUnBindUser() {
      let unBindUser = {
        roleId: this.assignParams.id,
        userIds: this.rightSelected.map(item => {
          return item.id
        }).join(',')
      }
      doUnBindUser(unBindUser).then(res => {
        if (res.success === true) {
          this.doInit()
        }
      })
    },
    // 选择用户-左侧分页-改变每页数量
    handleLeftSizeChange(val) {
      this.leftPage.pageSize = val
      this.doInit()
    },
    // 选择用户-左侧分页-改变页码
    handleLeftCurrentChange(val) {
      this.leftPage.pageNum = val
      this.doInit()
    },
    // 选择用户-右侧分页-改变每页数量
    handleRightSizeChange(val) {
      this.rightPage.pageSize = val
      this.doInit()
    },
    // 选择用户-右侧分页-改变页码
    handleRightCurrentChange(val) {
      this.rightPage.pageNum = val
      this.doInit()
    },
    // 选择部门-初始化获取数据
    doDeptInit() {
      this.deptLoadingL = true
      this.deptLoadingR = true
      getAllDept({ deptId: 0 }).then(res => {
        let { success, result } = res
        if (success === true) {}
        this.treeData = this.setDisabled(result)
        getUnBindDept({ roleId: this.assignParams.id }).then(res => {
          this.deptLoadingL = false
          let { success, result } = res
          if (success === true) {
            let unBindId = result.map(item => {
              return item.id
            })
            this.handleDisabledTree(unBindId, this.treeData)
          }
        })
      })
      let BindedParams = {
        current: this.deptRightPage.pageNum,
        limit: this.deptRightPage.pageSize,
        filter: { roleId: this.assignParams.id }
      }
      getBindedDept(BindedParams).then(res => {
        this.deptLoadingR = false
        let { success, result } = res
        if (success === true) {
          this.deptRightList = result.list
          this.deptRightPage = {
            pageSize: result.pageSize,
            pageNum: result.pageNum,
            total: result.total
          }
          // this.checkedTree = result.list.map(item => {
          //   return item.id
          // })
        }
      })
      // this.$nextTick(() => {
      //   this.$refs.tree.setCheckedKeys([])
      // })
    },
    setDisabled(data) {
      data.forEach(item => {
        item.disabled = false
        if (item.children && item.children.length > 0) {
          this.setDisabled(item.children)
        }
      })
      return data
    },
    handleDisabledTree(ids, data) {
      data.forEach(item => {
        if (!ids.includes(item.id)) {
          item.disabled = true
        }
        if (item.children && item.children.length > 0) {
          this.handleDisabledTree(ids, item.children)
        }
      })
    },
    // 选择部门-左侧选中数据
    handleCheckChange(data, checked, indeterminate) {
      let deptLeftSelected = []
      deptLeftSelected = this.$refs.tree.getCheckedNodes().filter(item => {
        return item.disabled !== true
      })
      this.deptLeftSelected = deptLeftSelected
    },
    // 选择部门-右侧选中数据
    handleDeptRightChange(rows) {
      this.deptRightSelected = rows
    },
    // 选择部门-向右绑定部门
    doAddDept() {
      let bindDept = {
        roleId: this.assignParams.id,
        deptIds: this.deptLeftSelected.map(item => {
          return item.id
        }).join(',')
      }
      doBindDept(bindDept).then(res => {
        if (res.success === true) {
          this.doDeptInit()
          this.deptLeftSelected = []
          // this.$nextTick(() => {
          //   this.$refs.tree.setCheckedKeys([])
          // })
        }
      })
    },
    // 选择部门-向左解绑部门
    doRemoveDept() {
      let unBindDept = {
        roleId: this.assignParams.id,
        deptIds: this.deptRightSelected.map(item => {
          return item.id
        }).join(',')
      }
      doUnBindDept(unBindDept).then(res => {
        if (res.success === true) {
          this.doDeptInit()
        }
      })
    },
    // 选择部门-右侧分页-改变每页数量
    handleDeptRightSizeChange(val) {
      this.deptRightPage.pageSize = val
      this.doDeptInit()
    },
    // 选择部门-右侧分页-改变页码
    handleDeptRightCurrentChange(val) {
      this.deptRightPage.pageNum = val
      this.doDeptInit()
    },
    // 关闭弹窗
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
