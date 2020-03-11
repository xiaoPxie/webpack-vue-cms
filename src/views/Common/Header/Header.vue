<template>
  <el-header class="head-bar">
    <a class="nav-toggle-btn" @click="toggleNavType">
      <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" class="icon"></i>
    </a>
    <span class="title">{{$route.meta.alias}}</span>
    <el-dropdown trigger="click" class="operate-options" @command="handleCommand">
          <span class="el-dropdown-link">
            您好！ <b>{{headName}}</b>  <i class="el-icon-arrow-down el-icon--right" />
          </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-back" command="logOut">退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-header>
</template>

<script>
  import ApiPath from "@/apis/api-path"
  export default {
    name: 'HeaderBar',
    props: {
      isCollapse: Boolean,
    },
    computed: {
      headName: () => {
         if($cookies.get("token")) {
           return $cookies.get("token").split('-')[0]
         }
         return "-"
      }
    },
    methods: {
      toggleNavType() {
        this.$emit("toggle-collapse")
      },
      handleCommand(command) {
        // 退出系统
        if(command === 'logOut') {
          this.$confirm('将会退出系统, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$store.dispatch('logOutAction').then(() => {
              this.$message.success({
                message: "已安全退出系统，3秒后返回登录页！",
                duration: 2000,
              })
              setTimeout(_ => this.$router.replace(ApiPath.login.onLogin), 3000)
            }).catch(() => {})
          })
        }

      },
    }
  }
</script>

<style lang="scss" scoped>
  .head-bar {
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    width: 100%;
    /*font-size: 26px;*/
    color: #333;
    /*line-height: 60px;*/
    background-color: #fff;
    z-index: 10;
    /*vertical-align: middle;*/
    a { font-size: 0; }
    .icon {
      /*display: inline-block;*/
      vertical-align: middle;
      font-size: 26px;
    }
    .title {
      font-size: 18px;
    }
  }
  .operate-options {
    margin-left: auto;
    cursor: pointer;
  }
</style>
