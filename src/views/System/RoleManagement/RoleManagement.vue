<template>
  <section class="data-table">
    <div class="tool-bar">
      <el-button v-if="permission(ApiPath.sysRole.addDataInfo)"
                 @click="handleAdd" size="small" type="primary" icon="el-icon-plus">添加</el-button>
      <el-button v-if="permission(ApiPath.sysRole.deleteDataInfo)"
        @click="handleDelete" size="small" type="danger" icon="el-icon-delete">删除</el-button>
      <el-input class="search-box" v-model="search" size="mini" placeholder="角色名搜索" />
    </div>
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
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
        label="角色id"
        width="100">
      </el-table-column>
      <el-table-column
        prop="name"
        label="角色名"
        width="150">
      </el-table-column>
      <el-table-column
        label="所拥有的权限"
        min-width="200">
        <template slot-scope="scope">
          <el-link
            type="primary"
            @click="handlePrivilege(scope.$index, scope.row)">
            查看权限<i class="el-icon-view el-icon--right" />
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        width="180"
        label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-if="permission(ApiPath.sysRole.updateDataInfo)"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            v-if="permission(ApiPath.sysRole.deleteDataInfo)"
            @click="handleDelete(scope.$index, scope.row, 'Single')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <page @page-change="pageChange" :total="total" />
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
        <el-form-item label="角色名：">
          <el-input v-if="this.drawerTitle !== ''" v-model="form.name" autocomplete="off" placeholder="请输入角色名">
          </el-input>
          <template v-else><b>{{form.name}}</b></template>
        </el-form-item>
        <el-form-item label="权限：">
          <el-tree
            :data="treeData"
            :show-checkbox="showCheckBox"
            :filter-node-method="handleFilterTree"
            node-key="privilegeId"
            default-expand-all
            check-strictly
            :props="privilegeProps"
            ref="privilegeTree"
          >
          <span class="custom-tree-node" slot-scope="{ node, treeData }">
            <span>{{ node.label }}</span>
          </span>
          </el-tree>
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
  import ApiPath from "@/apis/api-path"
  import { tableMixin } from '@/mixins/table-mixin'

  export default {
    name: 'RoleManagement',
    mixins: [tableMixin],
    data() {
      return {
        // 表格
        search: '',
        // drawer
        drawer: false,
        drawerTitle: '',
        withHeader: true, // 是否显示drawer标题
        form: {},
        // tree
        treeData: [], // JSON.parse(JSON.stringify(data)),
        addTreeData: [],
        showCheckBox: false,
        privilegeProps: { // 当数据与树形控件默认不同时，通过props设置与默认属性对应的对象的值
          children: 'children',
          label: 'privilegeName'
        },
      }
    },
    methods: {
      handleSubmit() {
        this.form.privilegeList = this.$refs.privilegeTree.getCheckedNodes(false, true)
        if(this.form.privilegeList.length <= 0) {
          this.$message.warning("请检查填写的信息是否完整！")
          return ;
        }
        // this.$refs['form'].resetFields()

        if(this.drawerTitle === '角色添加') {
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
        this.drawerTitle = '角色添加'
        this.showCheckBox = true
        this.treeData = this.addTreeData.slice()
        if(this.$refs.privilegeTree) {
          this.$refs.privilegeTree.setCheckedKeys([])
        } else {
          let timer = setInterval(() => {
            if(this.$refs.privilegeTree) {
              this.$refs.privilegeTree.setCheckedKeys([])
              clearInterval(timer)
            }
          },200)
        }
        //
        this.form = {}
      },
      handleEdit(index, row) {
        this.drawer = true
        this.withHeader = true
        this.drawerTitle = '角色编辑'
        this.showCheckBox = true
        this.treeData = this.addTreeData.slice()

        this.form.id = row.id
        this.form.name = row.name

        let arry = []
        for(let item of row.privilegeList) {
          arry.push(item.privilegeId)
        }

        if(this.$refs.privilegeTree) {
          this.$refs.privilegeTree.setCheckedKeys(arry)
        } else {
          let timer = setInterval(() => {
            if(this.$refs.privilegeTree) {
              this.$refs.privilegeTree.setCheckedKeys(arry)
              clearInterval(timer)
            }
          },200)
        }
      },
      handlePrivilege(index, row) {
        this.drawer = true
        this.withHeader = false
        this.drawerTitle = ''
        this.showCheckBox = false
        this.form.name = row.name
        if(this.$refs.privilegeTree) {
          this.$refs.privilegeTree.filter(row.privilegeList);
        } else {
          let timer = setInterval(() => {
            if(this.$refs.privilegeTree) {
              this.$refs.privilegeTree.filter(row.privilegeList);
              clearInterval(timer)
            }
          },200)
        }
      },
      handleFilterTree(value, data, node) { // 调用tree的filter方法时，自动条用该方法
        let flag = false
        for(let item of value)
          if(item.privilegeId === data.privilegeId) {
            flag = true
            break
          }
        return flag
      },
      getDataInfo() {
        api.post(ApiPath.sysRole.getDataInfo, {
          page: this.currentPage,
          row: this.pageSize
        }).then( res => {
          console.log(res)
          if(res.code && res.code === '1000') {
            this.total = res.total
            this.tableData = res.tableData
            this.treeData = res.treeData
            this.addTreeData = res.treeData
          }else {
            this.$message.error(res.message);
          }
        })
      },
      deleteDataInfo(Ids) {
        api.post(ApiPath.sysRole.deleteDataInfo, {
          page: this.currentPage,
          row: this.pageSize,
          Ids: Ids
        }).then( res => {
          console.log(res)
          if(res.code && res.code === '1000') {
            this.total = res.total
            this.tableData = res.tableData
            this.treeData = res.treeData
            this.$message({ message: res.message, type: 'success'});
          }else {
            this.$message.error(res.message);
          }
        })
      },
      addDataInfo() {
        api.post(ApiPath.sysRole.addDataInfo, {
          page: this.currentPage,
          row: this.pageSize,
          data: this.form
        }).then( res => {
          console.log(res)
          if(res.code && res.code === '1000') {
            this.total = res.total
            this.tableData = res.tableData
            this.treeData = res.treeData
            this.drawer = false
            this.$message({ message: res.message, type: 'success'});
          }else {
            this.$message.error(res.message);
          }
        })
      },
      updateDataInfo() {
        api.post(ApiPath.sysRole.updateDataInfo, {
          page: this.currentPage,
          row: this.pageSize,
          data: this.form
        }).then( res => {
          console.log(res)
          if(res.code && res.code === '1000') {
            this.total = res.total
            this.tableData = res.tableData
            this.treeData = res.treeData
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
    }
  }
</script>
