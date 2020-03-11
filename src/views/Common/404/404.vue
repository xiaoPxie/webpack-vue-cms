<template>
  <section class="not-found">
    <div>
      <strong>404！！！出现此页面的原因可能如下：</strong>
      <ul>
        <li>1、此页面不存在！</li>
        <li>2、没有权限操作此页面！！</li>
        <li>3、新配置的权限没有分配角色！！！</li>
        <li>4、配置好权限与角色了，但是该页面还没写code，没在router配置！！！！</li>
      </ul>
      <el-link type="primary" @click.prevent="fackBack">返回主页</el-link>
    </div>
  </section>
</template>

<script>
  import ApiPath from "@/apis/api-path"

  export default {
    name: 'NotFound',
    methods: {
      fackBack() {
        this.$router.replace(ApiPath.home.onHome)
      }
    }
  }
</script>

<style scoped lang="scss">
  .not-found {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    height: 100%;
  }
</style>
