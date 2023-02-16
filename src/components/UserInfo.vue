<template>
	<div id="UserInfoId">
    <div id="button_show_side_bar">
      <b-button size="is-small" icon-left="fa-bars" @click="show_side_bar()"> </b-button>
    </div>
  <section>
    <b-sidebar
      id="sideBar"
      type="is-white"
      :reduce="reduce_bar"
      :fullheight="fullheight"
      :fullwidth="fullwidth"
      :overlay="overlay"
      :right="right"
      v-model="open"
    >
      <div class="p-1">
        <img
          src="bogau.jpg"
          alt="Website dự báo chứng khoán Việt Nam"
        />
        <b-menu>
          <b-menu-list label="Danh sách">
            <b-menu-item icon="book" label="Giới thiệu" @click="hide_side_bar(); gioithieuShow()"></b-menu-item>

            <b-menu-item icon="id-card" label="Thông tin tài khoản" @click="hide_side_bar(); userShow(); getUserInfo()" :active=true></b-menu-item>
            <b-menu-item icon="key" label="Thay đổi mật khẩu" @click="hide_side_bar(); changePassShow()"></b-menu-item>
            
            
          </b-menu-list>


          <b-menu-list label="Hành động">
            <b-menu-item icon="home" label="Trang chủ" @click="router_homePage"></b-menu-item>
            <b-menu-item icon="door-open" label="Đăng xuất" @click="logout()"></b-menu-item>
            <b-menu-item icon="gear" label="Kích cỡ" @click="change_reduce()"></b-menu-item>
          </b-menu-list>
        </b-menu>
      </div>
    </b-sidebar>

    <div id="divInfoId" v-show="gioithieu_show">
      <b-tabs type="is-boxed" mobile-cards="true">
          <b-tab-item label="Nền tảng công nghệ" icon="gears" id="b_tabs_info" v-bind:style="{ height: max_Height_Tab}">
                <b-message 
                    title="Nền tảng công nghệ" 
                    type="is-success"
                    :closable=false>
                    Trang web này được tạo bởi nhiều công nghệ kỹ thuật cao bao gồm cả backend và frontend: <br/>
                    -  Về frontend, trang web được viết bằng framework vuejs, có sử dụng nhiều thư viện phục vụ cho quá trình thiết kế giao diện và vẽ biểu đồ chứng khoán. <br/>
                    -  Về backend là phần nòng cốt để xử lý dữ liệu cho trang web. Trang web chạy trên nền tảng nodejs, cơ sở dữ liệu mongodb cùng với nhiều công nghệ khác. Thêm vào đó, trang web đã tích hợp một số công nghệ về trí tuệ nhân tạo nói chung cũng như học máy và học sâu nói riêng để phân tích cũng như dự báo. <br/>
                </b-message>

                <b-message 
                    title="Giới thiệu về các mô hình được sử dụng trong trang web" 
                    type="is-danger"
                    :closable=false>
                    Chúng tôi đã áp dụng các công nghệ trí tuệ nhân tạo nhằm mục đích dự báo đường đi giá chứng khoán, trong đó sử dụng các mô hình CNN, GRU và LSTM:<br/>
                    - Mô hình mạng thần kinh tích chập (CNN): Đây là một mô hình học sâu tương đối tiên tiến hiện nay. Với độ chính xác cao, mô hình này đã giúp con người xây dụng nhiều hệ thống thông minh cũng như giải những bài toán hóc búa. Trong đó, nó sử dụng các lớp mạng thần kinh tích chập ẩn để nhận dạng cũng như tìm ra đặc điểm của mã chứng khoán. Và dựa trên cơ sở các hình thế xuất hiện, ta có thể đưa ra dự báo đường đi giá cả.<br/>
                    - Mô hình đơn vị cổng tái phát (GRU): Đây là một phần của mô hình mạng lưới thần kinh tái phát, nó sử dụng các kết nối thông qua một chuỗi các nút để thực hiện nhiệm vụ học máy liên quan đến bộ nhớ, để từ đó dự báo cho tương lai.<br/>
                    - Mô hình bộ nhớ dài ngắn hạn (LSTM): Đây là một mạng thần kinh nhân tạo sử dụng trong học sâu, không như các mạng thần kinh truyền thẳng bình thường, mô hình này còn có thể phản hồi ngược lại. Với dữ liệu theo chuỗi thời gian như chứng khoán thì mô hình này tương đối phù hợp để phân tích cũng như dự báo.<br/>
                </b-message>

                <b-message 
                    title="Lưu ý" 
                    type="is-warning"
                    :closable=false>
                    Trang web đang trong giai đoạn mới bắt đầu, còn cần tiếp tục sửa chữa và phát triển: <br/>
                    -  Về biểu đồ chứng khoán, trang web chưa được tích hợp nhiều chức năng và công cụ trong phân tích kỹ thuật. <br/>
                    -  Về mô hình dự báo, các mô hình đang được sử dụng trong trang web còn đang trong quá trình phát triển và đánh giá. Mọi thông tin về dự báo trên trang web này còn chưa được hoàn toàn chính xác, người sử dụng có thể tham khảo xu hướng chung của mô hình dự báo không nên quá chú trọng vào giá cả chính xác.<br/>
                    -  Trang web này chỉ mang tính chất tham khảo, chúng tôi sẽ không chịu trách nhiệm cho việc giao dịch của bạn.<br/>
                    -  Mọi thắc mắc xin gửi thư về địa chỉ email: dubaochungkhoan.24h@gmail.com 
                </b-message>
          </b-tab-item>


          <b-tab-item label="Về chúng tôi" icon="handshake" id="b_tabs_info" v-bind:style="{ height: max_Height_Tab}">
                <b-message 
                  title="Về chúng tôi" 
                  type="is-success"
                  :closable=false>
                  Trang web này thuộc quyền sở hữu của lamdz: <br/>
                  -  Thằng em mình học khí tượng, sinh năm 98. Tự mày mò học chứng khoán từ những năm 2015. Sáng thì đọc sách và tìm hiểu về thị trường, tối thì áp dụng phân tích kỹ thuật, cho đến giờ cũng tích lũy được kha khá kiến thức. Tuy chăm chỉ là vậy nhưng khi tiến vào thị trường vẫn thua lỗ đều đều. Nhận ra được điều đó, nó bắt đầu học code, nó muốn xây dụng một hệ thống AI để lấy lại những gì đã mất trên thị trường chứng khoán. Từ backend cho đến frontend, từ học máy cho đến học sâu, mọi thứ nó đều tìm tòi học hỏi. Đến giờ thì mọi thứ cũng dần trở thành hiện thực, giao dịch chứng khoán từ thua lỗ đều đều đã tiến tới dần có lãi. Nhưng nó vẫn chưa dừng lại, vẫn tiếp tục học hỏi để tiếp tục phát triển, cho đến khi trở thành ông trùm tài chính =))<br/>
              </b-message>
          </b-tab-item>
      </b-tabs>
    </div>


      <div id="divInfoId" v-show="user_show">
        <div id="thongtintaikhoanID" v-bind:style="{ height: max_Height_Info, width: max_Width_Info }">
          <b-message 
              title="Thông tin tài khoản" 
              type="is-dark"
              :closable=false>
                  <b-table :data="dataTableUser" :columns="columns"></b-table>
          </b-message>
        </div>
      </div>

      <div id="divInfoId" v-show="change_pass_show">
        <div id="changePassID" v-bind:style="{ height: max_Height_Pass}">
          <b-message 
              title="Thay đổi mật khẩu" 
              type="is-dark"
              :closable=false>
                  <b-field label="Mật khẩu cũ" :type="typeOldPass" :message="passOldMess">
                      <b-input type="password" placeholder="Nhập mật khẩu cũ" v-model="old_pass" maxlength="32"
                          password-reveal @change.native="check_old_pass(old_pass)">
                      </b-input>
                  </b-field>

                  <b-field label="Mật khẩu mới" :type="typeNewPass" :message="passNewMess">
                      <b-input type="password" placeholder="Nhập mật khẩu mới" v-model="new_pass" maxlength="32"
                          password-reveal @change.native="check_new_pass(new_pass); check_retype_pass(retype_pass)">
                      </b-input>
                  </b-field>

                  <b-field label="Nhập lại mật khẩu mới" :type="typeRetypePass" :message="passRetypeMess">
                      <b-input type="password" placeholder="Nhập lại mật khẩu mới" v-model="retype_pass" maxlength="32"
                          password-reveal @change.native="check_retype_pass(retype_pass)">
                      </b-input>
                  </b-field>
                  <b-button id="buttonChangePassId" type="is-warning" @click="handleChangePass" expanded>Xác nhận</b-button>
          </b-message>
        </div>
      </div>



    <CheckToken ref="checkTokenRef" />
  </section>
  <b-loading :is-full-page="true" v-model="isLoading" :can-cancel="false"></b-loading>

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
  mounted() {
    this.max_Height_Tab = String(window.innerHeight-280+"px")
    this.max_Height_Info = String(window.innerHeight-200+"px")
    this.max_Width_Info = String(window.innerWidth/1.2+"px")
    this.max_Height_Pass = String(window.innerHeight-200+"px")
    this.$refs.checkTokenRef.setFunctionInterval()
    if (this.status_login=="lmao"){
      this.getUserInfo()
    }
  },
  created() {
    window.addEventListener("resize", this.change_screen_size);
  },
	methods: {
		...mapMutations(["setStatus", "setToken", "setUser", "setActivateUser"]),
    gioithieuShow() {
      this.gioithieu_show=true
      this.user_show=false
      this.change_pass_show=false
    },
    change_screen_size() {
      this.max_Height_Tab = String(window.innerHeight-280+"px")
      this.max_Height_Info = String(window.innerHeight-200+"px")
      this.max_Width_Info = String(window.innerWidth/1.2+"px")
      this.max_Height_Pass = String(window.innerHeight-200+"px")
      console.log(this.max_Height_Tab, window.innerHeight)
      //console.log(window.innerWidth, window.innerHeight)
    },
    hide_side_bar() {
      this.open=false
    },
    show_side_bar() {
      this.open=true
      console.log("ok")
    },
    userShow() {
      this.gioithieu_show=false
      this.user_show=true
      this.change_pass_show=false
    },
    changePassShow() {
      this.gioithieu_show=false
      this.user_show=false
      this.change_pass_show=true
    },
    router_homePage() {
      this.clearIntervalToken()
      this.$router.push('/')
    },
    updateUserInfo(){
      this.dataTableUser = [
            {'field': 'Tên người dùng:  ', 'name': this.name_taikhoan },
            {'field': 'Tên tài khoản:  ', 'name': this.user },
            {'field': 'Email:  ', 'name': this.email_taikhoan },
            {'field': 'Trạng thái tài khoản:  ', 'name': this.status_taikhoan },
            {'field': 'Loại tài khoản:  ', 'name': this.type_taikhoan },
            {'field': 'Ngày tạo tài khoản:  ', 'name': this.date_taikhoan },
      ]
    },
    change_reduce() {
      this.reduce_bar = !this.reduce_bar
    },
    logout() {
      this.$refs.checkTokenRef.logout()
    },
    clearIntervalToken() {
      this.$refs.checkTokenRef.clearIntervalFunction()
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
    handleChangePass() {
      if (this.typeOldPass == "is-success" && this.typeNewPass == "is-success" && this.typeRetypePass == "is-success"){
          let string_old_pass = this.encodePass(this.old_pass)
          let string_new_pass = this.encodePass(this.new_pass)

          axios.post('_changepass_/', {
            security: {
              data: "form",
              type: "json",
              author: "lamdz"
            },
            data: {
              user: this.user,
              token: this.token,
              old_pass: string_old_pass,
              new_pass: string_new_pass
            }
          })
          .then((response) => {
            if (response.data.status == "ok") {
                this.$alert("Success!", "Success", "success");
            } else {
                this.$alert("Error, something went wrong!", "Error", "error");
            }
          })
      } else {
        this.$alert("Login error, username or password is invalid!", "Error", "error");
      }
    },
    check_old_pass(text){
      if (text.length<6) {
          this.typeOldPass = "is-danger"
          this.passOldMess = "Password must be at least 6 characters"
      } else {
          let regex = /^[a-zA-Z0-9]+$/
          if (regex.test(text)) {
              this.typeOldPass = "is-success"
              this.passOldMess = "Password is available"
          } else {
              this.typeOldPass = "is-danger"
              this.passOldMess = "Cannot use special characters"
          }
      }
    },
    check_new_pass(text){
      if (text.length<6) {
          this.typeNewPass = "is-danger"
          this.passNewMess = "Password must be at least 6 characters"
      } else {
          let regex = /^[a-zA-Z0-9]+$/
          if (regex.test(text)) {
              this.typeNewPass = "is-success"
              this.passNewMess = "Password is available"
          } else {
              this.typeNewPass = "is-danger"
              this.passNewMess = "Cannot use special characters"
          }
      }
    },
    check_retype_pass(text){
      if (text.length<6) {
          this.typeRetypePass = "is-danger"
          this.passRetypeMess = "Password must be at least 6 characters"
      } else {
          let regex = /^[a-zA-Z0-9]+$/
          if (regex.test(text)) {
              if (text==this.new_pass) {
                this.typeRetypePass = "is-success"
                this.passRetypeMess = "Password is available" 
              } else {
                this.typeRetypePass = "is-danger"
                this.passRetypeMess = "Retype password is not correct"
              }

          } else {
              this.typeRetypePass = "is-danger"
              this.passRetypeMess = "Cannot use special characters"
          }
      }
    },
    getUserInfo() {
      this.isLoading = true
      if (this.status_login=="lmao"){
        axios.post('_userinfo_/', {
          security: {
            data: "form",
            type: "json",
            author: "lamdz"
          },
          data: {
            user: this.user,
            token: this.token
          }
        })
        .then((response) => {
          if (response.data.check_info == "ok") {
              this.name_taikhoan = response.data.name
              this.email_taikhoan = response.data.email
              if (response.data.activate=="yes"){
                this.status_taikhoan = "Đã kích hoạt"
              } else {
                this.status_taikhoan = "Chưa kích hoạt"
              }
              if (response.data.type_user==2){
                this.type_taikhoan = "Thường"
              } else if (response.data.type_user==1){
                this.type_taikhoan = "Admin"
              } else {
                this.type_taikhoan = "Ai biết"
              }
              let date_tk = response.data.create_date
              this.date_taikhoan = date_tk.slice(6,8)+"/"+date_tk.slice(4,6)+"/"+date_tk.slice(0,4)
              this.updateUserInfo()

          } else {
              this.logout()
              this.$alert("Token expired", "Error", "error");
          }
          this.isLoading = false
        })
      }
    },
	},
  data() {
    return {
      max_Height_Tab: 500,
      max_Height_Info: 500,
      max_Width_Info: 500,
      max_Height_Pass: 500,

      isLoading: false,
      reduce_bar: false,

      open: false,
      overlay: false,
      fullheight: true,
      fullwidth: false,
      right: false,

      gioithieu_show: false,
      user_show: true,
      change_pass_show: false,

      old_pass: "",
      typeOldPass: "is-danger",
      passOldMess: "Password cannot be empty",

      new_pass: "",
      typeNewPass: "is-danger",
      passNewMess: "Password cannot be empty",

      retype_pass: "",
      typeRetypePass: "is-danger",
      passRetypeMess: "Password cannot be empty",

      name_taikhoan: "",
      email_taikhoan: "",
      status_taikhoan: "",
      type_taikhoan: "",
      date_taikhoan: "",
      dataTableUser: [],
      columns: [
          {
              field: 'field',
              label: '',
          },
          {
              field: 'name',
              label: '',
          }
      ]
      
    };
  }
}

</script>


<style scope>
#b_tabs_info {
  overflow-y: auto;
}
#UserInfoId {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: url("../../public/backgroud_info.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}
#button_show_side_bar {
  position: relative;
  padding-top: 0.5%;
  padding-left: 0.7%;
  padding-bottom: 0.7%;
}
#divInfoId {
  position: absolute;
  width: 100%;
  padding-top: 2%;
  padding-left: 1%;
  padding-right: 1%;
}
#sideBar {
  height: 100%
}
#thongtintaikhoanID {
  position: relative;
  padding-left: 1%;
  left: 50%;
  margin-top: 42vh;
  transform: translate(-50%, -50%);
  overflow-y: auto;
}
#changePassID {
  position: relative;
  padding-left: 1%;
  width: 300px;
  left: 50%;
  margin-top: 42vh;
  transform: translate(-50%, -50%);
  overflow-y: auto;
}
#buttonChangePassId {
  margin-top: 6%;
}

</style>


