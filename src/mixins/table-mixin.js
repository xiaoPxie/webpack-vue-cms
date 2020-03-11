/**
 * 混入公有的字段与方法
 */
import ApiPath from "@/apis/api-path"
export const tableMixin = {
  data() {
    return {
      // api-path
      ApiPath: ApiPath,
      // page
      total: 0,               // 分页组件-总记录数
      currentPage: 1,
      pageSize: 10,
      // table
      tableData: [],          // 表格源数据
      multipleSelection: [],  // 存放被选中的表格记录
    }
  },
  components: {
    Page: () => import('@/views/Common/Page/Page')
  },
  computed: {
    loading: {
      get() { return this.$store.state.loading },
      set(val) { this.$store.dispatch("setLoadingAction", val) }
    }
  },
  methods: {
    /**
     * 按钮权限--显示/隐藏按钮
     * @param apiPath
     * @returns {T}
     */
    permission(apiPath) {
      return this.$store.state.mergePrivilegeList.find(item => {
        return item.path.indexOf(apiPath) !== -1
      })
    },

    /**
     * 点击表格中的每条记录时
     * @param row
     * @param column
     * @param event
     */
    rowClick(row, column, event) {
      this.$refs.dataTable.toggleRowSelection(row);
    },

    /**
     * 存放表格中被勾选的记录
     * @param val
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    /**
     * 分页组件-页码跳转/每页显示条数更改
     * @param currentPage
     * @param pageSize
     */
    pageChange(currentPage, pageSize) {
      this.currentPage = currentPage
      this.pageSize = pageSize
      this.getDataInfo()
    },

    /**
     * 取消drawer
     * @param drawer
     */
    cancelDrawer() {
      this.drawer = false
    },

    /**
     * drawer关闭前调用
     * @param done
     */
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
  }
}
