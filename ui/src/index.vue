<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style>

</style>

<script>

import login from './components/login.vue'

export default {
  name: "index",

  components:{
    login,
  },
}
</script>