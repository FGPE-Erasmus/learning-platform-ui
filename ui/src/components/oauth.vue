<template>
  <div class="loading">
    <Spinner />
  </div>
</template>

<script>
import axios from 'axios';
import $store from "./../store/store";

import Spinner from './spinner';

export default {
  name: 'oatuh',

  components: {
    Spinner
  },

  created() {
    if (this.$route.query.code && this.$route.params.platform === 'microsoft') {
      axios.get(`oauth/callback/microsoft/?code=${this.$route.query.code}`).then(resp => {
        $store.dispatch('oauthLogin', resp.data);
        this.$router.push('/');
      })
    }
  }
}
</script>

<style scoped>
.loading {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>