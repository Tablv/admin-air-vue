<template>
  <div class="gw-table-filter">
    <el-popover
      placement="bottom"
      :width="160"
      trigger="click"
    >
      <el-input
        v-if="filterItem.filter.type === 'input'"
        v-model="filterInits[filterItem.prop]"
        :placeholder="filterItem.label"/>
      <el-select
        v-else-if="filterItem.filter.type === 'select'"
        v-model="filterInits[filterItem.prop]"
        placeholder="">
        <el-option
          v-for="item in filterItem.filter.options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <div v-else-if="filterItem.filter.type === 'dates'">
        <el-date-picker
          v-model="filterInits[filterItem.filter.data1]"
          type="date"
          :clearable="false"
          value-format="yyyy-MM-dd"
          placeholder="起始日期"
          style="margin-bottom: 10px;">
        </el-date-picker>
        <el-date-picker
          v-model="filterInits[filterItem.filter.data2]"
          type="date"
          :clearable="false"
          value-format="yyyy-MM-dd"
          placeholder="截止日期">
        </el-date-picker>
      </div>
      <div v-else>
        <el-date-picker
          v-model="filterInits[filterItem.prop]"
          type="date"
          :clearable="false"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </div>
      <div class="table-filter-btn">
        <el-button type="primary" @click="tableFilter(filterItem)">筛选</el-button>
        <el-button style="float: right;" @click="tableFilter(filterItem, 'reset')">重置</el-button>
      </div>
      <i v-if="filterItem.filter.type === 'dates'" slot="reference" :style="{ color: ((filterParams[filterItem.filter.data1] && filterParams[filterItem.filter.data1] !== '') || (filterParams[filterItem.filter.data2] && filterParams[filterItem.filter.data2] !== '') ? '#409EFF' : '#909399') }" class="el-icon-search" @click="doClosePopover(filterItem.prop)"></i>
      <i v-else slot="reference" :style="{ color: (filterParams[filterItem.prop] && filterParams[filterItem.prop] !== '' ? '#409EFF' : '#909399') }" class="el-icon-search" @click="doClosePopover(filterItem.prop)"></i>
    </el-popover>
  </div>
</template>

<script>
export default {
  props: {
    filterInit: {
      type: Object,
      default: () => {
        return {}
      }
    },
    filterItem: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      filterInits: {},
      filterParams: {}
    }
  },
  computed: {},
  watch: {
  },
  created() {
    this.filterInits = JSON.parse(JSON.stringify(this.filterInit))
  },
  mounted() {},
  methods: {
    // 表格---远程筛选
    tableFilter(data, reset) {
      let filterParams = {}
      if (data.filter.type !== 'dates') {
        if (reset) {
          this.filterInits[data.filter.data] = ''
        }
        filterParams = this.filterInits
      } else {
        if (reset) {
          this.filterInits[data.filter.data1] = ''
          this.filterInits[data.filter.data2] = ''
        }
        filterParams = this.filterInits
      }
      this.filterParams = filterParams
      this.$emit('tableFilter', filterParams)
    },
    // 点击筛选图标关闭popover
    doClosePopover(val) {
      this.$emit('doClosePopover', val)
    }
  }
}
</script>
<style lang="scss">
@import './gwTableFilter.scss';
</style>
