<template>
  <el-submenu :index="navSubMenu.privilegeId" @click.native="routerPush(navSubMenu.path)">
    <template slot="title">
      <i :class="classObject" />
      <span slot="title">{{navSubMenu.privilegeName}}</span>
    </template>
    <template v-if="navSubMenu.children.length !== 0">
      <template  v-for="(menuItem, index) in navSubMenu.children">
        <menu-item v-if="menuItem.children.length === 0" :menu-item="menuItem" :key="index" />
        <nav-sub-menu v-else :nav-sub-menu="menuItem" :key="index" />
      </template>
    </template>
  </el-submenu>
</template>

<script>
  import MenuItem from './MenuItem'
  import {classObject} from '@/mixins/icon-class-mixin'

  export default {
    name: 'NavSubMenu',
    mixins: [classObject],
    props: {
      navSubMenu: Object,
    },
    components: {
      MenuItem
    },
    methods: {
      routerPush(path) {
        // 当path不为""，则为路由
        if(path && path !== "")
          this.$router.push(path)
      }
    }
  }
</script>
