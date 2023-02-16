import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'

import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import VueSimpleAlert from "vue-simple-alert";
import Vuex from 'vuex';
import { store } from './store.js';
import VModal from 'vue-js-modal'

import Manager from './components/Manager.vue'
import UserInfo from './components/UserInfo.vue'
import HomeSVG from './components/HomeSVG.vue'
import LoginPage from './components/LoginPage.vue'
import RegisterPage from './components/RegisterPage.vue'
import CandleChartPredict from './components/CandleChartPredict.vue'
import CandleChartRealTime from './components/CandleChartRealTime.vue'
import LoopPics from './components/LoopPics.vue'

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/css/fontawesome.css";
library.add(fas);


Vue.component('vue-fontawesome', FontAwesomeIcon);
Vue.use(VueSimpleAlert);
Vue.use(VModal)
Vue.use(Buefy, {
	defaultIconComponent: 'vue-fontawesome',
    defaultIconPack: 'fas',
    // ...
})
Vue.use(Vuex);
Vue.use(VueRouter)

const router = new VueRouter({
	routes: [
		{
			path: '/',
			component: HomeSVG
		},
		{
			path: '/login',
			component: LoginPage
		},
		{
			path: '/register',
			component: RegisterPage
		},
		{
			path: '/chartrealtime',
			component: CandleChartRealTime
		},
		{
			path: '/chartpredict',
			component: CandleChartPredict
		},
		{
			path: '/looppics',
			component: LoopPics
		},
		{
			path: '/userinfo',
			component: UserInfo
		},
		{
			path: '/manager',
			component: Manager
		}
	],
	mode: 'history'
})

Vue.config.productionTip = false

new Vue({
	beforeMount() {
		window.addEventListener("load", this.onLoad);
		window.addEventListener("beforeunload", this.onUnload);
	},
	beforeDestroy() {
		window.removeEventListener("load", this.onLoad);
		window.removeEventListener("beforeunload", this.onUnload);
	},
	methods: {
		onUnload(event) {
			//window.localStorage.clear()
			window.localStorage.setItem("sessionTime", String(this.getTimeMilisecond()));
		},
		onLoad() {
			let mount_time = this.getTimeMilisecond()
			if (window.localStorage.getItem("sessionTime")==null || mount_time-window.localStorage.getItem("sessionTime")>=3000) {
				window.localStorage.clear()
			}
		},
		getTimeMilisecond() {
			let time_now = new Date();
			return time_now.getTime()
		}
	},
	router, 
	store,
	render: h => h(App),
}).$mount('#app')
