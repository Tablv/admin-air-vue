<template>
  <div class="theme">
    <el-tooltip class="item" effect="dark" content="切换主题" placement="bottom">
      <el-button type="text" class="padding" @click="switchTheme">
        <svg-icon icon-class="icon-theme" />
      </el-button>
    </el-tooltip>
    <el-drawer title="选择主题" append-to-body :visible.sync="drawer" :direction="direction"></el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      direction: "rtl"
    };
  },
  methods: {
    switchTheme() {
      this.drawer = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.theme {
  position: relative;
  top: -7px;
  padding: 0px 20px;
  display: inline-block;
  .svg-icon {
    width: 3em;
    height: 3em;
  }
}
</style>
