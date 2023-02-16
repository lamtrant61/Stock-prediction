<template>
  <section>
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

            <b-navbar-item @click="open=true; $refs.candleRealRef.change_toolbar(false)">
                Dữ liệu
            </b-navbar-item>

            <b-navbar-item @click="$router.push('/chartpredict')">
                Dự báo
            </b-navbar-item>
        </template>

        <template #end>
            <b-navbar-item tag="div">
                <div class="buttons">
                    <UserStatus />
                </div>
            </b-navbar-item>
        </template>
    </b-navbar>


    <b-sidebar
      type="is-white"
      :fullheight="fullheight"
      :fullwidth="fullwidth"
      :overlay="overlay"
      :right="right"
      v-model="open"
      @close="$refs.candleRealRef.change_toolbar(true)"
    >
      <div class="p-1">
        <img
          src="bogau.jpg"
          alt="Website dự báo chứng khoán Việt Nam"
        />
        <b-menu>

          <b-field>
              <b-select v-model="hex_code" placeholder="MÃ CHỨNG KHOÁN" :expanded="isHidden">
                  <option v-for="(opt, index) in options.symbol" :value="opt" :key="-index"> 
                    {{ code_info[index] }} 
                  </option>
              </b-select>
          </b-field>

          <div class="buttons">
            <b-button type="is-primary" expanded @click="showInfoCode(); $refs.candleRealRef.candleDataRealTime(String(hex_code).toUpperCase()); $refs.candleRealRef.change_toolbar(true); open=false">Search</b-button>
        </div>

        </b-menu>
      </div>
    </b-sidebar>

<!--     <b-button @click="open=true; $refs.candleRealRef.change_toolbar(false)">Show</b-button> -->
    <DataRealTime v-show=true ref="candleRealRef" :hexData="String(hex_code).toUpperCase()"/>
<!--     <CheckToken ref="checkTokenRef" /> -->
  </section>
</template>

<script>
import $ from 'jquery'
import DataRealTime from './DataRealTime.vue'
import UserStatus from './UserStatus.vue'
//import CheckToken from './CheckToken.vue'
import { mapGetters, mapMutations } from 'vuex'
import axios from 'axios'
export default {
  name: 'ChartLogin',
  components: {
    DataRealTime, UserStatus,// CheckToken,
  },
  computed: {
    ...mapGetters(["status_login", "user", "token", "activate_user", "time_expire"])
  },
  methods: {
    ...mapMutations(["setStatus", "setToken", "setUser", "setActivateUser", "setTimeExpire"]),
    loopPics() {
      this.$router.push('/looppics')
    },
    loading() {
      const loadingComponent = this.$buefy.loading.open({
        container: null
      })
      setTimeout(() => loadingComponent.close(), 1.5 * 1000)
    },
    showInfoCode() {
      //console.log(this.user)
      //console.log(this.hex_code)
      //console.log(this.model_i)
    },
    callFunctionClearIntervalDataRealTime() {
      this.$refs.candleRealRef.removeIntervalDataRealTime()
    },
    getSymbol() {
      $.getJSON("data/create_symbol_cluster.json")
        .done((dataC) => {
          this.options = dataC
          //console.log(this.options.name.length)
          let code_info = []
          let code_index
          for (let i=0; i<dataC.name.length; i++) {
            code_index = dataC.symbol[i]+"\t-\t"+dataC.name[i]
            code_info.push(code_index)
          }
          this.code_info = code_info
          
        })
        .fail(() => {
          console.log("Error while loading symbols")
        })
    },
  },
  mounted(){
    //this.$refs.checkTokenRef.setFunctionInterval()
    if (this.user=="adminn"){
      this.isHidden=true
    }
  },
  data() {
    this.getSymbol()

    return {
      isHidden: false,

      model_i: null,
      hex_code: null,
      options: [],
      code_info: [],
      open: true,
      overlay: true,
      fullheight: true,
      fullwidth: false,
      right: true
    };
  }
};
</script>

<style>
.p-1 {
  padding: 1em;
}

</style>

