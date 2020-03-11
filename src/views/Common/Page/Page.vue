<template>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="pageSizes"
    :page-size="pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
  </el-pagination>
</template>

<script>
  export default {
    name: 'Page',
    props: {
      total: Number
    },
    data() {
      return {
        pageSizes: [10, 20, 30, 40],
        pageSize: 10, // 初始化每页显示多少条记录
        currentPage: 1, // 初始化当前页码
      }
    },
    methods: {
      handleSizeChange(val) {
        this.currentPage = 1 // 重置当前页码
        this.pageSize = val
        this.$emit("page-change", this.currentPage, this.pageSize)
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.$emit("page-change", this.currentPage, this.pageSize)
      },
      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
    }
  }
</script>

<style scoped lang="scss">
  .el-pagination {
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
    background: #fff;
    z-index: 10;
  }
</style>
