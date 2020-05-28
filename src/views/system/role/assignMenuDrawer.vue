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
          <el-button type="danger" icon="el-icon-close" circle @click="handleClose"></el-button>
        </div>
      </template>
      <div class="drawer-main">
        <el-select v-model="platform" filterable placeholder="请选择">
          <el-option
            v-for="item in platformOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
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
export default {
  name: 'assignMenu',
  components: {},
  props: {
    drawer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 平台选择框
      platform: 0,
      platformOptions: [
        { value: 0, label: '后台管理平台' },
        { value: 1, label: '测试终端平台' }
      ],
      // 选择菜单
      treeData: [
        {
          label: '系统管理',
          id: 1,
          children: [
            { label: '用户管理', id: 11 },
            { label: '菜单管理', id: 12 }
          ]
        },
        {
          label: '开发运维',
          id: 2,
          children: [
            { label: '代码生成', id: 21 }
          ]
        },
        { label: '数据源', id: 3 },
        { label: '数据集', id: 4 }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 已选中的菜单
      defaultChecked: []
    }
  },
  computed: {},
  watch: {},
  created() {
    this.doInit()
  },
  mounted() {},
  methods: {
    // 初始化
    doInit() {
      this.defaultChecked = [3, 4]
    },
    // 选择菜单
    handleCheckChange(data, checked, indeterminate) {
      console.log(this.$refs.tree.getCheckedNodes())
    },
    handleClose() {
      this.$emit('closeDrawer', false)
    },
    handleSave() {
      this.$emit('closeDrawer', false)
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
      background-color: #F8F8F8;
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
      .drawer-main {
        .el-select {
          margin-bottom: 5px;
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
