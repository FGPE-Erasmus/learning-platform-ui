<template>
  <div id="login" style="width: 100%;">
    <div class="container">
      <div class="d-flex justify-content-center">
        <div v-if="status === true">
          <span>Your user is active now!</span>
          <router-link :to="{ name: 'login' }" class="btn btn-primary btn-user btn-block">
            {{$i18n.t('login')}}
          </router-link>
        </div>
        <div v-else-if="status === false">
          <span>Ups! Token is not valid</span>
        </div>
        <div v-else>
          <spinner></spinner>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import spinner from './spinner.vue'

export default {
  name: 'emailConfirmation',

  created() {
    this.sendConfirmation()
  },

  components:{
    spinner,
  },

  data(){
    return {
      status: null
    }
  },

  methods: {
    sendConfirmation: function() {
      axios.post(`auth/confirmation/${this.$route.params.confirmToken}`).then(response => {
        if (response.status === 200) {
          this.status = true
        } else {
          this.status = false
        }
      }).catch(err => {
        this.status = false
      })
    }
  }
};
</script>

<style>
</style>