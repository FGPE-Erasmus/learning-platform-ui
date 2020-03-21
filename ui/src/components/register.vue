<template>
  <div id="register" style="width: 100%;">
    <div class="container">
      <!-- Outer Row -->
      <div class="row justify-content-center">
        <div class="col-xl-10 col-lg-12 col-md-9">
          <div class="card o-hidden border-0 shadow-lg my-5">
            <div class="card-body p-0">
              <!-- Nested Row within Card Body -->
              <div class="row">
                <div class="col-lg-6 d-none d-lg-block bg-login-image"></div>
                <div class="col-lg-6">
                  <div class="p-5">
                    <div class="text-center">
                      <h1 class="h4 text-gray-900 mb-4">{{$i18n.t('register')}}</h1>
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
                      </div>
                      <div class="form-group">
                        <input
                          v-model="password"
                          type="password"
                          class="form-control form-control-user"
                          id="exampleInputPassword"
                          :placeholder="pa"
                        />
                      </div>
                      <button
                        class="btn btn-primary btn-user btn-block"
                      >{{$i18n.t('create_account')}}</button>
                    </form>
                    <hr />
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
</template>

<style>
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
      last_name: ""
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

    register: function() {
      let data = {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        password: this.password
        //confirm_password: this.confirm_password,
        //is_admin: this.is_admin
      };
      $store
        .dispatch("register", data)
        .then(() => this.$router.push("/"))
        .catch(err => console.log(err));
    }
  }
};
</script>