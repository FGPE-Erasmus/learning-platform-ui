<template>
  <div id="login" style="width: 100%;">
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
                    <h1 class="h4 text-gray-900 mb-4">{{$i18n.t('welcome')}}</h1>
                  </div>
                  <form class="user" @submit.prevent="login">
                    <div class="form-group">
                      <input v-model="email" type="text" class="form-control form-control-user" id="exampleInputEmail" aria-describedby="emailHelp" :placeholder=em>
                    </div>
                    <div class="form-group">
                      <input v-model="password" type="password" class="form-control form-control-user" id="exampleInputPassword" :placeholder=pa>
                    </div>
                    <button class="btn btn-primary btn-user btn-block">
                      {{$i18n.t('login')}}
                    </button>
                  </form>
                  <hr>
                  <div class="text-center">
                    <a class="small" href="/register">{{$i18n.t('create_account')}}</a>
                  </div>
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
import $store from "./../store/store";
import $i18n  from "./../plugins/i18n.js"

export default {
  name: "login",
  data() {
    return {
      email: "",
      password: ""
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

    changeLanguage: function(){
        
        if($i18n.locale == 'en'){
           $i18n.locale = 'pl' 
        }else{
            $i18n.locale = 'en'
        }
    },

    login: function() {
      let email = this.email 
      let password = this.password

      $store.dispatch('login', { email, password }).then(() => {
        this.$router.push("/projects");
      });
    }
  }
};
</script>