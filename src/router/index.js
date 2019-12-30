import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      component: resolve => require(['../components/Login.vue'], resolve),
      meta: { requiresAuth: true }
    },
    {
      path: '/',
      component: resolve => require(['../components/Main.vue'], resolve),
      children: [
        {
          path: '/home',
          component: resolve => require(['../components/pages/Home.vue'], resolve),
          meta: { title: '首页' }
        },
        {
          path: '/usermanagement',
          component: resolve => require(['../components/pages/UserManagement.vue'], resolve),
          meta: { title: '用户信息' }
        },
        {
          path: '/modifypassword',
          component: resolve => require(['../components/pages/ModifyPassword.vue'], resolve),
          meta: { title: '修改密码' }
        },
        {
          path: '/introduction',
          component: resolve => require(['../components/pages/Introduction.vue'], resolve),
          meta: { title: '系统简介' }
        },
      ]
    },
  ]
})
