<template>
  <div class="import-dialog">
    <el-dialog :modal-append-to-body="false" :visible.sync="importVisible" :before-close="handleCloseImport" :destroy-on-close="true" width="80%">
      <div slot="title" class="dialog-title">
        <span>导入</span>
      </div>
      <splitpanes>
        <pane size="40" min-size="40" max-size="50">
          <div class="pane-header">
            <div class="pane-headerL">
              <font-awesome-icon icon="cubes" />
              <span>Excel 配置项</span>
            </div>
            <div class="pane-headerR">
              <span>模板号：</span>
              <span>{{ templateNum }}</span>
            </div>
          </div>
          <div class="pane-main">
            <el-table
              :data="importTableData"
              header-cell-class-name="import-cell">
              <el-table-column
                prop="name"
                label="列名">
              </el-table-column>
              <el-table-column
                prop="number"
                label="列号">
                <template slot-scope="scope">
                 <el-input
                 :value="scope.row.number"
                  :disabled="true">
                </el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </pane>
        <pane>
          <div class="pane-header">
            <div class="pane-headerL">
              <font-awesome-icon icon="info" />
              <span>Excel 上传</span>
            </div>
          </div>
          <div class="pane-main">
            <font-awesome-icon icon="table" />
          </div>
        </pane>
      </splitpanes>
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
    importVisible: {
      type: Boolean,
      default: false
    },
    // 模板号
    templateNum: {
      type: String,
      default: 'SYS_USER'
    },
    // 左侧表格数据
    importTableData: {
      type: Array
    }
  },
  data () {
    return {
    }
  },
  methods: {
    handleCloseImport() {
      this.$emit('closeDialog', false)
    },
    handleSave() {
      this.$emit('closeDialog', false)
    },
    handleClose() {
      this.$emit('closeDialog', false)
    }
  }
}
</script>

<style lang="scss">
@import './importDialog.scss';
</style>
