<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import router from "./router";

  export default {
    name: 'app',
    router: router
  }
</script>

<style>
  body { overflow: hidden; }
  #app { height: 100%; }
</style>
