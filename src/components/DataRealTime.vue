<template>
<div id="c_Chart">
  <b-loading :is-full-page="full_page_loading" v-model="isLoading" :can-cancel="cancel_loading"></b-loading>

  <trading-vue 
    id="trading_id"
    ref="tvjs"
    :data="chart"
    :toolbar="toolbar_show"
    :titleTxt="code_cp"
    :colorTitle="colors.colorText"
    :overlays="overlays"

    :width="this.width"
    :height="this.height*0.92"
    :color-back="colors.colorBack"
    :color-grid="colors.colorGrid"
    :color-text="colors.colorText">
  </trading-vue>
</div>

</template>
<script>
import $ from 'jquery'
import { TradingVue, DataCube } from 'trading-vue-js'
import { mapGetters, mapMutations } from 'vuex'
import Overlays from 'tvjs-overlays'
import axios from 'axios'

export default {
  name: 'app',
  components: { TradingVue },
  props: {
    hexData: String //Object
  },
  computed: {
    ...mapGetters(["status_login", "user", "token", "activate_user", "time_expire"])
  },
  methods: {
    ...mapMutations(["setStatus", "setToken", "setUser", "setActivateUser", "setTimeExpire"]),
    change_toolbar(check_toolbar) {
      this.toolbar_show = check_toolbar
    },
    onResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    },
    on_button_click(event) {
      console.log(event)
      console.log("ok")
    },
    sleep(second) {
      setTimeout(() => {this.$router.go()}, second*1000);
    },
    get_data_real_time(cp_code, mili_date) {
      let dataC = null
      //$.getJSON("data/web_data/"+cp_code+"_"+modelName+".json")
      axios.post('_getdatarealtime_/', {
        security: {
          data: "form",
          type: "json",
          author: "lamdz"
        },
        data: {
          user: this.user,
          token: this.token,
          hex: cp_code
        }
      })
      .then((dataAll) => {


        let dataC = dataAll.data

        let open_d = parseFloat(dataC.open)
        let close_d = parseFloat(dataC.close)
        let ceil_d = parseFloat(dataC.ceil)
        let floor_d = parseFloat(dataC.floor)
        let volume_d = parseFloat(dataC.volume)


        this.chart.merge('chart.data', [[mili_date, open_d, ceil_d, floor_d, close_d, volume_d]])
        //this.isLoading = false
      })
      .catch((error) => {
        //this.$alert("Error when loading data!", "Error", "error");
        //this.isLoading = false
      })
    },

    removeIntervalDataRealTime() {
      window.clearInterval(this.dataRealTimeInterval)
      this.dataRealTimeInterval = null
    },

    candleDataRealTime(cp_code) {
      if (cp_code=="NULL") {
        let demo = this.$alert("Bạn phải chọn mã chứng khoán trước", "Error", "error");
        this.sleep(2)
      }
      let dataC = null
      this.$set(this, 'chart', new DataCube())
      this.$refs.tvjs.resetChart()

      this.isLoading = true
      axios.post('_getdatanew_/', {
        security: {
          data: "form",
          type: "json",
          author: "lamdz"
        },
        data: {
          user: this.user,
          token: this.token,
          json: cp_code+"_current.json"
        }
      })
      .then((dataAll) => {
        const current = new Date();
        const date = current.getFullYear()+'-'+(current.getMonth()+1)+'-'+current.getDate()+" 07:00";
        const date_config = new Date(date);
        const mili_date = date_config.getTime()+86400000;

        let dataC = dataAll.data.data
        this.chart.set('chart.data', dataC.data)
         

        this.chart.add('onchart', {
            "name": "Bollinger Bands, 25",
            "type": "BB",
            "data": [],
            "settings": {
              "showMid": false,
              "color": "#D4AC0D",
              "backColor": "#F7F9F9",
              "length": 25
            }
        })
        this.chart.add('onchart', {
              "name": "Moving Average, 25",
              "type": "SMA",
              "data": [],
              "settings": {
                "length": 25,
                "color": "#2980B9"
              }
          })
        this.chart.add('offchart', {
            "name": "Relative Strength Index",
            "type": "RSI",
            "data": [],
            "settings": {
              "length": 25,
              "color": this.colors.colorText
            }
        })
        this.chart.add('onchart', {
          "name": "Predict data",
          "type": "Spline",
          "data": [],
          "settings": {
            "lineWidth": 1.5,
            "color": "#7D3C98",
          }
        })
        this.isLoading = false
        this.code_cp = cp_code

        this.get_data_real_time(cp_code, mili_date) 

        if (this.check_interval) {
          this.removeIntervalDataRealTime()
          // window.clearInterval(this.dataRealTimeInterval)
          // this.dataRealTimeInterval = null;
        }
          
        this.dataRealTimeInterval = window.setInterval(() => {
          this.get_data_real_time(cp_code, mili_date)
        }, 5000)
        this.check_interval= true
        
        this.chart.set('chart.indexBased', true)
      })
      .catch((error) => {
        this.$alert("Error when loading data!", "Error", "error");
        window.clearInterval(this.dataRealTimeInterval)
        this.dataRealTimeInterval = null;
        this.isLoading = false;
      })
    },
  },

  mounted() {
    window.clearInterval(this.dataRealTimeInterval)
    window.addEventListener("resize", this.onResize);
  },
  beforeDestroy() {
    this.removeIntervalDataRealTime()
    window.removeEventListener("resize", this.onResize);
  },

  data() {
    return {
      check_interval: false,

      full_page_loading: true,
      cancel_loading: false,
      isLoading: false,

      toolbar_show: false,
      dataRealTimeInterval: null,
      code_cp: "",
      chart: {},
      overlays: [Overlays['BB'], Overlays['RSI'], Overlays['SMA']],
      width: window.innerWidth,
      height: window.innerHeight,
      colors: {
          colorBack: '#fff',
          colorGrid: '#eee',
          colorText: '#333',
      },
    }
  }
}

</script>


<style>

#c_Chart {
  margin-top: 0.5%;
  margin-left: 0px;
  width: 100%;
  height: 100%;
}
</style>


