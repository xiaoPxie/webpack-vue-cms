export const classObject = {
  computed: {
    classObject: function () {
      return {
        'el-icon-s-tools': this.navSubMenu ? this.navSubMenu.privilegeId === '1' : this.menuItem.privilegeId === '1',
        'el-icon-files': this.navSubMenu ? this.navSubMenu.privilegeId === '2' : this.menuItem.privilegeId === '2',
        'el-icon-s-custom': this.navSubMenu ? this.navSubMenu.privilegeId === '3' : this.menuItem.privilegeId === '3',
        'el-icon-user': this.navSubMenu ? this.navSubMenu.privilegeId === '4' : this.menuItem.privilegeId === '4',
      }
    }
  }
}
