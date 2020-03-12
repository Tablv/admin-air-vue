<template>
  <div class="select-iocn">
    <!-- <el-col :span="3" v-for="(index,item) in icons" style="text-align:center">
        <svg-icon :icon-class="{{icons.class}}"></svg-icon>
    </el-col>-->

    <el-row :gutter="50">
      <el-col :span="3" v-for="icon in todos" :key="icon.index" style="text-align:center">
        <el-button @dblclick.native="currentClick(icon)">
          <svg-icon :icon-class="icon.class"></svg-icon>
          <span class="block">{{icon.class}}</span>
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      todos: [
        { class: "eye" },
        { class: "edit" },
        { class: "eye" },
        { class: "edit" }
      ]
    };
  },
  components: {},
  methods: {
    currentClick: function(icon) {
      console.log(icon.class);
      this.$emit("select", icon);
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-button {
    padding: 15px 25px;
  }
}
.select-iocn {
  .block {
    display: block;
    padding-top: 10px;
    font-size: 14px;
  }
}
.svg-icon {
  width: 2em;
  height: 2em;
}
</style>
