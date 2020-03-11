<template>
  <section class="tag-bar">
    <el-tag
      v-for="(tag, index) in routeTagList"
      :key="index"
      :closable="tag.meta.closeable"
      :effect="$route.name === tag.name ? 'dark' : 'plain'"
      type="info"
      :disable-transitions="false"
      @close="handleClose(tag)"
    >
      <router-link tag="span" class="tag-item" :to="tag.path">
        {{tag.meta.alias}}
      </router-link>
    </el-tag>
  </section>
</template>

<script>
  import {mapActions, mapState} from "vuex";

  export default {
    name: 'TagBar',
    computed: {
      ...mapState({
        routeTagList: (state) => state.routeObjList
      })
    },
    methods: {
      handleClose(tag) {
        this.routeTagList.forEach((item, index) => {
          if(item.name === tag.name) {
            this.$store.dispatch('popRouteObjAction', tag)  // 在Actions中操作，删除标签页
            this.$router.push(this.routeTagList[0].path)  //删除标签页后，自动跳转到索引为0的路由页
          }
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  .tag-bar {
    display: flex;
    align-items: flex-end;
    position: absolute;
    top: 60px;
    width: 100%;
    height: 40px;
    z-index: 10;
    box-shadow: 0 1px 7px rgba(0, 0, 0, 0.1);
    & > .el-tag {
      margin-left: 5px;
      border-radius: 0;
    }
  }
  .tag-item { cursor: pointer; }
</style>
