<template>
    <div style="display:flex;width:100%;">
        <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
            <a class="sidebar-brand d-flex" href="/projects">
                <div class="sidebar-brand-icon">
                    <i class="fas fa-terminal"></i>
                </div>
                <div class="sidebar-brand-text mx-3">FGPE</div>
            </a>
            <div v-if="loading_projects" class="d-flex justify-content-center">
                    <spinner></spinner>
            </div>
            <li class="nav-item" v-for="project in projects" :key="project.id">
                <router-link v-if="project.countGamificationLayers > 0"   to="/projects" exact v-on:click.native="getLessons(project.id,project.name,project)" class="nav-link" href="#" data-toggle="collapse" :data-target="'#collapse'+project.id" aria-expanded="true" :aria-controls="'collapse'+project.id">
                  {{ project.name }}
                </router-link>

                <router-link v-else :to='"/projects/"+project.id'  class="nav-link"  data-toggle="collapse" exact v-on:click.native="updateProject(project.name,project.id)">
                    {{ project.name }}
                </router-link>

                <div :id="'collapse'+project.id" class="collapse hide"  data-parent="#accordionSidebar">
                    <div class="bg-white py-2 collapse-inner rounded">
                        <div v-if="loading_lessons" class="d-flex justify-content-center">
                            <spinner></spinner>
                        </div>
                        <router-link :to='"/projects/"+project.id+"/lessons/"+lesson.id' v-for="lesson in lessons" :key="lesson.id" class="collapse-item" style="  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" exact v-on:click.native="updateLesson(lesson.name)"> 
                        {{ lesson.name }}
                        </router-link>
                    </div>
                </div>
            </li>
        </ul>
        
        <div class="container-fluid">
            <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                <img src="./packages/img/logo2.svg" style="max-width:45px;width:100%" class="mr-2">
                <div v-if="route" style="height:45px">
                    <h1 class="h6 text-gray-800">{{$t('project')}}: {{project}}</h1>
                    <h1 class="h6 text-gray-800 ">{{$t('module')}}: {{module_name}}</h1>
                </div>
            
            <ul class="navbar-nav ml-auto">

                <li v-if="route_nochallenge" class="nav-item dropdown no-arrow">
                    <a class="nav-link dropdown-toggle" href="#" id="challenge" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span class="mr-2 d-none d-lg-inline text-gray-600 small">{{$t('challenge')}}:{{challenge}}</span>
                    </a>

                    <div class="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="challenge">
                        <h6 class="dropdown-header">
                          {{$t('challenge_description')}}
                        </h6>
                        <a class="dropdown-item d-flex align-items-center" href="#">
                            <div>
                                <span class="font-weight-bold">{{challenge_description}}</span>
                            </div>
                        </a>
                    </div>
                </li> 

                <li class="nav-item dropdown no-arrow" style="width:300px;">
                    <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-info text-uppercase mb-1">{{$t('tasks')}}
                                <div class="row no-gutters align-items-center">
                                    <div class="col-auto">
                                        <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">50%</div>
                                    </div>
                                    <div class="col">
                                        <div class="progress progress-sm mr-2">
                                            <div class="progress-bar bg-info" role="progressbar" style="width: 50%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>      
                </li>   

                <li class="nav-item dropdown no-arrow">
                    <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span class="mr-2 d-none d-lg-inline text-gray-600 small">{{$t('your_profile')}}</span>
                        <img class="img-profile rounded-circle" src="https://source.unsplash.com/QAB-WJcbgJk/60x60">
                   </a>
                  <!-- Dropdown - User Information -->
                    <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
                        <router-link :to="{ name:'profile' }" class="dropdown-item" >
                          <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                          {{$t('profile')}}
                        </router-link>
                        <a class="dropdown-item" href="#" v-on:click="changeLanguage()">
                          <i class="fas fa-exchange-alt mr-2 text-gray-400"></i>
                          {{$t('languague_change')}}
                        </a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal" v-on:click="logout()">
                          <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                          {{$t('logout')}}
                        </a>
                    </div>
                </li>
            </ul>
        </nav>
        <router-view :key="$route.fullPath"></router-view>
        </div>
    
    </div>
</template>

<script>
import axios from 'axios'
import $store from "./store/store"
import spinner from './components/spinner.vue'
import $i18n  from "./plugins/i18n.js"
import { mapActions } from 'vuex'

export default {
  name: 'App',

  data() {
    return {
        projects: [],
        lessons: [],
        loading_lessons: false,
        loading_projects: false,
        project_name: '',
    }
  },
  components:{
    spinner,
  },

  mounted(){
      this.getProject();
      this.lang();
  },

  computed: {
    project: function(){
        return ($store.state.project == '') ? localStorage.getItem("project") : $store.state.project
    },
    challenge: function () {
        return ($store.state.challenge == '') ? localStorage.getItem("challenge") : $store.state.challenge
    },
    challenge_description: function () {
        return ($store.state.challenge == '') ? localStorage.getItem("challenge") : $store.state.challenge
    },
    module_name: function(){
        return $store.state.module
    },
    route: function(){
        return (this.$route.path.includes('exercise')) ? true : false  
    },
    route_nochallenge: function(){
        return (this.$route.path.includes('challenge')) ? true : false
    },
    email: function(){
        return $store.state.email
    }
  },

  methods: {
    ...mapActions(["updateUser"]),

    updateProject: function(name,id){
        localStorage.setItem("project", name);
        $store.state.project = name 
    },

    sendtoapi: function(){
        axios({url: 'http://127.0.0.1:9000/api/createuser/', data: {email:'sada@gmail.com'},headers : {
                "Content-Type": "application/json",
                "Accept": "application/json",
            }, method: 'POST' })
        .then(resp => {
        })
    },

    getprofile: function(){
        axios({url: 'http://127.0.0.1:9000/api/createuser/', data: {email:'sada@gmail.com'},headers : {
                "Content-Type": "application/json",
                "Accept": "application/json",
            }, method: 'POST' })
        .then(resp => {
        })
    },

    changeLanguage: function(){
        if($i18n.locale == 'en'){
           $i18n.locale = 'pl'
           let lang_data = {
                interfaceLang: $i18n.locale
            }
            this.updateUser(lang_data)
        }else{
            $i18n.locale = 'en'
            let lang_data = {
                interfaceLang: $i18n.locale
            }
            this.updateUser(lang_data)
        }
    },

    lang: function(){
        $i18n.locale = localStorage.getItem('language');
    },

   logout: function(){
      $store.dispatch('logout')
        .then(() => {
          this.$router.push('/')
        })
    },

    updateLesson(name){
        $store.state.lesson = name;
    },

    getProject: function(){
      let context = this;
      context.$data.loading_projects = true;
      
        axios.get('/projects', {}).then(function(response) {
            context.$data.loading_projects = false;
            for (let i=0; i<response.data.length; i++) {
              context.projects.push(response.data[i]);
              context.projects[i]['lessons'] = [];
            }
        });
  },

    getLessons: function(id,name,project) {

      localStorage.setItem("project", name);

      $store.state.project = name;
      $store.state.project_id = id;
      this.$data.project_name = $store.state.project;

      let context = this;
      context.lessons = []
      context.$data.loading_lessons = true;

      axios.defaults.headers.common['project'] = id

      if (project.countGamificationLayers > 0) {
      
        axios.get('/gamification-layers', {}).then((response) => {
        context.$data.loading_lessons = false;
        for (let j=0; j < response.data.length; j++) {
          context.projects[j]['lessons'].push(response.data[j])
          context.lessons.push(response.data[j])
        };
        }); 

      } else {
        axios.get('/exercises?page=1&limit=6', {}).then(function(response) {
              context.$data.loading_exercises = false;
                for (let l = 0; l < response.data.data.length; l++){
                  let arr = context.lessons[number].exercise_ids;
                  if (arr.includes(response.data.data[l].id)){
                    context.exercises.push(response.data.data[l]);
                  }  
                };
            })  
      }
    }    
}
};

</script>

<style>

@import 'packages/sb-admin-2/sb-admin-2.css';

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  height: -webkit-fill-available;
}
.menu_span{padding-left: 10px;}

.dot {
  height: 10px;
  width: 10px;
  background-color: red;
  border-radius: 50%;
  display: inline-block;
}

</style>

<style lang="scss">
$fa-font-path: "~@fortawesome/fontawesome-free/webfonts";
@import "~@fortawesome/fontawesome-free/scss/fontawesome";
@import "~@fortawesome/fontawesome-free/scss/solid"; // fas
@import "~@fortawesome/fontawesome-free/scss/regular"; // far
@import "~@fortawesome/fontawesome-free/scss/brands"; // fab
</style>