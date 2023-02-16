<template>
  <div id="body_div_register">
    <div id="register_div">
      <section id="register_section">
          <b-field label="Name" :type="typeName" :message="nameMess">
              <b-input v-model="name" icon-right="icon_right" :loading="nameLoad" @change.native="check_name(name)" maxlength="24"></b-input>
          </b-field>

          <b-field label="Email"
              :type="typeEmail"
              :message="emailMess">
              <b-input type="typeEmail"
                  icon-right="icon_right"
                  v-model="email"
                  @change.native="check_email(email)"
                  value=""
                  maxlength="48">
              </b-input>
          </b-field>

          <b-field label="Username"
              :type="typeUser"
              :message="userMess">
              <b-input v-model="username" icon-right="icon_right" value="" @change.native="check_user(username)" maxlength="16"></b-input>
          </b-field>

          <b-field label="Password" :type="typePass" :message="passMess">
              <b-input type="password"
                  v-model="password"
                  value=""
                  maxlength="32"
                  @change.native="check_pass(password)"
                  password-reveal>
              </b-input>
          </b-field>
          <div id="button_div_register">
            <b-button type="is-success" expanded @click="register_check">Register</b-button>
            <b-button id="button_login" type="is-text" expanded  @click="$router.push('/login')">Login</b-button>
          </div>  
      </section>
    </div>
    <b-loading :is-full-page="full_page_loading" v-model="isLoading" :can-cancel="cancel_loading"></b-loading>

    <modal name="modal_active">
        <section id="modal_login">
          <b-field label="Verification code"
              :type="typeVerify"
              :message="verifyMess">
              <b-input v-model="verifyCode" value="" @change.native="check_verify(verifyCode)" maxlength="6"></b-input>
          </b-field>
          <div id="button_div_active">
            <b-button type="is-success" expanded @click="activate_register">Active</b-button>
            <b-button id="button_resend" type="is-text" expanded @click="resend_email(), warning_snackBar()">Resend</b-button>
          </div>     
      </section>
    </modal>
  </div>
</template>

<script>
    import axios from 'axios'
    import { mapGetters, mapMutations } from 'vuex'
    export default {
        computed: {
            ...mapGetters(["status_login", "user", "token", "activate_user", "time_expire"])
        },
        mounted() {
          if (this.status_login=="lmao"){
            this.$router.push('/chartpredict')
          }
        },
        methods: {
            ...mapMutations(["setStatus", "setToken", "setUser", "setActivateUser", "setTimeExpire"]),
            login_check(){
                let string_pass = this.encodePass(this.password)
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
            },
            warning_snackBar() {
                this.$buefy.snackbar.open({
                    message: 'An email has been sent to your email address, please check and get the verification code to active your account!',
                    type: 'is-warning',
                    position: 'is-top',
                    actionText: 'OK',
                    indefinite: true,
                    onAction: () => {
                        //console.log("resend")
                        // this.$buefy.toast.open({
                        //     message: '',
                        //     queue: false
                        // })
                    }
                })
            },
            activate_register() {
              if (this.typeVerify == "is-success") {
                this.isLoading=true
                this.hide()
                //let url = "/_active_/%%username:"+this.username+"%%activate:"+this.verifyCode+"%%end%%"
                axios.post('_active_/', {
                    security: {
                      data: "form",
                      type: "json",
                      author: "lamdz"
                    },
                    data: {
                      user: this.username,
                      active: this.verifyCode
                    }
                })
                .then((response) => {
                    if (response.data.status == "ok") {
                      //this.hide()
                      this.$alert("Register success!", "Success", "success");
                      this.login_check()
                    } else {
                      this.show()
                      this.$alert("Verification code is not correct!", "Error", "error");
                    }
                })
                .finally(() => {
                  this.isLoading=false
                });
              }
            },
            show () {
              this.$modal.show('modal_active');
            },
            hide () {
              this.$modal.hide('modal_active');
            },
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
            resend_email(){
              if (this.typeEmail == "is-success" && this.typeUser == "is-success") {
                //let url = "/_resend_/%%email:"+this.email+"%%username:"+this.username+"%%end%%"
                axios.post('_resend_/', {
                    security: {
                      data: "form",
                      type: "json",
                      author: "lamdz"
                    },
                    data: {
                      email: this.email,
                      user: this.username
                    }
                })
                .finally(() => {});
              }
            },
            register_check(){
              if (this.typeName == "is-success" && this.typeEmail == "is-success" && this.typeUser == "is-success" && this.typePass == "is-success"){
                  this.isLoading=true
                  let string_pass = this.encodePass(this.password)
                  //let url = "/_register_/%%name:"+this.name+"%%email:"+this.email+"%%username:"+this.username+"%%password:"+string_pass+"%%end%%"
                  axios.post('_register_/', {
                    security: {
                      data: "form",
                      type: "json",
                      author: "lamdz"
                    },
                    data: {
                      name: this.name,
                      email: this.email,
                      user: this.username,
                      pass: string_pass
                    }
                  })
                  .then((response) => {
                    if (response.data.status == "ok") {
                      this.show()
                      this.warning_snackBar()
                      // this.$prompt("You need to active your user, please check email address!").then(text => {

                      //   this.$alert("ok!", "Error", "error");
                      // });
                      //this.$router.push('/chartpredict')
                    } else {
                      console.log("error response")
                      this.$alert("Login error, username or password is invalid!", "Error", "error");
                    }
                  })
                  .finally(() => {
                      this.isLoading =  false
                  });
              } else {
                this.$alert("Register error, something went wrong!", "Error", "error");
              }
            },
            check_name(text){
              this.nameLoad = true
              if (text.length===0) {
                  this.typeName = "is-danger"
                  this.nameMess = "Name cannot be empty"
              } else {
                  let regex = /^[a-zA-Z0-9]+$/
                  if (regex.test(text)) {
                      this.typeName = "is-success"
                      this.nameMess = "Name is available"
                  } else {
                      this.typeName = "is-danger"
                      this.nameMess = "Cannot use special characters"
                  }
              }
              this.nameLoad = false
            },
            check_email(text){
              this.emailLoad = true
              if (text.length===0) {
                  this.typeEmail = "is-danger"
                  this.emailMess = "Email cannot be empty"
              } else {
                  let regex = /^[a-zA-Z0-9@.]+$/
                  if (regex.test(text)) {
                      this.typeEmail = "is-success"
                      this.emailMess = "Email is available"
                  } else {
                      this.typeEmail = "is-danger"
                      this.emailMess = "Cannot use special characters"
                  }
                  let regex_email = "@"
                  let total_regex = 0
                  let locate_regex = 0

                  for (let i=0; i<text.length; i++) {
                      if (text.slice(i,i+1)===regex_email) {
                          total_regex++
                          locate_regex=i+1
                      }
                  }
                  if (total_regex==1 && locate_regex!=text.length && locate_regex!=1) {
                      this.typeEmail = "is-success"
                      this.emailMess = "Email is available"
                  } else {
                      this.typeEmail = "is-danger"
                      this.emailMess = "Email must be abc@abc..."
                  }
              }
              this.emailLoad = false
            },
            check_user(text){
              this.userLoad = true
              if (text.length===0) {
                  this.typeUser = "is-danger"
                  this.userMess = "Username cannot be empty"
              } else if (text.length<6) {
                  this.typeUser = "is-danger"
                  this.userMess = "Username must be 6 characters"
              } else {
                  let regex = /^[a-zA-Z0-9]+$/
                  if (regex.test(text)) {
                      this.typeUser = "is-success"
                      this.userMess = "Username is available"
                  }  else {
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
              } else if (text.length<6) {
                  this.typePass = "is-danger"
                  this.passMess = "Password must be 6 characters"
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
            },
            check_verify(text){
              this.verifyLoad = true
              if (text.length===0) {
                  this.typeVerify = "is-danger"
                  this.verifyMess = "Verification code cannot be empty"
              } else if (text.length<6) {
                  this.typeVerify = "is-danger"
                  this.verifyMess = "Verification code must be 6 characters"
              }
              else {
                  let regex = /^[a-zA-Z0-9]+$/
                  if (regex.test(text)) {
                      this.typeVerify = "is-success"
                      this.verifyMess = "Verification code is available"
                  } else {
                      this.typeVerify = "is-danger"
                      this.verifyMess = "Cannot use special characters"
                  }
              }
              this.verifyLoad = false
            }
        },

        data() {
            return {
                full_page_loading: true,
                cancel_loading: false,
                isLoading: false,

                icon_right: "lmao",

                verifyLoad: false,
                verifyCode: "",
                verifyMess: "Please input verification code",
                typeVerify: "is-primary",


                name: "",
                typeName: "is-danger",
                nameMess: "Name cannot be empty",
                nameLoad: false,


                email: "",
                typeEmail: "is-danger",
                emailMess: "Email cannot be empty",
                emailLoad: false,

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
#body_div_register {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url("../../public/background_login.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
#register_div{
  position: relative;
  background-color: white;
  margin-top: 45vh;
  margin-left: 50%;

  transform: translate(-50%, -50%);
  width: 350px;
  height: 580px;
}

#register_section{
  position: relative;
  padding-top: 5%;
  padding-bottom: 5%;
  padding-right: 5%;
  padding-left: 5%;
}

#button_div_register{
  margin-top: 10%;
}

#button_login{
  margin-top: 5%;
}

#modal_login{
  position: absolute;
  margin-top: 25%;
  margin-left: 50%;
  transform: translate(-50%, -50%);
}
</style>


