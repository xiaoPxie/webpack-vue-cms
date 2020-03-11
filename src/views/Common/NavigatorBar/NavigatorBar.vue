<template>
<!--  background-color="#545c64"-->
<!--  text-color="#fff"-->
<!--  active-text-color="#ffd04b"-->
  <el-menu
    router
    :default-active="$route.path"
    :collapse="isCollapse"
  >
    <!-- 首页route固定 -->
    <el-menu-item index="/home">
      <i class="el-icon-monitor" />
      <span slot="title">首页</span>
    </el-menu-item>
    <!-- 导航栏 -->
    <!-- 1、如果第一层导航没有children，则用ElMenuItem渲染，否则就用NavSubMenu渲染-->
    <!-- 2、NavSubMenu组件中使用了递归，递归结束条件则是children的length为0 -->
    <template v-for="(item, index) in navList">
      <nav-sub-menu v-if="item.children.length !== 0" :nav-sub-menu="item" :key="index" />
      <menu-item v-else :menu-item="item" :key="index" />
    </template>
  </el-menu>
</template>

<script>
  import api from '../../../axios/ajax'
  import ApiPath from '../../../apis/api-path'
  import NavSubMenu from './NavSubMenu'
  import MenuItem from './MenuItem'
  import {mapState} from "vuex";

  export default {
    name: 'navigator-bar',
    props: {
      isCollapse: Boolean,
    },
    components: {
      NavSubMenu,
      MenuItem,
    },
    data() {
      return {
        navList: [],     // 数据对象
      }
    },
    computed: {
      ...mapState({
        mergePrivilegeList: (state) => state.mergePrivilegeList
      })
    },
    methods: {
      // 根据在vuex里存储的用户权限列表，获取左侧导航菜单列表
      getDataInfo() {
        api.post(ApiPath.nav.getDataInfo, {
          mergePrivilegeList: this.mergePrivilegeList
        }).then( res => {
          console.log(res)
          if(res.code && res.code === '1000') {
            this.navList = res.data
          }else {
            this.$message.error(res.message);
          }
        })
      },
    },
    created() {
      this.getDataInfo()
    }
  }
</script>

<style scoped lang="scss">
  .el-menu { border-right-width: 0; }

</style>
