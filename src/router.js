import Vue from 'vue'
import Router from 'vue-router'
// import Home from './views/Home.vue'
import MainView from '@/views/MainView';
import ArticlePage from '@/components/ArticlePage';

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'MainView',
      component: MainView,
    },
    {
      path: 'article/:articleId:query',
      component: ArticlePage,
      name: 'ArticlePage',
      props: true
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})
