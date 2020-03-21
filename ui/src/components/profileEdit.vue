<template>
  <div class="container">
    <div class="mb-2">
      <label for="edit-first-name">First name:</label>
      <input name="edit-first-name" class="form-control" type="text" v-model="getUserMe.first_name">
    </div>
    <div class="mb-2">
      <label for="edit-last-name">Last name:</label>
      <input name="edit-last-name" class="form-control" type="text" v-model="getUserMe.last_name">
    </div>
    <div class="mb-2">
      <label for="edit-phone-number">Phone number:</label>
      <input name="edit-phone-number" class="form-control" type="text" v-model="getUserMe.phone_num">
    </div>
    <div class="mb-2 float-right">
      <button class="btn btn-outline-primary" v-on:click="updateProfile">Save</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
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
    ...mapActions(["fetchUserMe"]),
    updateProfile: async function () {
      const response = await axios
        .patch(`/users/${this.getUserMe.id}`, {
          first_name: this.getUserMe.first_name,
          last_name: this.getUserMe.last_name,
          phone_num: this.getUserMe.phone_num
        })
        .then(response => {
          this.$router.push({ name: 'profile' })
        })
        .catch(err => {
          this.errors = err
        })
    }
  }
}
</script>

<style>

</style>