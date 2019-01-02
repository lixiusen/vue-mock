import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path:'/login',
      component:() => import('@/views/Login'),
      name:'',
      hidden: true //此菜单不显示在左侧列表
    },
    {
      path:'/404',
      component:() => import('@/views/404'),
      hidden: true
    },
    {
      path: '/',
      name: '用户',
      component: Home,
      iconCls:'fa fa-shopping-bag',
      children:[
        { path:'/userList', component:() => import('@/views/nav1/Table'), name:'用户列表'},
        { path:'/addUser', component: () => import('@/views/nav1/Form'), name:'添加用户'},
      ]
    },
    {
      path:'/',
      name:'订单',
      component:Home,
      iconCls:'fa fa-shopping-basket',
      children:[
        {path:'/orderList',component:() => import('/'),name:'订单列表'},
        {path:'/orderSetting',component:() => import('/'),name:'订单设置'},
        {path:'/returnApply',component:() => import('/'),name:'退货申请处理'},
        {path:'/returnReason',component:() => import('/'),name:'退货原因设置'}
      ]
    },
    {
      path:'/',
      name:'营销',
      component:Home,
      iconCls:'fa fa-tags',
      children:[
        {path:'/flash',component:() => import('/'),name:'秒杀活动列表'},
        {path:'/coupon',component:() => import('/'),name:'优惠券列表'},
        {path:'/advertise',component:() => import('/'),name:'广告列表'}
      ]
    },
    // {
    //   path:'/',
    //   name:'导航二',
    //   component:Home,
    //   iconCls:'fa fa-bell',
    //   leaf:true,//没有二级菜单
    //   children:[
    //     {path:'/page6',component:() => import('@/components/HelloWorld'), name:'页面6'}
    //   ]
    // },
    {
      path:'*',
      hidden:true,
      redirect:{ path:'/404'}
    }

  ]
})
