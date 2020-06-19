import request from '@/utils/request'

/**
 * 过滤组件
 */
export const widgetsRenderer = {
  input (h) {
    return (
      <el-input
        v-model={ this.filterInits[this.filterItem.prop] }
        placeholder={ this.filterItem.label }
      />
    )
  },
  select(h) {
    let option = this.filterItem.filter.option;

    if (typeof option === "string") {
      option = [];

      request.get(column.filter.option).then(res => {
        option = res;
      })
    }
    return (
      <el-select
        v-model={ this.filterInits[this.filterItem.prop] }
      >
        {
          Object.entries(option).map(([value, label]) => (
            <el-option
              key={ value }
              label={ label }
              value={ value }
            />
          ))
        }
        
      </el-select>
    )
  },
  date(h) {
    return (
      <el-date-picker
        v-model={ this.filterInits[this.filterItem.prop] }
        type="date"
        clearable={ false }
        value-format="yyyy-MM-dd"
        placeholder="选择日期"
      />
    )
  },
  dates(h) {
    return (
      <div>
        <el-date-picker
          v-model={ this.filterInits[this.filterItem.filter.startDate] }
          type="date"
          clearable={ false }
          value-format="yyyy-MM-dd"
          placeholder="起始日期"
          style="margin-bottom: 10px;"
        />
        <el-date-picker
          v-model={ this.filterInits[this.filterItem.filter.endDate] }
          type="date"
          clearable={ false }
          value-format="yyyy-MM-dd"
          placeholder="截止日期"
        />
      </div>
    )
  }
};

/**
 * 过滤触发按钮
 */
export function filterBtnRenderer(h) {
  const filterType = this.filterItem.filter.type;
  const btnClass = "filter-popover-btn el-icon-search";
  let hasFilterValue = false;

  /**
   * 判断是否使用过滤
   */
  // dates 判断两个值
  if (filterType === "dates") {
    // 起始结束日期
    const startDate = this.filterParams[this.filterItem.filter.startDate];
    const endDate = this.filterParams[this.filterItem.filter.endDate];

    // 起始结束日期
    const hasStartTime = startDate && startDate !== '';
    const hasEndTime = endDate && endDate !== '';

    // 判断是否使用过滤
    hasFilterValue = hasStartTime || hasEndTime;
  } else {
    hasFilterValue = this.filterParams[this.filterItem.prop] && this.filterParams[this.filterItem.prop] !== '';
  }

  return (
    <i
      class={ `${btnClass} ${ hasFilterValue ? "is-active" : "" }` }
      slot="reference"
      onClick={ () => this.doClosePopover(this.filterItem.prop) }
    ></i>
  )
}