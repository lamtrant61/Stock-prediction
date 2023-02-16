<template>

  <div id="main_class">
    <CreateSVG id="svgator"/>
    <div id="div_text_mobile" v-if="isMobile">
      <p id="p_title_mobile">Trang web dự báo chứng khoán hàng đầu Việt Nam</p>
      <transition name="bounce" appear>
        <p id="p_text_mobile" class="mobile_font" v-if="show">Bạn đang muốn đến với thị trường chứng khoán nhưng không biết bắt đầu từ đâu, bạn đầu tư chứng khoán nhưng đang xa bờ...<br>Hãy đến với chúng tôi - website dự báo chứng khoán bằng công nghệ trí tuệ nhân tạo, hứa hẹn phần nào cải thiện độ rủi ro khi giao dịch trên thị trường chứng khoán<br>Lưu ý: Mọi thông tin trên trang web chỉ mang tính chất tham khảo cần cân nhắc trước khi thực hiện giao dịch</p>
      </transition>
      <button id="button_router_mobile" @click="$router.push('/login')">Bắt đầu</button>
    </div>

    <div id="div_text_pc" v-if="isPC">
      <p id="p_title_pc">Trang web dự báo chứng khoán hàng đầu Việt Nam</p>
      <transition name="bounce" appear>
        <p id="p_text_pc" v-if="show">Bạn đang muốn đến với thị trường chứng khoán nhưng không biết bắt đầu từ đâu, bạn đầu tư chứng khoán nhưng đang xa bờ...<br>Hãy đến với chúng tôi - website dự báo chứng khoán bằng công nghệ trí tuệ nhân tạo, hứa hẹn phần nào cải thiện độ rủi ro khi giao dịch trên thị trường chứng khoán<br>Lưu ý: Mọi thông tin trên trang web chỉ mang tính chất tham khảo cần cân nhắc trước khi thực hiện giao dịch</p>
      </transition>
      <button id="button_router_pc" @click="$router.push('/login')">Bắt đầu</button>
    </div>

  </div>
</template>

<script>
import CreateSVG from './CreateSVG.vue'

export default {
  name: 'HomeSVG',
  components: {
    CreateSVG
  },
  mounted() {
    // console.log(window.innerWidth)
    // console.log(window.innerHeight)
    if (window.innerWidth<=1000) {
      this.isMobile = true
      this.isPC = false
    } else {
      this.isMobile = false
      this.isPC = true
    }
  },
  data() {
    return {
      show: true,
      isMobile: false,
      isPC: true,
      top_div: ""
    }
  }
}
</script>

<style>
.main_class {
  width: 100%;
  height: 100%;
}
#svgator {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #25256d;
}

#div_text_mobile{
  position: absolute;
  top: 25vh;
  width: 100%;
  height: 100%;
}

#div_text_pc{
  position: absolute;
  top: 60vh;
  width: 100%;
  height: 100%;
}

#button_router_mobile {
  position: relative;
  top: 10%;
  left: 50%;
  width: 120px;
  height: 55px;
  transform: translate(-50%, -50%);
  border-radius:20%;
  text-align: center;
  background-color: #F4D03F; 
  font-weight: bold;
  color: black; 
  border: 3px solid #008CBA;
  display: inline-block;
  font-size: 16px;
  transition-duration: 0.4s;
  cursor: pointer;
}

#button_router_pc {
  position: relative;
  top: 10%;
  left: 50%;
  width: 135px;
  height: 62px;
  transform: translate(-50%, -50%);
  border-radius:20%;
  text-align: center;
  background-color: #F4D03F; 
  font-weight: bold;
  color: black; 
  border: 3px solid #008CBA;
  display: inline-block;
  font-size: 16px;
  transition-duration: 0.4s;
  cursor: pointer;
}

#button_router:hover {
  background-color: #F5B041;
  color: blue;
}


#p_title_pc{
  position: relative;
  font-family: Times;
  color: #808B96;
  font-size: 2.0em;
  font-weight: 100;
  margin-bottom:0;
  margin-left: 2%
}

#p_text_pc {
  position: relative;
  font-family: Times;
  color: #808B96;
  font-size: 1.4em;
  margin-top:0;
  margin-left: 2%
}

#p_title_mobile{
  position: relative;
  font-family: Times;
  color: #808B96;
  font-size: 1.2em;
  font-weight: 100;
  margin-bottom:0;
  margin-left: 2%
}

#p_text_mobile{
  position: relative;
  font-family: Times;
  color: #808B96;
  font-size: 1.0em;
  margin-top:0;
  margin-left: 2%
}


.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

</style>
