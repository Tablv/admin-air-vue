import request from '@/utils/request'

/**
 * 过滤组件
 */
export const widgetsRenderer = {
  // eslint-disable-next-line
  input (h) {
    return (
      <el-input
        v-model={ this.filterStashMap[this.config.prop] }
        placeholder={ this.config.label }
      />
    )
  },
  // eslint-disable-next-line
  select(h) {
    let option = this.config.option;

    if (typeof option === "string") {
      option = [];

      // eslint-disable-next-line
      request.get(column.filter.option).then(res => {
        option = res;
      })
    }
    return (
      <el-select
        v-model={ this.filterStashMap[this.config.prop] }
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
  // eslint-disable-next-line
  date(h) {
    return (
      <el-date-picker
        v-model={ this.filterStashMap[this.config.prop] }
        type="date"
        clearable={ false }
        value-format="yyyy-MM-dd"
        placeholder="选择日期"
      />
    )
  },
  // eslint-disable-next-line
  dates(h) {
    return (
      <div>
        <el-date-picker
          v-model={ this.filterStashMap[this.config.startDate] }
          type="date"
          clearable={ false }
          value-format="yyyy-MM-dd"
          placeholder="起始日期"
          style="margin-bottom: 10px;"
        />
        <el-date-picker
          v-model={ this.filterStashMap[this.config.endDate] }
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
// eslint-disable-next-line
export function filterBtnRenderer(h) {
  const filterType = this.config.type;
  const btnClass = "filter-popover-btn el-icon-search";
  let hasFilterValue = false;

  /**
   * 判断是否使用过滤
   */
  // dates 判断两个值
  if (filterType === "dates") {
    // 起始结束日期
    const startDate = this.filterStashMap[this.config.startDate];
    const endDate = this.filterStashMap[this.config.endDate];

    // 起始结束日期
    const hasStartTime = startDate && startDate !== '';
    const hasEndTime = endDate && endDate !== '';

    // 判断是否使用过滤
    hasFilterValue = hasStartTime || hasEndTime;
  } else {
    hasFilterValue = this.filterStashMap[this.config.prop] && this.filterStashMap[this.config.prop] !== '';
  }

  return (
    <i
      class={ `${btnClass} ${ hasFilterValue ? "is-active" : "" }` }
      slot="reference"
      onClick={ () => this.closePopover(this.config.prop) }
    ></i>
  )
}