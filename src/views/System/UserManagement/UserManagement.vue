<template>
  <section class="data-table">
    <div class="tool-bar">
      <el-button v-if="permission(ApiPath.sysUser.addDataInfo)"
                 @click="handleAdd" size="small" type="primary" icon="el-icon-plus">添加</el-button>
      <el-button v-if="permission(ApiPath.sysUser.deleteDataInfo)"
                 @click="handleDelete" size="small" type="danger" icon="el-icon-delete">删除</el-button>
      <el-input class="search-box" v-model="search" size="mini" placeholder="用户名搜索" />
    </div>
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData.filter(data => !search || data.userName.toLowerCase().includes(search.toLowerCase()))"
      @selection-change="handleSelectionChange"
      @row-click="rowClick"
      style="width: 100%"
      height="250"
      ref="dataTable"
    >
      <el-table-column
        fixed
        type="selection"
        width="35">
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        width="100">
      </el-table-column>
      <el-table-column
        prop="id"
        label="用户id"
        width="100">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="用户名"
        width="150">
      </el-table-column>
      <el-table-column
        prop="nickName"
        label="姓名"
        width="150">
      </el-table-column>
      <el-table-column
        label="所属角色"
        min-width="100"
        :formatter="roleFormatter">
      </el-table-column>
      <el-table-column
        fixed="right"
        min-width="160"
        label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-if="permission(ApiPath.sysUser.updateDataInfo)"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            v-if="permission(ApiPath.sysUser.deleteDataInfo)"
            @click="handleDelete(scope.$index, scope.row, 'Single')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <page @page-change="pageChange" :total="total"></page>
    <!-- drawer -->
    <el-drawer
      :title="drawerTitle"
      :visible.sync="drawer"
      custom-class="demo-drawer"
      :before-close="handleClose"
      :append-to-body="true"
      :wrapperClosable="false"
      :with-header="withHeader"
      ref="drawer"
    >
      <el-form label-width="80px" :model="form" ref="form">
        <el-form-item label="用户名：">
          <el-input v-if="this.drawerTitle !== ''" v-model="form.userName" autocomplete="off" placeholder="请输入用户名" />
          <template v-else><b>{{form.userName}}</b></template>
        </el-form-item>
        <el-form-item label="密码：">
          <el-input v-if="this.drawerTitle !== ''" type="password" v-model="form.password" autocomplete="off" placeholder="请输入密码" />
          <template v-else><b>{{form.userName}}</b></template>
        </el-form-item>
        <el-form-item label="姓名：">
          <el-input v-if="this.drawerTitle !== ''" v-model="form.nickName" autocomplete="off" placeholder="请输入姓名" />
          <template v-else><b>{{form.nickName}}</b></template>
        </el-form-item>
        <el-form-item label="角色：">
          <el-checkbox-group v-model="form.roles" ref="roleCheckBox">
            <el-checkbox v-for="(item,index) in roles" :label="item.id" name="roles" :key="index">
              {{item.name}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div class="drawer__footer">
        <el-button @click="cancelDrawer">关 闭</el-button>
        <el-button v-if="this.drawerTitle !== ''" type="primary" @click="handleSubmit" :loading="loading">
          {{ loading ? '提交中 ...' : '确 定' }}
        </el-button>
      </div>
    </el-drawer>
  </section>

</template>

<script>
  import api from "@/axios/ajax"
  import { tableMixin } from '@/mixins/table-mixin'

  export default {
    name: 'UserManagement',
    mixins: [tableMixin],
    data() {
      return {
        // 表格
        search: '',
        // drawer
        drawer: false,
        drawerTitle: '',
        withHeader: true, // 是否显示drawer标题
        form: {
          roles: []
        },
        roles: []
      }
    },
    methods: {
      handleSubmit() {
        if(this.drawerTitle === '用户添加') {
          this.addDataInfo()
        } else {
          this.updateDataInfo()
        }
      },
      handleDelete(index, row, operation) {
        let Ids = []
        if(operation && operation === 'Single') {
          Ids.push(row.id)
        } else {
          if(this.multipleSelection.length <= 0) {
            this.$message({ message: "请选择至少一条记录进行操作", type: 'error'})
            return false
          }
          this.multipleSelection.forEach((item) => {
            Ids.push(item.id)
          })
        }
        this.$confirm('确认删除？')
          .then( _ => this.deleteDataInfo(Ids) )
      },
      handleAdd() {
        this.drawer = true
        this.withHeader = true
        this.drawerTitle = '用户添加'
        //
        this.form = {
          roles: []
        }
      },
      handleEdit(index, row) {
        this.drawer = true
        this.withHeader = true
        this.drawerTitle = '用户编辑'

        let arr = []
        for(let x of row.roles) {
          arr.push(x.id)
        }
        this.form = Object.assign({}, {
          id: row.id,
          userName: row.userName,
          password: row.password,
          nickName: row.nickName,
          roles: arr
        })
      },
      roleFormatter(row, column, cellValue, index) {
        let arr = []
        for(let x of row.roles) {
          arr.push(x.name)
        }
        return arr.join(' | ')
      },
      getDataInfo() {
        api.post(this.ApiPath.sysUser.getDataInfo, {
          page: this.currentPage,
          row: this.pageSize
        }).then( res => {
          console.log(res)
          if(res.code && res.code === '1000') {
            this.total = res.total
            this.tableData = res.tableData
          }else {
            this.$message.error(res.message);
          }
        })
      },
      getRoleDataInfo() {
        api.post(this.ApiPath.sysRole.getDataInfo, {
        }).then( res => {
          console.log(res)
          if(res.code && res.code === '1000')
            this.roles = res.tableData
          else
            this.$message.error(res.message);
        })
      },
      deleteDataInfo(Ids) {
        api.post(this.ApiPath.sysUser.deleteDataInfo, {
          page: this.currentPage,
          row: this.pageSize,
          Ids: Ids
        }).then( res => {
          console.log(res)
          if(res.code && res.code === '1000') {
            this.total = res.total
            this.tableData = res.tableData
            this.$message({ message: res.message, type: 'success'});
          }else {
            this.$message.error(res.message);
          }
        })
      },
      addDataInfo() {
        api.post(this.ApiPath.sysUser.addDataInfo, {
          page: this.currentPage,
          row: this.pageSize,
          data: this.form
        }).then( res => {
          console.log(res)
          if(res.code && res.code === '1000') {
            this.total = res.total
            this.tableData = res.tableData
            this.drawer = false
            this.$message({ message: res.message, type: 'success'});
          }else {
            this.$message.error(res.message);
          }
        })
      },
      updateDataInfo() {
        api.post(this.ApiPath.sysUser.updateDataInfo, {
          page: this.currentPage,
          row: this.pageSize,
          data: this.form
        }).then( res => {
          console.log(res)
          if(res.code && res.code === '1000') {
            this.total = res.total
            this.tableData = res.tableData
            this.drawer = false
            this.$message({ message: res.message, type: 'success'});
          }else {
            this.$message.error(res.message);
          }
        })
      },
    },
    created() {
      this.getDataInfo()
      this.getRoleDataInfo()
    }
  }
</script>
