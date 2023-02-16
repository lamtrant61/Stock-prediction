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

            <b-navbar-item @click="open=true; $refs.candleRef.change_toolbar(false)">
                Dự báo
            </b-navbar-item>
        </template>

        <template #end>
            <b-navbar-item tag="div">
                <div class="buttons">
                    <!-- <a class="button is-warning" @click="loading()"> -->
                    <a class="button is-warning" @click="$router.push('/login')">
                        <strong>Thử nghiệm</strong>
                    </a>
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
      @close="$refs.candleRef.change_toolbar(true)"
    >
      <div class="p-1">
        <img
          src="bogau.jpg"
          alt="Website dự báo chứng khoán Việt Nam"
        />
        <b-menu>
          <b-field>
              <b-select v-model="model_i" placeholder="MÔ HÌNH DỰ BÁO" :expanded="true">
                  <option class="input_class"  v-for="(value, index) in all_model" :value="value.value" :key="index">
                      {{ value.text }}
                  </option>
              </b-select>
          </b-field>

          <b-field>
              <b-select v-model="hex_code" placeholder="MÃ CHỨNG KHOÁN" :expanded="true">
                  <option v-for="(opt, index) in options.symbol" :value="opt" :key="-index"> 
                    {{ code_info[index] }} 
                  </option>
              </b-select>
          </b-field>

          <div class="buttons">
            <b-button type="is-primary" expanded @click="showInfoCode(); $refs.candleRef.candleData(String(hex_code).toUpperCase(), model_i); $refs.candleRef.change_toolbar(true); open=false">Search</b-button>
        </div>

        </b-menu>
      </div>
    </b-sidebar>

<!--     <b-button @click="open=true; $refs.candleRef.change_toolbar(false)">Show</b-button> -->
    <CandleChartDemo v-show=true ref="candleRef" :hexData="String(hex_code).toUpperCase()"/>
  </section>
</template>

<script>
import $ from 'jquery'
import CandleChartDemo from './CandleChartDemo.vue'

export default {
  name: 'HomePage',
  components: {
    CandleChartDemo,
  },
  methods: {
    loading() {
      const loadingComponent = this.$buefy.loading.open({
        container: null
      })
      setTimeout(() => loadingComponent.close(), 1.5 * 1000)
    },
    showInfoCode() {
      // console.log(this.hex_code)
      // console.log(this.model_i)
    },
    getSymbol() {
      $.getJSON("data/create_symbol_vn30.json")
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
  data() {
    this.getSymbol()

    var options_select = [
      { value: 'lstm', text: 'LSTM' },
      { value: 'gru', text: 'GRU' },
      { value: 'cnn', text: 'CNN' }
    ]
    return {
      model_i: null,
      hex_code: null,
      options: [],
      code_info: [],
      all_model: options_select,
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

