<template>
  <div>
    <div class="container-fluid">
      <div v-for="project in projects" :key="project.id" class="card shadow mb-4">
        <div class="card-header py-3">
          <h6 class="m-0 font-weight-bold text-primary">{{ project.name }}</h6>
        </div>
        <div class="card-body">
          <div class="mb-1">
            <span class="font-weight-bold">{{$t('description')}}: </span>
            <span>{{ project.description }}</span>
          </div>
          <div class="mb-1">
            <span class="font-weight-bold">{{$t('numberOfExercises')}}: </span>
            <span>{{ project.countExercises }}</span>
          </div>
          <div class="text-right">
            <button v-on:click="selectProject(project.id)" type="button" class="btn btn-outline-primary">Select</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import $i18n  from "./../plugins/i18n.js"

export default {
  name: 'projects',

  mounted() {
    this.getProject();
  },

  data() {
    return {
      loading_projects: false,
      projects: [],
    }
  },

  methods: {
    getProject: function() {
      this.loading_projects = true
      
      axios.get('projects/', {}).then(response => {
        this.loading_projects = false
        this.projects = response.data
      });
    },

    selectProject: function(id) {
      axios.post(`project/set/${id}`).then(response => {
        this.$parent.setData()
        this.$router.push(`projects/${id}/`)
      })
    }
  }
}
</script>

<style>
</style>