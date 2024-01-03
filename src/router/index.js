import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */
const TAG = '====sea====>router/index.js====> '
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '控制台', icon: 'dashboard' }
    }]
  },

  {
    path: '/operation',
    component: Layout,
    redirect: '/operation/list',
    name: 'Operation',
    meta: { title: '日志中心', icon: 'operationlog' },
    children: [
      {
        path: 'list',
        name: 'OperationList',
        component: () => import('@/views/operation/index'),
        meta: { title: '操作日志', icon: 'caozuo' }
      },
      {
        path: 'loginlog',
        name: 'LoginLogList',
        component: () => import('@/views/operation/loginlog'),
        meta: { title: '登录日志', icon: 'denglu' }
      }
    ]
  },

  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index', // 重定向地址
    hidden: true, // 不在侧边栏显示
    alwaysShow: true, // 一直显示根路由
    meta: { roles: ['admin', 'editor'] }, // 你可以在根路由设置权限，这样它下面所有的子路由都继承了这个权限
    children: [
      {
        path: 'index',
        name: 'permission',
        icon: 'permission_user',
        roles: ['admin', 'editor'], // 或者你可以给每一个子路由设置自己的权限
        noCache: true // 不会被 <keep-alive> 缓存
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    name: 'User',
    meta: {title: '用户管理', icon: 'user'},
    children: [
      {
        path: 'list',
        name: 'UserList',
        component: () => import('@/views/user/list'),
        meta: {title: '用户列表', icon: 'user'}
      },
      {
        path: 'introduction',
        name: 'UserIntroduction',
        component: () => import('@/views/user/introduction'),
        meta: {title: '个人介绍', icon: 'introduction'}
      },
    ]
  },
  {
    path: '/tag',
    component: Layout,
    redirect: '/tag/list',
    name: 'Tag',
    meta: {title: '标签管理', icon: 'tag_icon'},
    children: [
      {
        path: 'list',
        name: 'TagList',
        component: () => import('@/views/tag/list'),
        meta: {title: '标签列表', icon: 'tag_icon'}
      },
      {
        path: 'add',
        name: 'TagIntroduction',
        component: () => import('@/views/tag/introduction.vue'),
        meta: {title: '标签模块介绍', icon: 'add_icon'}
      }
    ]
  },
  {
    path: '/category',
    component: Layout,
    redirect: '/category/list',
    name: 'Category',
    meta: {title: '分类管理', icon: 'category_icon'},
    children: [
      {
        path: 'list',
        name: 'CategoryList',
        component: () => import('@/views/category/list'),
        meta: {title: '分类列表', icon: 'category_icon'}
      },
      {
        path: 'introduction',
        name: 'CategoryIntroduction',
        component: () => import('@/views/category/introduction.vue'),
        meta: {title: '分类模块介绍', icon: 'add_icon'}
      }
    ]
  },
  {
    path: '/comment',
    component: Layout,
    redirect: '/comment/list',
    name: 'Comment',
    meta: {title: '评论管理', icon: 'comment_icon'},
    children: [
      {
        path: 'list',
        name: 'CommentList',
        component: () => import('@/views/comment/list'),
        meta: {title: '评论列表', icon: 'comment_icon'}
      },
      {
        path: 'introduction',
        name: 'CommentIntroduction',
        component: () => import('@/views/comment/introduction.vue'),
        meta: {title: '评论模块介绍', icon: 'add_icon'}
      }
    ]
  },
  {
    path: '/article',
    component: Layout,
    redirect: '/article/list',
    name: 'Article',
    meta: {title: '文章管理', icon: 'articleList_icon'},
    children: [
      {
        path: 'list',
        name: 'ArticleList',
        component: () => import('@/views/article/list'),
        meta: {title: '文章列表', icon: 'articleList_icon'}
      },
      {
        path: 'add',
        name: 'ArticleAdd',
        component: () => import('@/views/article/add.vue'),
        meta: {title: '发布文章', icon: 'add_icon'}
      }
    ]
  },
  {
    path: '/notice',
    component: Layout,
    redirect: '/notice/list',
    name: 'Notice',
    meta: {title: '通知公告管理', icon: 'noticeList_icon'},
    children: [
      {
        path: 'list',
        name: 'NoticeList',
        component: () => import('@/views/notice/list'),
        meta: {title: '公告列表', icon: 'noticeList_icon'}
      },
      {
        path: 'add',
        name: 'NoticeAdd',
        component: () => import('@/views/notice/add.vue'),
        meta: {title: '发布公告', icon: 'add_icon'}
      }
    ]
  },

]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  console.log(TAG + ' resetRouter')
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
