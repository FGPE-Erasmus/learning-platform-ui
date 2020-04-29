<template>
  <div id="register" style="width: 100%;background-color: #428bca;">
    <div class="container">
      <!-- Outer Row -->
      <div class="row justify-content-center">
        <div class="col-xl-6 col-lg-7 col-md-9 col-sm-12">
          <div class="card o-hidden border-0 shadow-lg my-5">
            <div class="card-body p-0">
              <!-- Nested Row within Card Body -->
              <div class="row">
                <div class="col-md-12">
                  <div class="p-5">
                    <div class="text-center">
                      <h1 class="h4 text-gray-900 mb-4">{{$i18n.t('pageTitle')}}</h1>
                    </div>
                    <form class="user" @submit.prevent="register">
                      <div class="form-group">
                        <input
                          v-model="first_name"
                          type="text"
                          class="form-control form-control-user"
                          id="exampleInputName"
                          aria-describedby="emailHelp"
                          :placeholder="en"
                        />
                        <ul v-if="errors.first_name">
                          <li class="form-error" v-for="error in errors.first_name" :key="error">{{ $i18n.t(error) }}</li>
                        </ul>
                      </div>
                      <div class="form-group">
                        <input
                          v-model="last_name"
                          type="text"
                          class="form-control form-control-user"
                          id="exampleInputSurname"
                          aria-describedby="emailHelp"
                          :placeholder="el"
                        />
                        <ul v-if="errors.last_name">
                          <li class="form-error" v-for="error in errors.last_name" :key="error">{{ $i18n.t(error) }}</li>
                        </ul>
                      </div>
                      <div class="form-group">
                        <input
                          v-model="email"
                          type="text"
                          class="form-control form-control-user"
                          id="exampleInputEmail"
                          aria-describedby="emailHelp"
                          :placeholder="ee"
                        />
                        <ul v-if="errors.username">
                          <li class="form-error" v-for="error in errors.username" :key="error">{{ $i18n.t(error) }}</li>
                        </ul>
                      </div>
                      <div class="form-group">
                        <input
                          v-model="password"
                          type="password"
                          class="form-control form-control-user"
                          id="exampleInputPassword"
                          :placeholder="pa"
                        />
                        <ul v-if="errors.password">
                          <li class="form-error" v-for="error in errors.password" :key="error">{{ $i18n.t(error) }}</li>
                        </ul>
                      </div>
                      <button
                        class="btn btn-primary btn-user btn-block"
                      >{{$i18n.t('create_account')}}</button>
                    </form>
                    <hr />
                    <div class="col-12 text-center">
                      <button class="dropdown-item" v-on:click="changeLanguage()">
                        <i class="fas fa-exchange-alt mr-2 text-gray-400"></i>
                        {{$i18n.t('languague_change')}}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.form-error {
  font-size: 87.5%;
}
</style>

<script>
import $store from "./../store/store";
import $i18n from "./../plugins/i18n.js";

export default {
  name: "register",
  data() {
    return {
      email: "",
      password: "",
      confirm_password: "",
      first_name: "",
      last_name: "",
      errors: {}
    };
  },

  computed: {
    en: function() {
      return $i18n.t("enter_name");
    },
    el: function() {
      return $i18n.t("enter_last");
    },
    ee: function() {
      return $i18n.t("enter_email");
    },
    pa: function() {
      return $i18n.t("password");
    }
  },

  methods: {
    changeLanguage: function() {
      if ($i18n.locale == "en") {
        $i18n.locale = "pl";
      } else {
        $i18n.locale = "en";
      }
    },

    checkRegisterForm: function(data) {
      this.errors = {}
      let isValid = true
      if (this.first_name === "") {
        this.errors.first_name = ["cannot_be_null"]
        isValid = false
      }
      if (this.last_name === "") {
        this.errors.last_name = ["cannot_be_null"]
        isValid = false
      }
      if (this.email === "") {
        this.errors.username = ["cannot_be_null"]
        isValid = false
      }
      if (this.password === "") {
        this.errors.password = ["cannot_be_null"]
        isValid = false
      }
      if (this.password.length < 8 || this.password.length > 64) {
        this.errors.password = ["password_length"]
        isValid = false
      }

      return isValid
    },

    register: function() {
      let isValid = this.checkRegisterForm()
      if (isValid === true) {
        let data = {
          first_name: this.first_name,
          last_name: this.last_name,
          username: this.email,
          password: this.password
          //confirm_password: this.confirm_password,
        };
        $store
          .dispatch("register", data)
          .then(() => {
            this.errors = {}
            this.$router.push("/login")
          })
          .catch(err => {
            if (err.response.status === 422) {
              this.errors.username = ['user_exist']
              this.password = ''
            } else if (err.response.status === 400) {
              this.errors = err.response.data
            }
          });
      }
    }
  }
};
</script>