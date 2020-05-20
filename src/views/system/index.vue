<template>
  <div class="user">
    <header class="header">
      <div class="header-left">
        <div class="header-title">用户管理</div>
      </div>
      <div class="header-right">
        <el-button type="primary" size="mini" icon="el-icon-plus">新增</el-button>
        <el-button-group>
          <el-button size="mini" icon="el-icon-edit" />
          <el-button size="mini" icon="el-icon-share" />
          <el-button size="mini" icon="el-icon-delete" />
          <el-button size="mini" icon="el-icon-delete" />
        </el-button-group>
      </div>
    </header>
    <article>
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :header-cell-style="{backgroundColor:'#e7e7e7'}"
      >
        <el-table-column
          v-for="(item, index) in tableColumn"
          :key="index"
          :prop="item.prop"
          :label="item.label"
        >
          <template slot-scope="scope">
            <span v-if="scope.column.property === 'state'" :style="{ color: (scope.row.state === 1 ? '#80B762' : 'red')}">{{ scope.row.state === 1 ? '已启用' : '未启用' }}</span>
            <span v-else-if="scope.column.property === 'userName'">{{ scope.row.userName === '' ? '-' : scope.row.userName }}</span>
            <span v-else-if="scope.column.property === 'beizhu'">{{ scope.row.beizhu === '' ? '-' : scope.row.beizhu }}</span>
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="warning" icon="el-icon-edit" circle size="mini" @click="handleEdit(scope.$index, scope.row)" />
            <el-button type="primary" icon="el-icon-check" circle size="mini" @click="handleEdit(scope.$index, scope.row)" />
            <el-button type="danger" icon="el-icon-message" circle size="mini" @click="handleEdit(scope.$index, scope.row)" />
          </template>
        </el-table-column>
      </el-table>
    </article>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableColumn: [
        { prop: 'name', label: '姓名' },
        { prop: 'userName', label: '用户名' },
        { prop: 'state', label: '状态' },
        { prop: 'beizhu', label: '备注' }
      ],
      tableData: [
        { name: '系统管理员', userName: 'admin', state: 1, beizhu: '123' },
        { name: '系统管理员', userName: '', state: 0, beizhu: '' },
        { name: '系统管理员', userName: 'admin', state: 1, beizhu: '' }
      ]
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>

</style>
