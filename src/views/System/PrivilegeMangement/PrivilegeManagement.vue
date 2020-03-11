<template>
  <section class="data-table">
    <div class="tool-bar">
      <el-button v-if="permission(ApiPath.sysPrivilege.addDataInfo)"
        @click="handleAdd" size="small" type="primary" icon="el-icon-plus">添加</el-button>
      <el-button v-if="permission(ApiPath.sysPrivilege.addDataInfo)"
        @click="handleDelete" size="small" type="danger" icon="el-icon-delete">删除</el-button>
      <el-input class="search-box" v-model="search" size="mini" placeholder="权限名搜索"/>
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
        label="权限id"
        width="100">
      </el-table-column>
      <el-table-column
        prop="name"
        label="权限名"
        width="150">
      </el-table-column>
      <el-table-column
        prop="path"
        label="权限url"
        show-overflow-tooltip
        min-width="150">
      </el-table-column>
      <el-table-column
        prop="parentId"
        label="父权限id"
        width="100">
      </el-table-column>
      <el-table-column
        prop="parentName"
        label="父权限名"
        width="150">
      </el-table-column>
      <el-table-column
        fixed="right"
        width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            v-if="permission(ApiPath.sysPrivilege.addDataInfo)"
            @click="handleDelete(scope.$index, scope.row, 'Single')">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <page @page-change="pageChange" :total="total" />
    <!-- drawer -->
    <el-drawer
      :title="drawerTitle"
      :visible.sync="drawer"
      custom-class="demo-drawer"
      :before-close="handleClose"
      :append-to-body="true"
      :wrapperClosable="false"
      ref="drawer"
    >
      <el-form label-width="100px" :model="form" ref="form">
        <el-form-item label="权限名：">
          <el-input v-model="form.name" autocomplete="off" placeholder="请输入权限名" />
        </el-form-item>
        <el-form-item label="权限url：">
          <el-input v-model="form.path" autocomplete="off" placeholder="请输入权限url" />
        </el-form-item>
        <el-form-item label="权限类型：">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限：">
          <el-tree
            :data="treeData"
            :show-checkbox="showCheckBox"
            node-key="privilegeId"
            :default-checked-keys="defaultCheckedKeys"
            :default-expanded-keys="defaultExpandedKeys"
            :props="privilegeProps"
            ref="privilegeTree"
            check-strictly
            @check-change="handleNodeClick"
          >
          <span class="custom-tree-node" slot-scope="{ node, treeData }">
            <span>{{ node.label }}</span>
          </span>
          </el-tree>
        </el-form-item>
      </el-form>
      <div class="drawer__footer">
        <el-button @click="cancelDrawer">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
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
    name: 'PrivilegeManagement',
    mixins: [tableMixin],
    data() {
      return {
        search: '',
        options: [{id: '1', label: '菜单'}, {id: '2', label: '按钮'}],
        // drawer
        drawer: false,
        drawerTitle: '',
        form: {},
        // tree
        treeData: [],
        showCheckBox: false,
        privilegeProps: { // 当数据与树形控件默认不同时，通过props设置与默认属性对应的对象的值
          children: 'children',
          label: 'privilegeName'
        },
        checkedId: '',
        defaultExpandedKeys: ['0'],
        defaultCheckedKeys: [],
      }
    },
    methods: {
      handleNodeClick(data, checked, node) { // 实现tree控件单选，控件attr还得加上check-strictly
        if(checked) {
          this.checkedId = data.privilegeId;
          this.$refs.privilegeTree.setCheckedKeys([data.privilegeId]);
        } else {
          if (this.checkedId === data.privilegeId) {
            this.$refs.privilegeTree.setCheckedKeys([data.privilegeId]);
          }
        }
      },
      handleSubmit() {
        this.form.privilegeList = this.$refs.privilegeTree.getCheckedNodes(false, true)
        if(this.form.privilegeList.length <= 0) {
          this.$message.warning("请检查填写的信息是否完整！")
          return ;
        }
        // this.$refs['form'].resetFields()
        // console.log(this.form)
        if(this.drawerTitle === '权限添加') {
          this.addDataInfo()
        }
        this.drawer = false
      },
      handleAdd() {
        this.drawer = true
        this.drawerTitle = '权限添加'
        this.showCheckBox = true
        // 清空信息
        this.form = {}
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
      getDataInfo() {
        api.post(ApiPath.sysPrivilege.getDataInfo, {
          page: this.currentPage,
          row: this.pageSize
        }).then( res => {
          console.log(res)
          if(res.code && res.code === '1000') {
            this.total = res.total
            this.tableData = res.tableData
            this.treeData = res.treeData
            // this.$message({ message: res.message, type: 'success'});
          }else {
            this.$message.error(res.message);
          }
        })
      },
      deleteDataInfo(Ids) {
        api.post(ApiPath.sysPrivilege.deleteDataInfo, {
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
        api.post(ApiPath.sysPrivilege.addDataInfo, {
          page: this.currentPage,
          row: this.pageSize,
          data: this.form
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
      }
    },
    created() {
      this.getDataInfo()
    }
  }
</script>
