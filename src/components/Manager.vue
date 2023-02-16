<template>
    <div id="body_div_manager">

        <b-sidebar
          id="sideBar"
          type="is-white"
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
              <b-menu-list label="Quản trị">

                <b-menu-item icon="id-card" label="Danh sách người dùng" @click="userShow(); getUserInfo()" :active=true></b-menu-item>
                <!-- <b-menu-item icon="key" label="Thay đổi thông tin" @click="changePassShow()"></b-menu-item> -->
              </b-menu-list>


              <b-menu-list label="Hành động">
                <b-menu-item icon="home" label="Trang chủ" @click="router_homePage"></b-menu-item>
                <b-menu-item icon="door-open" label="Đăng xuất" @click="logout()"></b-menu-item>
              </b-menu-list>
            </b-menu>
          </div>
        </b-sidebar>

        <div id="divTable" v-show="true">
            <b-tabs type="is-boxed" @input="reload_list_user_when_click_table" v-model="tab_info">
                <b-tab-item label="Users">
                    <b-table
                        :data="data"
                        :paginated="isPaginated"
                        :per-page="perPage"
                        :current-page.sync="currentPage"
                        :pagination-simple="isPaginationSimple"
                        :pagination-position="paginationPosition"
                        :default-sort-direction="defaultSortDirection"
                        :pagination-rounded="isPaginationRounded"
                        :sort-icon="sortIcon"
                        :sort-icon-size="sortIconSize"
                        default-sort="user.first_name"
                        aria-next-label="Next page"
                        aria-previous-label="Previous page"
                        aria-page-label="Page"
                        aria-current-label="Current page"
                        :page-input="hasInput"
                        :pagination-order="paginationOrder"
                        :page-input-position="inputPosition"
                        :debounce-page-input="inputDebounce"
                        :hoverable="true"
                        @click.native="showSelected()"
                        :selected.sync="selected"
                        focusable>

                        <b-table-column field="id" label="STT" width="40" sortable numeric v-slot="props">
                            {{ props.row.id }}
                        </b-table-column>

                        <b-table-column field="name" label="Tên người dùng" width="250" sortable :searchable="true" v-slot="props">
                            {{ props.row.name }}
                        </b-table-column>

                        <b-table-column field="user" label="Tên đăng nhập" sortable :searchable="true" v-slot="props">
                            {{ props.row.user }}
                        </b-table-column>

                        <b-table-column field="email" label="Email" sortable :searchable="true" v-slot="props">
                            {{ props.row.email }}
                        </b-table-column>

                        <b-table-column field="active" label="Xác nhận" width="100" centered sortable :searchable="true"  v-slot="props">
                            <span :class="props.row.active === 'yes' ? 'tag is-success' : 'tag is-danger'">
                                {{ props.row.active }}
                            </span>
                        </b-table-column>

                        <b-table-column field="type_user" label="Dạng tài khoản" width="150" centered sortable :searchable="true"  v-slot="props">
                            <span :class="props.row.type_user == 1 ? 'tag is-success' : 'tag is-danger'">
                                {{ props.row.type_user }}
                            </span>
                        </b-table-column>

                        <b-table-column field="create_date" label="Ngày tạo" sortable centered v-slot="props">
                            <span class="tag is-success">
                                {{ props.row.create_date }}
                            </span>
                        </b-table-column>
                    </b-table>
                </b-tab-item>
                <b-tab-item label="Selected">
                    <b-message id="idMessageInTab"
                        title="Thông tin tài khoản" 
                        type="is-primary"
                        :closable=false>
                            <b-table :data="dataTableUser" :columns="columns"></b-table>
                    </b-message>
                </b-tab-item>

                <b-tab-item label="Update">
                    <b-message id="idMessageInTab"
                        title="Cập nhật thông tin" 
                        type="is-primary"
                        :closable=false>
                              <b-field label="Name">
                                  <b-input v-model="name_change" maxlength="24"></b-input>
                              </b-field>

                              <b-field label="Email">
                                  <b-input type="typeEmail"
                                      v-model="email_change"
                                      value=""
                                      maxlength="48">
                                  </b-input>
                              </b-field>

                              <b-field label="Username">
                                  <b-input v-model="user_change" value="" maxlength="16"></b-input>
                              </b-field>

                              <b-field label="Password">
                                  <b-input type="password"
                                      v-model="pass_change"
                                      value=""
                                      maxlength="32"
                                      password-reveal>
                                  </b-input>
                              </b-field>
                              <b-field label="Active">
                                  <b-input v-model="active_change" value="" maxlength="16"></b-input>
                              </b-field>
                              <b-field label="Type user">
                                  <b-input v-model="user_type_change" value="" maxlength="16"></b-input>
                              </b-field>
                              <b-field>
                                  <b-button type="is-warning" expanded @click="admin_update_user_info">Update</b-button>
                              </b-field>
                    </b-message>
                </b-tab-item>

                <b-tab-item label="Delete">
                    <b-message id="idMessageInTab"
                        title="Xoá tài khoản" 
                        type="is-primary"
                        :closable=false>
                              <b-field>
                                  <b-button type="is-danger" expanded @click="admin_delete_user">Delete this user</b-button>
                              </b-field>
                    </b-message>
                </b-tab-item>
            </b-tabs>
        </div>
            
        <CheckToken ref="checkTokenRef" />
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import CheckToken from './CheckToken.vue'
import axios from 'axios'
    export default {
        components: {
            CheckToken,
        },
        computed: {
            ...mapGetters(["status_login", "user", "token", "activate_user"])
        },
        mounted() {
            try {
              this.$refs.checkTokenRef.setFunctionInterval()
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
                  this.$alert("Something went wrong", "Error", "error");
                } else {
                  if (response.data.type_user==1) {
                    this.isAdmin=true
                    this.get_all_user_info()
                  } else {
                    this.isAdmin=false
                    this.logout()
                  }
                }
              })
            } catch {
              this.isAdmin=false
              this.logout()
            }
            
        },
        methods: {
            ...mapMutations(["setStatus", "setToken", "setUser", "setActivateUser"]),
            get_all_user_info() {
                if (this.isAdmin==true) {
                    axios.post('_adminlistuser_/', {
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
                        if (response.data.status!="ok") {
                          this.logout()
                          this.$alert("Something went wrong", "Error", "error");
                        } else {
                          this.data = response.data.data_user
                        }
                    })
                } else {
                  this.$alert("You must be admin to use this page", "Error", "error");
                }
            },
            reload_list_user_when_click_table() {
                if (this.tab_info==0){
                    this.get_all_user_info()
                }
            },
            showSelected(){
                this.dataTableUser = [
                        {'field': 'Tên người dùng:  ', 'name': this.selected.name },
                        {'field': 'Tên tài khoản:  ', 'name': this.selected.user },
                        {'field': 'Email:  ', 'name': this.selected.email },
                        {'field': 'Mật khẩu:  ', 'name': this.selected.pass },
                        {'field': 'Kích hoạt tài khoản:  ', 'name': this.selected.active },
                        {'field': 'Loại tài khoản:  ', 'name': this.selected.type_user },
                        {'field': 'Ngày tạo tài khoản:  ', 'name': this.selected.create_date },
                        {'field': 'Token:  ', 'name': this.selected.token },
                ]
                this.name_change = this.selected.name
                this.user_change = this.selected.user
                this.pass_change = this.selected.pass
                this.email_change = this.selected.email
                this.active_change = this.selected.active
                this.user_type_change = this.selected.type_user
            },
            logout() {
              this.$refs.checkTokenRef.logout()
            },
            clearIntervalToken() {
              this.$refs.checkTokenRef.clearIntervalFunction()
            },
            router_homePage() {
              this.clearIntervalToken()
              this.$router.push('/')
            },
            admin_delete_user() {
                if (this.isAdmin==true) {
                    axios.post('_admindeleteuser_/', {
                        security: {
                          data: "form",
                          type: "json",
                          author: "lamdz"
                        },
                        data: {
                          user_admin: this.user,
                          token_admin: this.token,
                          delete_user: this.user_change
                        }
                    }).then((response) => {
                        if (response.data.status!="ok") {
                          //this.logout()
                          this.$alert("Delete error!", "Error", "error");
                        } else {
                          this.$alert("Success!", "Success", "success");
                        }
                    })
                }
            },
            admin_update_user_info() {
                if (this.isAdmin==true) {
                    axios.post('_adminchangeinfo_/', {
                        security: {
                          data: "form",
                          type: "json",
                          author: "lamdz"
                        },
                        data: {
                          user_admin: this.user,
                          token_admin: this.token,
                          name_change: this.name_change,
                          user_change: this.user_change,
                          pass_change: this.pass_change,
                          email_change: this.email_change,
                          type_user_change: this.user_type_change,
                          active_change: this.active_change
                        }
                    }).then((response) => {
                        if (response.data.status!="ok") {
                          //this.logout()
                          this.$alert("Invalid update", "Error", "error");
                        } else {
                          this.$alert("Success!", "Success", "success");
                        }
                    })
                }
            }
        },

        data() {
            return {

                tab_info: 0,
                open: true,
                overlay: false,
                fullheight: true,
                fullwidth: false,
                right: false,
                isAdmin: false,
                dataTableUser: [],

                name_change: "",
                user_change: "",
                pass_change: "",
                email_change: "",
                active_change: "",
                user_type_change: "",

                isPaginated: true,
                isPaginationSimple: false,
                isPaginationRounded: false,
                paginationPosition: 'bottom',
                defaultSortDirection: 'asc',
                sortIcon: 'arrow-up',
                sortIconSize: 'is-small',
                currentPage: 1,
                perPage: 15,
                hasInput: false,
                paginationOrder: '',
                inputPosition: '',
                inputDebounce: '',


                data: [],
                selected: {},

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

            }
        }
    }
</script>

<style scope>
#body_div_manager {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url("../../public/backgroud_info.jpg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
}
#divTable {
    position: absolute;
    width: 100%;
    padding-top: 2%;
    padding-left: 280px;
    padding-right: 1%
}
#idMessageInTab {
    position: relative;
    padding-left: 1%;
    width: 700px;
    height: 60%;
    left: 50%;
    margin-top: 26%;
    transform: translate(-50%, -50%);
}
</style>