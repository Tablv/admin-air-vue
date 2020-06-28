/* eslint-disable */
const TEMPLATE_MAP = {
  // 新增
  add(h) {
    return (
      <el-button
        type="primary"
        onClick={ this.handleAdd }
      >
        <font-awesome-icon
          icon="plus"
          pull="left"
        />
        <span>新增</span>
      </el-button>
    )
  },
  // 修改
  update(h) {
    return (
      <el-button
        type="primary"
        onClick={ this.handleUpdate }
      >
        <font-awesome-icon
          icon="edit"
          pull="left"
        />
        <span>修改</span>
      </el-button>
    )
  },
  // 删除
  remove(h) {
    return (
      <el-button
        type="danger"
        onClick={ this.handleDelete }
      >
        <font-awesome-icon
          icon="trash-alt"
          pull="left"
        />
        <span>删除</span>
      </el-button>
    )
  },
  // 插槽
  slot(h) {
    debugger;

    return this.$slots['custom'][0];
  },
  // 刷新
  refresh(h) {
    return (
      <el-button
        onClick={ this.table.getInit }
      >
        <font-awesome-icon icon="sync-alt" />
      </el-button>
    )
  },
  // 导入
  import(h) {
    return (
      <el-dropdown
        trigger="click"
        onCommand={ this.handleImport }
      >
        <el-button>
          <font-awesome-icon
            icon="download"
            pull="left"
          />
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="excel">
            <span>导入 Excel</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    )
  },
  // 导出
  export(h) {
    return (
      <el-dropdown
        trigger="click"
        onCommand={ this.handleExport }
      >
        <el-button>
          <font-awesome-icon
            icon="upload"
            pull="left"
          />
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="excel">
            <span>导出 Excel</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    )
  },
  // 表格配置
  columns(h) {
    return (
      <el-dropdown
        trigger="click"
        hide-on-click={ false }
        onCommand={ this.changeColumns }
      >
        <el-button>
          <font-awesome-icon icon="th" />
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>

        <el-dropdown-menu class="gw-table-header-dropdown" slot="dropdown">
          {
            this.checkableColumns.map(column => {
              return (
                <el-dropdown-item key={ column.prop } command={ column.prop }>
                  {/* <el-checkbox onNativeClick={ ($event) => { $event.stopPropagation() } } checked={ column.checked !== false }> */}
                  {/* </el-checkbox> */}
                  <span>{ column.checked }</span>
                  <i class={ `el-icon-check${column.checked !== false ? '' : ' not-checked'}` }></i>
                  <span>{ column.label }</span>
                </el-dropdown-item>
              )
            })
          }
        </el-dropdown-menu>
      </el-dropdown>
    )
  }
}
/* eslint-enable */

// eslint-disable-next-line
export function buttonGroupRenderer(h) {
  let isInBtnGroup = false;

  const buttons = this.layout
    .split(",") // 根据逗号拆分
    .reduce((reducedArr, layoutName) => {
      if (layoutName.trim().startsWith("[")) {
        isInBtnGroup = true;
        reducedArr.push(layoutName.replace("[", ""));
      } else if (layoutName.trim().endsWith("]")) {
        isInBtnGroup = false;
        const maxIndex = reducedArr.length - 1;
        reducedArr[maxIndex] += `#${layoutName.replace("]", "")}`
      } else if (isInBtnGroup) {
        const maxIndex = reducedArr.length - 1;
        reducedArr[maxIndex] += `#${layoutName}`
      } else {
        reducedArr.push(layoutName);
      }
      return reducedArr;
    }, [])
    .map(layoutName => {
      const name = layoutName.trim();

      // 按钮组
      if (name.includes("#")) {
        // 按钮组内的按钮
        const innerLayouts = name.split("#").map(layout => layout.trim());
        return (
          <el-button-group>
            { innerLayouts.map(layout => TEMPLATE_MAP[layout].call(this, h)) }
          </el-button-group>
        )
      }

      // 常规布局
      return TEMPLATE_MAP[name].call(this, h);
    });

  return (
    <div class="button-group">
      { buttons }
    </div>
  )
}