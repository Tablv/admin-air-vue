<template>
  <div class="assignMenu">
    <el-drawer
      :visible.sync="drawer"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
      :destroy-on-close="true"
      :modal="false"
      :show-close="false"
      size="40%"
      :before-close="handleClose">
      <template slot="title" slot-scope="scope">
        <div class="drawer-header">
          <span>分配菜单</span>
          <el-button icon="el-icon-close" type="text" @click="handleClose"></el-button>
        </div>
      </template>
      <div class="drawer-main">
        <el-select v-model="platform" filterable placeholder="请选择" @change="handleChangeTerminal">
          <el-option
            v-for="item in platformOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-tree
          ref="tree"
          :data="treeData"
          node-key="id"
          :props="defaultProps"
          default-expand-all
          :default-checked-keys="defaultChecked"
          show-checkbox
          @check-change="handleCheckChange"></el-tree>
      </div>
      <div class="drawer-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getTerminalList, getMenuList, doBindMenu } from '@/api/system/role'
export default {
  name: 'assignMenu',
  components: {},
  props: {
    drawer: {
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
      // 平台选择框
      platform: '0',
      platformOptions: [],
      // 选择菜单
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 选中菜单
      selectedMenu: '',
      // 已选中的菜单
      defaultChecked: []
    }
  },
  computed: {},
  watch: {
    drawer(val) {
      if (val) {
        this.getAllTerminal()
      }
    }
  },
  mounted() {},
  methods: {
    // 获取全部终端
    getAllTerminal() {
      getTerminalList().then(res => {
        let { success, result } = res
        this.platformOptions = result
        this.platformOptions.unshift({ id: '0', name: '请选择' })
      })
    },
    // 改变终端
    handleChangeTerminal(val) {
      this.platform = val
      let params = {
        terminalId: val,
        roleId: this.assignParams.id
      }
      getMenuList(params).then(res => {
        let { success, result } = res
        if (success === true) {
          this.treeData = result
          this.defaultChecked = []
          this.getCheckedMenu(result)
        }
      })
    },
    // 获取选中菜单
    getCheckedMenu(data) {
      data.map(item => {
        if (item.children && item.children.length > 0) {
          item.children.map(i => {
            if (i.checked === true) {
              this.defaultChecked.push(i.id)
            }
            if (i.children && i.children.length > 0) {
              this.getCheckedMenu(i.children)
            }
          })
        }
      })
    },
    // 选择菜单
    handleCheckChange(data, checked, indeterminate) {
      this.selectedMenu = this.$refs.tree.getHalfCheckedKeys().concat(this.$refs.tree.getCheckedKeys()).join(',')
    },
    handleSave() {
      let bindParams = {
        menuIds: this.selectedMenu,
        roleId: this.assignParams.id,
        rolename: this.assignParams.name,
        terminalId: this.platform
      }
      doBindMenu(bindParams).then(res => {
        if (res.success === true) {
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
          this.$emit('closeDrawer', false)
          this.handleReset()
        }
      })
    },
    handleClose() {
      this.$emit('closeDrawer', false)
      this.handleReset()
    },
    handleReset() {
      this.platform = '0'
      this.platformOptions = []
      this.treeData = []
      this.selectedMenu = ''
      this.defaultChecked = []
    }
  }
}
</script>
<style lang="scss">
.assignMenu{
  .el-drawer__wrapper {
    position: absolute;
    .el-drawer__header {
      height: 44px;
      // background-color: #F8F8F8;
      border-bottom: 1px solid #E7E7E7;
      margin-bottom: 0;
      padding: 10px;
      .drawer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    .el-drawer__body {
      padding: 10px;
      height: calc(100% - 69px);
      .drawer-main {
        height: calc(100% - 49px);
        overflow: auto;
        .el-select {
          margin-bottom: 5px;
        }
        .el-tree-node__label {
          font-size: 12px;
        }
      }
      .drawer-footer {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        border-top: 1px solid #E7E7E7;
        padding: 10px;
        .el-button {
          float: right;
          margin-left: 10px;
        }
      }
    }
  }
}
</style>
