<template>
  <div class="container">
    <article>
      <gw-table
        ref="gwTable"
        :table-config="tableConfig"
        @changeColumns="changeColumns"
      >
        <template slot="buttons">
          <el-button
            type="primary"
            @click="handleDelete"
          >
            <font-awesome-icon
              icon="eraser"
              pull="left"
            />
            <span>清空</span>
          </el-button>
        </template>
      </gw-table>
    </article>
  </div>
</template>

<script>
import { doDeleteAll } from '@/api/system/logger'
import GwTable from '@/components/GwTable'
export default {
  name: 'SYSLOG',
  components: {
    GwTable
  },
  data() {
    return {
       // 表格
      tableConfig: {
        api: 'plugin/logger/list',
        // 表格列数据
        columns: [
          { prop: 'content', label: '日志内容', width: '150' },
          { prop: 'userName', label: '用户名', sort: 'custom', filter: { type: 'input', data: 'userName' }, width: '130' },
          { prop: 'realName', label: '操作人', sort: 'custom', filter: { type: 'input', data: 'realName' }, width: '130' },
          { prop: 'operateDate', label: '操作时间', sort: 'custom', filter: { type: 'dates', startDate: 'operateDate_start', endDate: 'operateDate_end' }, width: '160' },
          { prop: 'browser', label: '浏览器', width: '130' },
          { prop: 'operatingSystem', label: '操作系统', width: '130' },
          { prop: 'ipAddress', label: 'IP地址', width: '150' },
          { prop: 'requestPath', label: '请求地址', width: '300' },
          { prop: 'logType', label: '日志类型', width: '100' }
        ],
        // 表格配置选中
        checkedColumns: ['content', 'userName', 'realName', 'operateDate', 'browser', 'operatingSystem', 'ipAddress', 'requestPath', 'logType'],
        title: '日志管理',
        // 按钮配置
        buttons: ['slot', 'refresh', 'export', 'columns'],
        // 是否分页
        pagination: true
      },
      // 表格列数据
      tableColumn: [

      ],
    }
  },
  methods: {
    // 清空
    handleDelete() {
      this.$confirm('确认删除吗？', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        closeOnPressEscape: false,
        cancelButtonClass: 'messageBoxCancelButton'
      }).then(action => {
        if (action === 'confirm') {
          doDeleteAll().then(() => {
            this.$message({
              message: '操作成功！',
              type: 'success'
            })
            this.$refs.gwTable.getInit()
          })
        }
      }).catch(() => {})
    },
    // 表格---配置
    changeColumns(value) {
      this.tableConfig.checkedColumns = value
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
