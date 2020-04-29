<template>
  <div class="container">
    <div class="mb-2">
      <label for="edit-first-name">{{$t('firstName')}}:</label>
      <input name="edit-first-name" class="form-control" type="text" v-model="getUserMe.first_name">
    </div>
    <div class="mb-2">
      <label for="edit-last-name">{{$t('lastName')}}:</label>
      <input name="edit-last-name" class="form-control" type="text" v-model="getUserMe.last_name">
    </div>
    <!--
    <div class="mb-2">
      <label for="edit-phone-number">Phone number:</label>
      <input name="edit-phone-number" class="form-control" type="text" v-model="getUserMe.phone_num">
    </div>
    -->
    <div class="mb-2 float-right">
      <button class="btn btn-outline-primary" v-on:click="updateProfile">{{$t('save')}}</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import $i18n from "./../plugins/i18n.js";
import { mapActions, mapGetters } from 'vuex'

export default {
  name: "profileEdit",

  computed: {
    ...mapGetters(["getUserMe"])
  },

  created() {
    this.fetchUserMe()
  },

  data() {
    return {
      errors: {}
    }
  },

  methods: {
    ...mapActions(["fetchUserMe", "updateUser"]),
    updateProfile: async function () {
      this.updateUser({
        first_name: this.getUserMe.first_name,
        last_name: this.getUserMe.last_name,
      }).then(
        this.$router.push('/profile')
      ).catch(err => console.log(err))
    }
  }
}
</script>

<style>

</style>