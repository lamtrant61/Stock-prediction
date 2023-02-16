<template>  
  <div id="body_div_loop_pics">
    <b-navbar type="is-dark">
        <template #brand>
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
                <img
                    src="bogau.jpg"
                    alt="Website dự báo chứng khoán Việt Nam"
                >
            </b-navbar-item>
        </template>
        <template #start>
            <b-navbar-item href="/">
                Trang chủ
            </b-navbar-item>

            <b-field>
              <b-input id="input_index" v-model="current_img" placeholder="Input index number" @change.native="change_index_pic(); changeIndex()"
                    type="number"
                    min="0"
                    max="9999">
                </b-input>
            </b-field>

            <b-field>
                <b-select id="stock_pics_id" v-model="stock_pics" placeholder="Stock pics" :expanded="true" @change.native="change_pic_name(); changeIndex()">
                    <option class="input_class"  v-for="(value, index) in all_url" :value="value" :key="index">
                        {{ value }}
                    </option>
                </b-select>
            </b-field>
        </template>

      
        <template #end>
            <b-navbar-item tag="div">
                <div class="buttons">
                    <UserStatus />
                </div>
            </b-navbar-item>
            
        </template>
    </b-navbar>

    <div id="id_button_looppics">
      <button id="back_looppics" @click="Back_img">Back stock</button>
      <button id="next_looppics" @click="Next_img">Next stock</button>
    </div>

    <vue-load-image id="load_img">
      <img slot="image" :src="src" />
      <img id="load_pics" src="image-loader.gif" slot="preloader" />
      <div slot="error">Image load fails</div>
    </vue-load-image>


    <CheckToken ref="checkTokenRef" />
  </div>


</template>

<script>
    import UserStatus from './UserStatus.vue'
    import CheckToken from './CheckToken.vue'
    import { mapGetters, mapMutations } from 'vuex'
    import VueLoadImage from 'vue-load-image'
    import $ from 'jquery'
    import axios from 'axios'
    export default {
        components: {
          UserStatus, CheckToken,
          'vue-load-image': VueLoadImage
        },
        computed: {
            ...mapGetters(["status_login", "user", "token", "activate_user"])
        },
        mounted(){
          if (this.status_login!="lmao") {
            this.$alert("You must login before using this page", "Error", "error");
            this.$refs.checkTokenRef.logout()
          } else {
            if (this.user!="admin") {
              this.$alert("You must be admin to use this page", "Error", "error");
              this.$refs.checkTokenRef.logout()
            }
          }
          this.getURL()
        },
        methods: {
            ...mapMutations(["setStatus", "setToken", "setUser", "setActivateUser"]),
            getURL() {
              $.getJSON("data/create_url_pics.json")
                .done((data) => {
                  this.all_url = data.url_pics
                  this.stock_pics = this.all_url[0]
                  this.changeURL()
                })
                .fail(() => {
                  this.$alert("Error while loading url pics", "Error", "error");
                })
            },
            Back_img() {
              if (this.current_img==0) {
                this.current_img=this.all_url.length-1
              } else {
                this.current_img--
              }
              this.change_index_pic()
              this.changeURL()
            },
            Next_img() {
              if (this.current_img==this.all_url.length-1) {
                this.current_img=0
              } else {
                this.current_img++
              }
              this.change_index_pic()
              this.changeURL()
            },
            changeURL() {
              this.src="data/web_pics/"+this.all_url[this.current_img]
            },
            changeIndex() {
              this.change_index_pic()
              this.changeURL()
            },
            change_index_pic() {
              if (this.current_img>=this.all_url.length-1) {
                this.current_img=this.all_url.length-1
              } else if (this.current_img<0){
                this.current_img=0
              }
              this.stock_pics = this.all_url[this.current_img]
            },
            change_pic_name() {
              for (let i=0; i<this.all_url.length; i++) {
                if (this.all_url[i]==this.stock_pics){
                  this.current_img=i
                }
              }
            }
        },

        data() {
            return {
              stock_pics: "",
              current_img: 0,
              all_url: [],
              src: ""
            }
        }
    }
</script>


<style scope>
#body_div_loop_pics {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url("../../public/background_login.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
#id_button_looppics{
  position: absolute;
  left: 50%;
  top: 12%;
  transform: translate(-50%, -50%);
}

#back_looppics {
  position: relative;
  height: 5%;
  font-size: 16px;
  border-radius: 6px;
  margin-bottom: 12px;
  -webkit-appearance: none;
}
#next_looppics {
  position: relative;
  height: 5%;
  font-size: 16px;
  border-radius: 6px;
  margin-bottom: 12px;
  left: 2%;
  -webkit-appearance: none;
}
#load_img {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -80%);
  width: 82%;
  height: 50%
}
#load_pics {
  position: relative;
  left: 50%;
  top: 80%;
  transform: translate(-50%, -50%);
}
#input_index {
  position: relative;
  transform: translate(0%, 20%);
  left: 30%
}
#stock_pics_id {
  position: relative;
  transform: translate(0%, 20%);
  left: 15%
}
#changeStockButton {
  position: relative;
  left: 15px
}
</style>


