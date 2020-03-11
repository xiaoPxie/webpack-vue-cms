# webpack-vue-cms
## 使用 webpack4 + vue2 + element-ui 搭建

> 另外用到了以下插件<br>
> ① vue-router： vue官方router<Br>
> ② vuex： 状态管理<Br>
> ③ mockjs： 生成随机数据，拦截ajax请求，可作为后端api接口模拟的插件<Br>
> ④ axios： ajax请求方案<Br>
> ⑤ lodash： js工具库

### 使用以下accout演示
``` bash
超管角色：
  账号：jishu
  密码：jishu
普通管理角色：
  账号：admin
  密码：admin
```

### 简单说明
<strong>cms-demo中有常见的cms三个功能，分别是权限，角色，系统用户管理等等，简单说明如下： </strong><br>
1、数据初始化使用json文件，初始化完成后存储到localstorage中；<br>
2、页面数据请求通过axios发送，被mockjs拦截处理并返回处理结果；<br>
3、系统采用了SPA模式，因此页面跳转都是通过vue-router配置；<br>
4、同个用户可拥有不同的角色，页面中的权限都是通过角色进行配置和限制，无权限的页面和按钮会被隐藏掉，强制访问则显示404页面<br>

### 截图
超管下的截图：<Br>
<img src="https://github.com/xiaoPxie/webpack-vue-cms/blob/master/%E7%A4%BA%E4%BE%8B/%E7%A4%BA%E4%BE%8B.png" alt="界面截图"/>
<hr />
普通管理角色下的截图：<Br>
<img src="https://github.com/xiaoPxie/webpack-vue-cms/blob/master/%E7%A4%BA%E4%BE%8B/%E7%A4%BA%E4%BE%8B2.png" alt="界面截图2" />
