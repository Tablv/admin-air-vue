<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <div :class="{'fixed-footer':fixedHeader}">
        <div>
          <a href="javascript:void(0);">帮助</a>
          <a href="javascript:void(0);">隐私</a>
          <a href="javascript:void(0);">条款</a>
        </div>
        <div>
          <span>Copyright 2019 南京国睿信维软件有限公司出品</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    needTagsView() {
      return this.$store.state.settings.tagsView
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar {
    .fixed-header, .fixed-footer {
      width: calc(100% - 54px)
    }
  }

  .mobile {
    .fixed-header, .fixed-footer {
      width: 100%;
    }
  }

  .fixed-footer {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 9;
    height: 69px;
    width: calc(100% - #{$sideBarWidth});
    background-color: #fff;
    border-top: 1px solid #d2d6de;
    padding: 15px;
    font-size: 14px;
    text-align: center;
    color: #444;
    line-height: 19px;
    a + a {
      margin-left: 10px;
    }
    a {
      color: #1890ff;
    }
  }
</style>
