import "./index.scss";
import { buttonGroupRenderer } from "./button-group";

export default {
  props: {
    layout: {
      type: String,
      default: "add, update, remove, refresh, import, export, columns"
    }
  },
  computed: {
    table() {
      return this.$parent;
    },
    checkableColumns() {
      return this.table.columns.filter(column => column.hidden !== false);
    },
    tableTitle() {
      return this.table.title;
    }
  },
  // created() {
  //   this.table.columns
  //     .filter(column => column.hidden !== false)
  //     .map(column => {
  //       console.log(column.prop);
  //     })
  // },
  methods: {
    // eslint-disable-next-line
    titleRenderer(h) {
      return (
        <div class="header-title">{ this.tableTitle }</div>
      );
    },

    /**
     * 按钮事件
     */
    // 新增按钮
    handleAdd() {
      this.$emit('add')
    },
    // 修改按钮
    handleUpdate() {
      if (this.table.isRadio && this.table.currentRadio === "") {
        this.$message.warning("请选择一项数据");
        return;
      }

      this.$emit('update', this.table.currentSelection);
    },
    // 删除按钮
    handleDelete() {
      if (this.table.isRadio && this.table.currentRadio === "") {
        this.$message.warning("请选择一项数据");
        return;
      }
      
      this.$confirm('确认删除吗？', '信息', {
        type: "warning",
        closeOnClickModal: false,
        closeOnPressEscape: false,
      }).then(() => {
        this.$emit('delete', this.table.currentSelection);
      }).catch(() => {})
    },
    // 导入按钮
    handleImport(command) {
      this.$emit('import', command)
    },
    // 导出按钮
    handleExport() {
      this.$emit('export')
    },
    changeColumns(propName) {
      const column = this.table.columnsConfig.filter(column => column.prop === propName)[0];
      if (!column) return false;

      const beforeStatus = column.checked !== false;
      this.$set(column, "checked", !beforeStatus);
    }
  },
  // eslint-disable-next-line
  render(h) {
    return (
      <header class="gw-table-header">
        <el-row
          type="flex"
          justify="space-between"
        >
          <el-col span={6}>
            { this.titleRenderer(h) }
          </el-col>
          <el-col span={18}>
            { buttonGroupRenderer.call(this, h) }
          </el-col>
        </el-row>
      </header>
    )
  }
}