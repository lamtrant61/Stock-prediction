<template>
  <div id="body_div_login">
    <div id="login_div">
      <section id="login_section">
          <b-field label="Username"
              :type="typeUser"
              :message="userMess">
              <b-input v-model="username" icon-right="icon_right" value="" @change.native="check_user(username)" maxlength="16"></b-input>
          </b-field>

          <b-field label="Password" :type="typePass" :message="passMess">
              <b-input type="password"
                  v-model="password"
                  value=""
                  @change.native="check_pass(password)"
                  maxlength="32"
                  password-reveal>
              </b-input>
          </b-field>
          <div id="button_div_login">
            <b-button type="is-success" expanded @click="login_check">Login</b-button>
            <b-button id="button_resgister" type="is-text" expanded @click="$router.push('/register')">Register</b-button>
            <!-- <b-button id="button_demo_chart" type="is-warning" expanded @click="$router.push('/home')">Demo version</b-button> -->
          </div>     
<!--           <b-button id="button_resgister" type="is-text" expanded>Register</b-button>
          <b-button id="button_login" type="is-success">Login</b-button> -->
      </section>

    </div>
          <b-loading :is-full-page="true" v-model="isLoading" :can-cancel="false"></b-loading>
  </div>
</template>

<script>
    import { mapGetters, mapMutations } from 'vuex'
    import axios from 'axios'
    export default {
        computed: {
            ...mapGetters(["status_login", "user", "token", "activate_user", "time_expire"])
        },
        mounted() {
          if (this.status_login=="lmao"){
            this.$router.push('/chartrealtime')
          }
        },
        methods: {
            ...mapMutations(["setStatus", "setToken", "setUser", "setActivateUser", "setTimeExpire"]),
            randomChar(length) {
              let result = '';
              let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
              let charactersLength = characters.length;
              for ( let i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
              }
              return result;
            },
            encodePass(string_pass) {
              let new_str = ""
              for (let i=0;i<=string_pass.length;i++) {
               new_str+=this.randomChar(3)
               if (i<string_pass.length)
                 new_str+=string_pass[i]
              }
              let b64 = btoa((btoa(new_str)))
              return b64
            },
            login_check(){
              if (this.typeUser == "is-success" && this.typePass == "is-success"){
                  let string_pass = this.encodePass(this.password)
                  //let url = "/_login_/%%username:"+this.username+"%%password:"+string_pass+"%%end%%"

                  axios.post('_login_/', {
                    security: {
                      data: "form",
                      type: "json",
                      author: "lamdz"
                    },
                    data: {
                      user: this.username,
                      pass: string_pass
                    }
                  })
                  .then((response) => {
                    if (response.data.status == "ok") {
                        this.setToken(response.data.token)
                        this.setActivateUser(response.data.activateUser)
                        this.setUser(this.username)
                        this.setTimeExpire(Date.now())
                        this.setStatus("lmao")
                        this.$router.push('/chartrealtime')
                    } else {
                        this.setToken("")
                        this.setUser("")
                        this.setActivateUser(false)
                        this.setTimeExpire("")
                        this.setStatus("error")
                      this.$alert("Login error, username or password is invalid!", "Error", "error");
                    }
                  })
              } else {
                this.$alert("Login error, username or password is invalid!", "Error", "error");
              }
            },
            check_user(text){
              this.userLoad = true
              if (text.length===0) {
                  this.typeUser = "is-danger"
                  this.userMess = "Username cannot be empty"
              } else {
                  let regex = /^[a-zA-Z0-9]+$/
                  if (regex.test(text)) {
                      this.typeUser = "is-success"
                      this.userMess = "Username is available"
                  } else {
                      this.typeUser = "is-danger"
                      this.userMess = "Cannot use special characters"
                  }
              }
              this.userLoad = false
            },
            check_pass(text){
              this.passLoad = true
              if (text.length===0) {
                  this.typePass = "is-danger"
                  this.passMess = "Password cannot be empty"
              } else {
                  let regex = /^[a-zA-Z0-9]+$/
                  if (regex.test(text)) {
                      this.typePass = "is-success"
                      this.passMess = "Password is available"
                  } else {
                      this.typePass = "is-danger"
                      this.passMess = "Cannot use special characters"
                  }
              }
              this.passLoad = false
            }
        },

        data() {
            return {
                isLoading: false,

                icon_right: "lmao",

                username: "",
                typeUser: "is-danger",
                userMess: "Username cannot be empty",
                userLoad: false,

                password: "",
                typePass: "is-danger",
                passMess: "Password cannot be empty",
                passLoad: false
            }
        }
    }
</script>


<style scope>
#body_div_login {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url("../../public/background_login.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
#login_div{
  position: relative;
  background-color: white;
  margin-top: 45vh;
  margin-left: 50%;

  transform: translate(-50%, -50%);
  width: 300px;
  height: 360px;
}

#login_section{
  position: relative;
  padding-top: 5%;
  padding-bottom: 5%;
  padding-right: 5%;
  padding-left: 5%;
}
#button_div_login{
  margin-top: 10%;
}

#button_resgister{
  margin-top: 5%;
}

#button_demo_chart{
  margin-top: 5%;
}
</style>


