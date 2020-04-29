<template>
    <div id="main" style="display:flex;width:100%">
        <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
            <a class="sidebar-brand d-flex" href="/">
                <div class="sidebar-brand-icon">
                    <i class="fas fa-terminal"></i>
                </div>
                <div class="sidebar-brand-text mx-3">FGPE</div>
            </a>
            <div v-if="loading_projects" class="d-flex justify-content-center">
                    <spinner></spinner>
            </div>
            
            <!--{{$store.state.exercisesWithinModule}}-->
	        <li class="nav-item">
                <router-link :to="{'name': 'projectsList'}" class="nav-link">{{$t('courses')}}</router-link>
            </li>
            
            <div class="border rounded m-1">
                <li class="nav-item" v-for="lesson in lessons" :key="lesson.id">
                    <a exact class="nav-link" href="#" data-toggle="collapse" :data-target="'#collapse'+lesson.id" aria-expanded="true" :aria-controls="'collapse'+lesson.id">
                        {{ lesson.name }}
                    </a>

                    <div :id="'collapse'+lesson.id" class="collapse hide"  data-parent="#accordionSidebar">
                        <div class="bg-white py-2 collapse-inner rounded">
                            <div>
                                <router-link :to='"/projects/"+project.id+"/exercises/"+exercise.id' v-for="(exercise, index) in getExercisesByModule(lesson.name)" :key="exercise.id" class="exercise collapse-item" exact-active-class="active" exact v-on:click.native="changeExerciseIndex(index,lesson.name)"
                                style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                    <div v-if="$store.state.courses.course.exercises != null" class="exercises"> 
                                        <span v-if="exercise.solved === false || exercise.solved === undefined" class="dot mr-2" style="background-color: red;"></span>
                                        <span v-if="exercise.solved === true" class="dot mr-2" style="background-color: green;" ></span>
                                        {{ exercise.title }}
                                    </div>
                                    <div v-else class="exercises">
                                        {{ exercise.title }}
                                    </div>
                                </router-link>
                            </div>
                            <!-- If we will use GamificationLayers do it here
                            <div v-else>
                                <router-link>
                                </router-link>
                            </div>
                            --->
                        </div>
                    </div>
                </li>
            </div>
        </ul>
        
        <div class="container-fluid">
            <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
                <img src="./packages/img/logo2.svg" style="max-width:45px;width:100%" class="mr-2">
                <div style="height:45px">
                    <h1 v-if="project" class="h6 text-gray-800">{{$t('project')}}: {{project.name}}</h1>
                    <h1 v-if="route" class="h6 text-gray-800 ">{{$t('module')}}: {{module_name}}</h1>
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
                            <div class="text-xs font-weight-bold text-info text-uppercase mb-1">{{$t('progress')}}
                                <div class="row no-gutters align-items-center">
                                    <div class="col-auto">
                                        <div v-if="exercisesAmount != 0" class="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                                            {{prog}}%
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="progress progress-sm mr-2">
                                            <div class="progress-bar bg-info" role="progressbar" :style="{ width: prog + '%' }" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>      
                </li>   

                <li class="nav-item dropdown no-arrow">
                    <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span class="mr-2 d-none d-lg-inline text-gray-600 small">{{ this.getUserMe.first_name }} {{ this.getUserMe.last_name }}</span>
                        <i class="fas fa-user fa-lg fa-fw mr-2" style="color:#878c89;"></i>
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
import { mapGetters, mapActions } from "vuex"

export default {
  name: 'App',

  created() {  
    this.setData()
  },

  data() {
    return {
        projects: [],
        project: null,
        exercises: [],
        lessons: [],
        loading_lessons: false,
        loading_projects: false,
        project_name: '',
        course: null,
        progress: 0,
        exercisesSolvedAmount: 0,
        exercisesAmount: 0,
    }
  },
  components:{
    spinner,
  },

  mounted(){
      this.lang();
  },

  computed: {
    ...mapGetters(["getUserMe"]),

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
    },
    prog: function(){
        if(this.exercisesSolvedAmount / this.exercisesAmount * 100 > 100){
            return 100
        }else{
            return Math.round(this.exercisesSolvedAmount / this.exercisesAmount * 100)
        }
    }
  },

  methods: {
    ...mapActions(["updateUser", "fetchUserMe", "fetchCourse", "fetchUserCourses", "updateExerciseTime"]),

    setData: async function() {
        await this.fetchUserMe()

        if(localStorage.getItem('exerciseId') != null && localStorage.getItem('seconds') != null && $store.getters.getUserMe.id == localStorage.getItem('fgpeId')){
            this.updateTime()
        } 

        let projectId = $store.getters.getUserMe.selected_project
        await this.fetchCourse(projectId)
        
        if (projectId) {
            this.project = await this.getProject(projectId)

            if (this.project.countGamificationLayers > 0) {
                this.getLessons(this.project.id, this.project.name, this.project)
            } else {
                this.getModules(this.project.id)
            }
            this.getModules(projectId)
        }
    },


    getProject: async function(id) {
        const response = await axios.get(`/project/${id}`)

        return response.data
    },

    getExercises: async function (id) {
        const response = await axios.get(`exercises/${id}`)
        let exercisesSolved = 0
        
        for(let i = 0; i < response.data.length; i++){
            for(let j = 0; j < $store.state.courses.course.exercises.length; j++){
                if(response.data[i].id == $store.state.courses.course.exercises[j].platform_course_exercise_id){
                    response.data[i].solved = $store.state.courses.course.exercises[j].solved
                    response.data[i].started = $store.state.courses.course.exercises[j].started
                }
            }
            if(response.data[i].solved === undefined && response.data[i].started === undefined){
                response.data[i].solved = false
                response.data[i].started = false
            }
            if(response.data[i].solved === true){
                exercisesSolved++
            }
        }
        this.$data.exercisesSolvedAmount = exercisesSolved
        this.$data.exercisesAmount = response.data.length
        this.$data.progress = exercisesSolved / response.data.length * 100
        return response.data
    },

    getModules: async function (id) {
        this.exercises = await this.getExercises(id)
        
        this.lessons = []
        let counter = 1
        for (let index = 0; index < this.exercises.length; index++) {
            let projectModule = {name: this.exercises[index].module, id: counter}
            if (!this.containsByName(this.lessons, projectModule.name)) {
                this.lessons.push(projectModule)
                counter++
            }
        }
        this.lessons.sort(function(a, b) {
            return parseFloat(a.name.charAt(0)) - parseFloat(b.name.charAt(0));
        });
    },

    getExercisesByModule: function (moduleName) {
        let exercises = []

        for (let index = 0; index < this.exercises.length; index++) {
            if (this.exercises[index].module === moduleName) {
                exercises.push(this.exercises[index])
            }
        }
        exercises.sort(function(a, b) {
            return parseFloat(a.title.charAt(0)) - parseFloat(b.title.charAt(0));
        });
        this.changeExerciseIndexRefresh(this.module_name)
        return exercises
    },

    containsByName: function (a, obj) {
        let i = a.length;
        while (i--) {
            if (a[i].name === obj) {
                return true
            }
        }

        return false
    },

    updateProject: function(name,id){
        localStorage.setItem("project", name);
        $store.state.project = name 
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
          this.$router.push('/login')
        })
    },

    updateLesson(name){
        $store.state.lesson = name;
    },
    
    getLessons: function (id) {
        axios.get(`gamification-layers/${id}`).then(response => {
            this.lessons = response.data
        })
    },

    changeExerciseIndex: function(index,name){
        let context = this

        $store.state.moduleIndex = name
        let exercisesInModule = []
        
        for(let i=0; i<this.exercises.length; i++){
            if(this.exercises[i].module === name){
                exercisesInModule.push(this.exercises[i])
            }
        }
        
        $store.state.exercisesWithinModule = exercisesInModule
        $store.state.exerciseIndex = index
    },

    changeExerciseIndexRefresh: function(name){
        let context = this
        let index = 0
        
        $store.state.moduleIndex = name
        let exercisesInModule = []
        
        for(let i = 0; i < this.exercises.length; i++){
            if(this.exercises[i].module === name){
                exercisesInModule.push(this.exercises[i])
            }
        }

        exercisesInModule.sort(function(a, b) {
            return parseFloat(a.title.charAt(0)) - parseFloat(b.title.charAt(0));
        });

        for(let j = 0; j < exercisesInModule.length; j++){
            if(exercisesInModule[j].id === this.$route.params.exercisesId){
                index = j
            }
        }
        $store.state.exercisesWithinModule = exercisesInModule
        $store.state.exerciseIndex = index
    },

    updateTime: function(){
        this.updateExerciseTime({ exerciseId: localStorage.getItem('exerciseId'), seconds: Number(localStorage.getItem('seconds')) })
        localStorage.removeItem('exerciseId')
        localStorage.removeItem('seconds')
        localStorage.removeItem('fgpeId')
    }

  },
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
  height: max-content;
}
#main{
    height: max-content;
}
#accordionSidebar{
    min-height: 100vh;
}
.menu_span{padding-left: 10px;}

.dot {
  height: 10px;
  width: 10px;
  /*background-color: red;*/
  border-radius: 50%;
  display: inline-block;
}

#project-name-menu {
    font-weight: bold;
    color: white;
}

.exercises{
    white-space: nowrap;
    overflow: hidden; 
    text-overflow: ellipsis;
}

</style>

<style lang="scss">
$fa-font-path: "~@fortawesome/fontawesome-free/webfonts";
@import "~@fortawesome/fontawesome-free/scss/fontawesome";
@import "~@fortawesome/fontawesome-free/scss/solid"; // fas
@import "~@fortawesome/fontawesome-free/scss/regular"; // far
@import "~@fortawesome/fontawesome-free/scss/brands"; // fab
</style>