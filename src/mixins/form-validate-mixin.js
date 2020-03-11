export const formValidate = {
  data() {
    return {
      rules: {
        userName: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur'}
        ],
      },
    }
  }
}
