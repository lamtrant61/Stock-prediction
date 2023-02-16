<template>


</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import axios from 'axios'
export default {
	name: 'app',
	computed: {
		...mapGetters(["status_login", "user", "token", "activate_user", "time_expire"])
	},
	methods: {
		...mapMutations(["setStatus", "setToken", "setUser", "setActivateUser", "setTimeExpire"]),
		checkToken() {
	      if (this.status_login=="lmao"){
	        axios.post('_check_/', {
	          security: {
	            data: "form",
	            type: "json",
	            author: "lamdz"
	          },
	          data: {
	            user: this.user,
	            token: this.token
	          }
	        }).then((response) => {
	          if (response.data.status!="ok") {
	            this.logout()
	            this.$alert("Token expired", "Error", "error");
	          }
	        })
	      }
	    },
	    setFunctionInterval(){
		    if (this.status_login!="lmao") {
		      this.$alert("You must login before using this page", "Error", "error");
		      this.logout()
		    } else {
				if (this.activate_user!=true) {
					this.$alert("You must activate user before using this page", "Error", "error");
					this.logout()
				} else {
					let timeEx = parseInt(Date.now()) - parseInt(this.time_expire)
					if (timeEx>=2*60*1000) {
					  // hour*minute*second
					  this.checkToken()
					}
				}
		    }
			this.interval = window.setInterval(() => {
				this.checkToken()
			}, 40000)
		},
		clearIntervalFunction() {
			window.clearInterval(this.interval)
			this.interval = null
		},
		logout() {
			window.clearInterval(this.interval)
			this.setToken("")
			this.setUser("")
			this.setActivateUser(false)
			this.setTimeExpire("")
			this.setStatus("error")
			this.$router.push('/login')
	    },
	},
	

	data() {
		return {
			interval: null,
		};
	}
}

</script>


<style scope>


</style>
