<template>
  <div class="theme">
    <el-tooltip class="item" effect="dark" content="切换主题" :open-delay="200" placement="bottom">
      <el-button type="text" class="padding" @click="switchTheme">
        <svg-icon icon-class="icon-theme" />
      </el-button>
    </el-tooltip>
    <el-drawer title="选择主题（双击选中）" append-to-body :visible.sync="drawer" :direction="direction">
      <div class="content">
        <el-row :gutter="10">
          <el-col
            :span="12"
            v-for="themes in themeLists"
            :key="themes.index"
            style="text-align:center"
          >
            <!-- <theme-previewer></theme-previewer> -->
            <div class="theme-sel">
              <el-button class="previewer-btn" @dblclick.native="themesClick(themes)">
                <div class="previewer">
                  <div class="previewer-top" :style="{background:''+themes.topBg+''}"></div>
                  <div class="previewer-left" :style="{background:''+themes.leftBg+''}"></div>
                </div>
              </el-button>
            </div>
          </el-col>
        </el-row>
        <!-- <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>-->
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bg: "#ff0",
      drawer: false,
      direction: "rtl",
      themeLists: [
        { topBg: "#000", leftBg: "#000" },
        { topBg: "#f00", leftBg: "#f00" },
        { topBg: "blue", leftBg: "blue" }
      ]
    };
  },
  methods: {
    switchTheme() {
      this.drawer = true;
    },
    themesClick: function(themes) {
      // console.log(themes);
      // this.$emit("temClick", themes);
      this.drawer = false;
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-drawer__header {
    span {
      color: #000;
      font-size: 18px;
    }
  }
  .dialog-footer {
    padding: 20px;
    position: absolute;
    right: 0px;
    bottom: 0px;
  }
  .theme-sel {
    padding: 6px;
  }
  .previewer-btn {
    width: 100%;
    padding: 0px 0px;
  }
  .previewer {
    padding: 0px 0px;
    overflow: hidden;
    width: 100%;
    background: #fff;
    height: 100px;
    .previewer-top {
      display: block;
      height: 13px;
    }
    .previewer-left {
      display: block;
      width: 20%;
      float: left;
      height: 100%;
    }
  }
}
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
