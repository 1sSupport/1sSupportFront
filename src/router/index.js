import Vue from 'vue';
import Router from 'vue-router';
import Footer from '@/components/Toolbar';
import SearchInput from '@/components/SearchInput';
import SearchResult from '@/components/SearchResult';
import MainView from '@/views/MainView';
import ArticlePage from '@/components/ArticlePage';



Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MainView',
      component: MainView,
    },
    {
      path: 'article/:articleId:token',
      component: ArticlePage,
      name: 'ArticlePage',
      props: true
    }
  ]
});
