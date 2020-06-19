<template>
  <div class="tree-dialog">
    <el-dialog
      :modal-append-to-body="false"
      :visible.sync="treeVisible"
      :before-close="handleClose"
      :destroy-on-close="true"
      width="30%"
    >
      <div
        slot="title"
        class="dialog-title"
      >
        <span>选择</span>
      </div>
      <el-input
        v-model="filterText"
        placeholder="请输入搜索..."
      />
      <el-tree
        ref="tree"
        class="filter-tree"
        :data="treeData"
        :props="defaultProps"
        default-expand-all
        :highlight-current="true"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
      />
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          size="mini"
          @click="handleSave"
        >
          保存
        </el-button>
        <el-button
          size="mini"
          @click="handleClose"
        >
          关闭
        </el-button>
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
    },
    // 树数据
    treeData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  computed: {},
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 筛选
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
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
