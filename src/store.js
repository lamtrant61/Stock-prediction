import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex);
     
export const store = new Vuex.Store({
	state: {
		status_login: "",
		user: "",
		token: "",
		time_expire: "",
		activate_user: false
	},
	getters: {
		status_login: state => state.status_login,
		user: state => state.user,
		token: state => state.token,
		time_expire: state => state.time_expire,
		activate_user: state => state.activate_user
	},

	mutations: {
		setStatus(state, status_login) {
			state.status_login = status_login
		},
		setUser(state, user) {
			state.user = user
		},
		setToken(state, token) {
			state.token = token
		},
		setTimeExpire(state, time_expire) {
			state.time_expire = time_expire
		},
		setActivateUser(state, activate_user) {
			state.activate_user = activate_user
		}
	},
	actions: {
		updateToken({commit}) {
			commit("setToken")
		}
	},
	// plugins: [createPersistedState({
 //        storage: window.sessionStorage,
 //    })]
	plugins: [createPersistedState()]
});