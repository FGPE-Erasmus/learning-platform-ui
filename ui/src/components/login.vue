<template>
  <div id="login" style="width: 100%;background-color: #428bca;">
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
                  <form class="user" @submit.prevent="login">
                    <div class="errors">
                      <ul v-if="errors.errors">
                        <li v-for="error in errors.errors" :key="error">{{ $i18n.t(error) }}</li>
                      </ul>
                    </div>
                    <div class="form-group">
                      <input v-model="email" type="text" class="form-control form-control-user" id="exampleInputEmail" aria-describedby="emailHelp" :placeholder=em>
                      <div class="errors">
                        <ul v-if="errors.username">
                          <li v-for="error in errors.username" :key="error">{{ $i18n.t(error) }}</li>
                        </ul>
                      </div>
                    </div>
                    <div class="form-group">
                      <input v-model="password" type="password" class="form-control form-control-user" id="exampleInputPassword" :placeholder=pa>
                      <div class="errors">
                        <ul v-if="errors.password">
                          <li v-for="error in errors.password" :key="error">{{ $i18n.t(error) }}</li>
                        </ul>
                      </div>
                    </div>
                    <button class="btn btn-primary btn-user btn-block">
                      {{$i18n.t('login')}}
                    </button>
                  </form>
                  <hr>
                  <button class="btn btn-outline-primary btn-user btn-block" v-on:click="microsoftSignIn">
                    <span>{{$i18n.t('login_microsotf')}}</span>
                    <i class="ml-2 fab fa-windows"></i>
                  </button>
                  <hr>
                  <div class="row">
                    <div class="col-sm-6 text-center">
                      <button class="dropdown-item" v-on:click="changeLanguage()">
                        <i class="fas fa-exchange-alt mr-2 text-gray-400"></i>
                        {{$i18n.t('languague_change')}}
                      </button>
                    </div>
                    <div class="col-sm-6 text-center">
                        <a class="dropdown-item medium" style="color:blue" href="/register">{{$i18n.t('create_account')}}</a>
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

  </div>
</template>

<style>
/*
.login {
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 10px;
}
*/
</style>

<script>
import axios from "axios";
import $store from "./../store/store";
import $i18n  from "./../plugins/i18n.js"
import { mapGetters, mapActions } from "vuex"

export default {
  name: "login",

  data() {
    return {
      email: "",
      password: "",
      errors: {}
    };
  },

  computed: {
    em: function(){
        return $i18n.t('enter_email')
    },
    pa: function(){
        return $i18n.t('password')
    },
  },

  methods: {
    ...mapActions(["fetchUserMe", "updateUser"]),

    changeLanguage: function(){
      if($i18n.locale == 'en'){
        $i18n.locale = 'pl'
      }else{
        $i18n.locale = 'en'
      }
    },

    isLoginValid: function() {
      let isValid = true

      if (!this.email) {
        this.errors.username = ["cannot_be_null"]
        isValid = false
      }
      if (!this.password) {
        this.errors.password = ["cannot_be_null"]
        isValid = false
      }

      return isValid
    },

    login: function() {
      this.errors = {}
      let isValid = this.isLoginValid()

      if (isValid) {
        let username = this.email
        let password = this.password

        $store
          .dispatch('login', { username, password })
          .then(() => {
            this.$router.push(this.$route.query.redirect || '/')
          })
          .catch(err => {
            let errors

            if (err.response.status === 404) {
              errors = ["bad_username_or_password"]
            } else if (err.response.status ===  462) {
              errors = ["confirm_email"]
            } else {
              errors = ["request_bad"]
            }
            this.errors.errors = errors
            this.password = ''
          })
      }
    },

    microsoftSignIn: function() {
      axios.get('oauth/login/microsoft/').then(response => {
        window.location.href = response.data.url;
      })
    }
  }
};
</script>
