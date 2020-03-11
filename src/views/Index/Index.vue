<template>
  <el-container class="content-l">
    <el-aside :class="isCollapse ? 'is-collapse' : ''">
      <el-scrollbar>
<!--        左侧导航栏-->
        <navigator-bar :is-collapse="isCollapse" />
      </el-scrollbar>
    </el-aside>

    <el-container class="content-r" :class="isCollapse ? 'nav-indent' : ''">
<!--      右侧header-->
      <header-bar :is-collapse="isCollapse" @toggle-collapse="toggleCollapse" />

<!--      标签页-->
      <tag-bar />

      <el-main>
        <!-- 在vuex里存储每个打开过的路由页，关闭路由时同时清除缓存。防止内存过大，造成页面崩溃!
             由于使用 实例.$destroy() 这种方式去销毁组件，可能会导致被销毁的路由组件重新进入时不会再被缓存！
             因此使用include解决，include里存的是每个vue组件的name属性，数组或正则类型！而不是路由配置中的name -->
        <keep-alive :include="$store.state.routeNameList">
          <router-view />
        </keep-alive>
      </el-main>

    </el-container>
  </el-container>
</template>

<script>

  export default {
    name: 'index',
    components: {
      NavigatorBar: () => import("../Common/NavigatorBar/NavigatorBar"),
      HeaderBar: () => import("../Common/Header/Header"),
      TagBar: () => import("../Common/TagBar/TagBar"),
    },
    data() {
      return {
        isCollapse: false,
      }
    },
    methods: {
      toggleCollapse() {
        this.isCollapse = !this.isCollapse
      },
    },
  };
</script>

<style scoped lang="scss">
  .content-r {
    position: relative;
    width: 100%;
    margin-left: 210px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    position: absolute;
    top: 0;
    left: 0;
    width: 210px !important;
    height: 100%;
    color: #333;
    /*background: rgb(84, 92, 100);*/
    box-shadow: 1px 0 3px rgba(0, 0, 0, 0.2);
    z-index: 50;
    transition: all 0.5s;
  }
  .is-collapse { width: 64px !important; }
  .nav-indent { margin-left: 64px; }
  .el-main {
    position: relative;
    top: 0;
    height: 100%;
    padding: 100px 0 0;
    overflow: hidden;
    box-sizing: border-box;
  }
</style>
