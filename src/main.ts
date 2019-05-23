import Vue from 'vue';
import Vuetify from 'vuetify';
import App from './App.vue';
import store from './store';
import './registerServiceWorker';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);
Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
