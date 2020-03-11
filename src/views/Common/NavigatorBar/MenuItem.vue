<template>
  <el-menu-item :index="menuItem.path">
    <i :class="classObject" />
    <span slot="title">{{menuItem.privilegeName}}</span>
  </el-menu-item>
</template>

<script>
  import {classObject} from '@/mixins/icon-class-mixin'
  export default {
    name: 'MenuItem',
    mixins: [classObject],
    props: {
      menuItem: Object,
    }
  }
</script>
