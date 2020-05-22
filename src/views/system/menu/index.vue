<template>
  <div class="container">
    <header class="header">
      <div class="header-left">
        <div class="header-title">菜单管理</div>
      </div>
      <div class="header-right">
        <el-select v-model="platform" filterable placeholder="请选择">
          <el-option
            v-for="item in platformOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" @click="handleOpenAdd">新增</el-button>
      </div>
    </header>
    <article>
      <el-table
        :data="tableData"
        row-key="id"
        size="medium"
        border
        lazy
        :load="loadData"
        header-cell-class-name="header-cell"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="code" label="编码"></el-table-column>
        <el-table-column prop="path" label="链接地址"></el-table-column>
        <el-table-column prop="lvl" label="层级"></el-table-column>
        <el-table-column prop="sortNum" label="排序号"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span :style="{ color: (scope.row.status === 1 ? '#80B762' : 'red')}">{{ scope.row.status === 1 ? '启用' : '禁用' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-plus" circle @click="handleAdd(scope.$index, scope.row)" />
            <el-button type="primary" icon="el-icon-edit-outline" circle @click="handleEdit(scope.$index, scope.row)" />
            <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.$index, scope.row)" />
          </template>
        </el-table-column>
      </el-table>
    </article>
    <!-- 新增弹窗 -->

  </div>
</template>

<script>
export default {
  name: 'menuM',
  components: {},
  data() {
    return {
      // 平台选择框
      platform: 0,
      platformOptions: [
        { value: 0, label: '后台管理平台' },
        { value: 1, label: '测试终端平台' }
      ],
      // 表格数据
      tableData: [
        { id: 1, name: '系统管理', code: 'SYS', path: '', lvl: 0, sortNum: 100, status: 1, hasChildren: true },
        { id: 2, name: '开发运维', code: 'BAYMAX_OO', path: '', lvl: 0, sortNum: 5000, status: 1, hasChildren: true },
        { id: 3, name: '数据源', code: 'STORAGE', path: '/storage', lvl: 0, sortNum: 5001, status: 0 }
      ]
    }
  },
  methods: {
    handleOpenAdd() {

    },
    loadData(row, treeNode, resolve) {
      let allData = [
            { id: 11, parentId: 1, name: '用户管理', code: 'SYS_USER', path: '/system/user', lvl: 1, sortNum: 1, status: 1 },
            { id: 21, parentId: 2, name: '代码生成', code: 'BAYMAX_CODE', path: '/baymax/coder', lvl: 1, sortNum: 0, status: 1 }
      ]
      let data = allData.filter(item => item.parentId === row.id)
      setTimeout(() => {
        resolve(data)
      }, 1000)
    },
    handleAdd(index, row) {

    },
    handleEdit(index, row) {

    },
    handleDelete(index, row) {

    }
  }
}
</script>
<style lang="scss" scoped>
.el-select {
  width: 120px;
}
</style>