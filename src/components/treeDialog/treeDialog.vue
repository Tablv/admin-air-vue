<template>
  <div class="tree-dialog">
    <el-dialog :modal-append-to-body="false" :visible.sync="treeVisible" :before-close="handleCloseTree" :destroy-on-close="true" width="30%">
      <div slot="title" class="dialog-title">
        <span>选择</span>
      </div>
      <el-input
        placeholder="请输入搜索..."
        v-model="filterText">
      </el-input>
      <el-tree
        class="filter-tree"
        :data="treeData"
        :props="defaultProps"
        default-expand-all
        :highlight-current="true"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        ref="tree">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="handleSave">保存</el-button>
        <el-button size="mini" @click="handleClose">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    // 控制弹窗显隐
    treeVisible: {
      type: Boolean,
      default: false
    }
  },
  computed: {},
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  data() {
    return {
      filterText: '',
      treeData: [
        {
          label: '系统管理',
          menuId: 1,
          children: [{
            label: '用户管理',
            menuId: 11
          }]
        },
        {
          label: '开发运维',
          menuId: 2,
          children: [{
            label: '代码生成',
            menuId: 21
          }]
        },
        {
          label: '数据源',
          menuId: 3
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 筛选
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleCloseTree() {
      this.$emit('closeDialog', false)
    },
    handleSave() {
      this.$emit('getCurrentNode', this.$refs.tree.getCurrentNode())
      this.$emit('closeDialog', false)
    },
    handleClose() {
      this.$emit('closeDialog', false)
    }
  }
}
</script>
<style lang="scss">
@import './treeDialog.scss';
</style>
