// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable */
import Vue from 'vue';
import App from './App';
import router from './router';
import Vuetify from 'vuetify';

Vue.use(Vuetify, {
  theme: {
    primary: '#003399',
	  secondary: '#424242',
	  accent: '#003399',
	  error: '#FF5252',
	  info: '#004EEB',
	  success: '#4CAF50',
	  warning: '#FFC107'
  }
});

Vue.config.productionTip = false;

/* eslint-disable */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>',
  methods: {

  }
});