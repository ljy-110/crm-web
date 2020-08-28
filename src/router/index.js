import Vue from 'vue'
import Router from 'vue-router'
// import infolist from '@/components/infolist'
// import index from '@/components/index'
// import login from '@/components/login'
// import tasklist from '@/components/tasklist'
import list from '@/components/list'
var url = window.location.href.split("=")[1]
Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/infolist/:taskid',
    //   name: 'infolist',
    //   component: infolist
    // },
    // {
    //   path: '/index',
    //   name: 'index',
    //   component: index
    // },
    // {
    //   path: '/',
    //   name: 'login',
    //   component: login
    // },
    // {
    //   path: '/tasklist',
    //   name: 'tasklist',
    //   component: tasklist
    // },
    {
      path: '/',
      name: 'list',
      redirect:{
        path: '/list',
        query: { accountId: '=' }
      }
    },
    {
      path: '/list',
      name: 'list',
      component: list
    },
  ]
})
