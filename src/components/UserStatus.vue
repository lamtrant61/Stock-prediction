<template>
	<div id="UserStatusId">
      <b-dropdown :triggers="['hover']" aria-role="list">
          <template #trigger>
              <b-button
                  type="is-warning"
                  icon-left="hand-holding-dollar"
                  icon-right="code">
                  <strong>Trạng thái đăng nhập</strong>
              </b-button>
          </template>

          <b-dropdown-item aria-role="listitem" @click="loopPics" v-show="isAdmin">
              <div class="media">
                  <b-icon class="media-left" icon="images"></b-icon>
                  <div class="media-content">
                      <h3>Ảnh tĩnh</h3>
                      <small>Kiểm tra nhanh</small>
                  </div>
              </div>
          </b-dropdown-item>

<!--           <b-dropdown-item aria-role="listitem" @click="managerUser" v-show="isAdmin">
              <div class="media">
                  <b-icon class="media-left" icon="users"></b-icon>
                  <div class="media-content">
                      <h3>Quản lý</h3>
                      <small>Dành cho quản trị viên</small>
                  </div>
              </div>
          </b-dropdown-item> -->

          <b-dropdown-item aria-role="listitem" @click="routerUserInfo">
              <div class="media">
                  <b-icon class="media-left" icon="home"></b-icon>
                  <div class="media-content">
                      <h3>Tài khoản</h3>
                      <small>Thông tin tài khoản</small>
                  </div>
              </div>
          </b-dropdown-item>

          <b-dropdown-item aria-role="listitem" @click="logout">
              <div class="media">
                  <b-icon class="media-left" icon="door-open"></b-icon>
                  <div class="media-content">
                      <h3>Đăng xuất</h3>
                      <small>Đăng xuất hệ thống</small>
                  </div>
              </div>
          </b-dropdown-item>
      </b-dropdown>


      <CheckToken ref="checkTokenRef" />
	</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import CheckToken from './CheckToken.vue'
import axios from 'axios'

export default {
	name: 'app',
  components: {
    CheckToken,
  },
	computed: {
		...mapGetters(["status_login", "user", "token", "activate_user"])
	},
	methods: {
		...mapMutations(["setStatus", "setToken", "setUser", "setActivateUser"]),
		loopPics() {
      this.clearIntervalToken()
			this.$router.push('/looppics')
		},
    managerUser() {
      this.clearIntervalToken()
      this.$router.push('/manager')
    },
    routerUserInfo() {
      this.clearIntervalToken()
      this.$router.push('/userinfo')
    },
		logout() {
      this.$refs.checkTokenRef.logout()
    },
    clearIntervalToken() {
      this.$refs.checkTokenRef.clearIntervalFunction()
    },
	},
  mounted(){
    try {
      axios.post('_typeuser_/', {
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
        if (response.data.check_status!="ok") {
          this.logout()
          this.$alert("Token expired", "Error", "error");
        } else {
          if (response.data.type_user==1) {
            this.isAdmin=true
          } else {
            this.isAdmin=false
          }
        }
      })
    } catch {
      this.isAdmin=false
    }
    this.$refs.checkTokenRef.setFunctionInterval()
  },
  data() {

    return {
      isAdmin: false
    };
  }
}

</script>


<style>

</style>


