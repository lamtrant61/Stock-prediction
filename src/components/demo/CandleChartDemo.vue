<template>
<div id="c_Chart">
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
import Overlays from 'tvjs-overlays'
import axios from 'axios'

export default {
  name: 'app',
  components: { TradingVue },
  props: {
    hexData: String //Object
  },
  methods: {
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
    createPredict(cp_code, modelName) {
      let dataC = null
      $.getJSON("data/web_data/"+cp_code+"_"+modelName+".json")
      .done((dataC) => {
        const mili_date=dataC.current_time
        this.chart.add('onchart', {
            "name": "Data sections",
            "type": "Splitters",
            "data": [[mili_date, "You are here 🦆", 0, "#f4c20d", 0.95]],
            "settings": {
              "legend": false,
              "lineWidth": 1.5
            }
        })
        let data_predict = dataC.data.map(([timeC, value]) => ([timeC, value]))
        this.chart.merge('onchart.Spline.data', data_predict)
      })
    },

    candleData(cp_code, modelName) {
      if (cp_code=="NULL" || modelName==null) {
        let demo = this.$alert("Bạn phải chọn mã chứng khoán và mô hình trước", "Error", "error");
        this.sleep(2)
      }
      let dataC = null
      this.$set(this, 'chart', new DataCube())
      this.$refs.tvjs.resetChart()

      $.getJSON("data/web_data/"+cp_code+"_current.json")
      .done((dataC) => {
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

        this.code_cp = cp_code
        this.createPredict(cp_code, modelName)
        
        this.chart.set('chart.indexBased', true)
      })
      .fail(() => {
        console.log("Error while loading data")
      })
    },
  },

  mounted() {
    window.clearInterval(this.interval)
    window.addEventListener("resize", this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },

  data() {
    return {
      toolbar_show: false,
      interval: "",
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


