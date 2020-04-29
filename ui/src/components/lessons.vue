<template>
    <div>
        <div class="container-fluid mt-4">
            <div v-if="loading_challenges" class="d-flex justify-content-center">
                <spinner></spinner>
            </div>
            
            
                        <section v-if="lessons.length < 1" v-for="(exercise, index) in exercises" class="write-review py-5 bg-light" id="write-review">
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-md-5">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <h5>{{ exercise.title }}</h5>
                                        </div>
                                        <div class="col-md-12 text-warning">
                                            <div v-if="exercise.difficulty=='beginner'">
                                                <i class="fa fa-star"></i>{{ exercise.difficulty }}
                                            </div>
                                            <div v-else-if="exercise.difficulty=='easy'">
                                                <i class="fa fa-star"></i><i class="fa fa-star mr-1"></i> {{ $t('easy') }}
                                            </div>
                                            <div v-else-if="exercise.difficulty=='average'">
                                                <i class="fa fa-star"></i><i class="fa fa-star mr-1"></i><i class="fa fa-star mr-1"></i> {{ $t('average') }}
                                            </div>
                                            <div v-else-if="exercise.difficulty=='hard'">
                                                <i class="fa fa-star"></i><i class="fa fa-star mr-1"></i><i class="fa fa-star mr-1"></i><i class="fa fa-star mr-1"></i> {{ $t('hard') }}
                                            </div>
                                            <div v-else-if="exercise.difficulty=='master'">
                                                <i class="fa fa-star"></i><i class="fa fa-star mr-1"></i><i class="fa fa-star mr-1"></i><i class="fa fa-star mr-1"></i><i class="fa fa-star mr-1"></i> {{ $t('master') }}
                                            </div>
                                        </div>
                                    </div>
                                    <hr>
                                    {{$t('keywords')}}:
                                    <span v-for="keyword in exercise.keywords">{{keyword}}</span>
                                    <div>{{$t('module')}}: {{exercise.module}}</div>
                                </div>
                                <div class="col-md-7">
                                    <router-link :to='$route.path + "exercises/" + exercise.id' class="collapse-item btn btn-success" style="text-decoration:none;color:white;" exact v-on:click.native="changeExerciseIndex(exercise.title.charAt(0) - 1, exercise.module, index)">
                                        <i class="fas fa-running mr-1"></i>
                                        <span v-if="exercise.started === false || exercise.started === undefined">{{ $t('start') }}</span>
                                        <span v-if="exercise.started === true">{{ $t('continue') }}</span>
                                    </router-link>
                                </div>
                            </div>
                        </div>
                      </section><br/>
            
           
            <div v-if="lessons.length >0" class="card mb-4 py-3 border-bottom-info" v-for="lesson in lessons" :key="lesson.id">
                <div class="card-body">
                    <button style="padding-left:0px;" class="btn btn-link" v-on:click="getExercises(lesson.id,lessons.indexOf(lesson),lesson.name)" data-toggle="collapse" :data-target="'#lesson'+lesson.id">{{ lesson.name }}</button>
                    <div :id="'lesson'+lesson.id" class="collapse">
                        <div v-if="loading_exercises" class="d-flex justify-content-center">
                            <spinner></spinner>
                        </div>
                        <span v-for="exercise in exercises" :key="exercise.id">
                        <section class="write-review py-5 bg-light" id="write-review">
                        <div class="container">
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <h5>{{ exercise.title }}</h5>
                                        </div>
                                        <div class="col-md-6 text-warning">
                                            <div v-if="exercise.difficulty=='beginner'">
                                                <i class="fa fa-star"></i>{{ exercise.difficulty }}
                                            </div>
                                            <div v-else-if="exercise.difficulty=='easy'">
                                                <i class="fa fa-star"></i><i class="fa fa-star mr-1"></i> {{ $t('easy') }}
                                            </div>
                                            <div v-else-if="exercise.difficulty=='average'">
                                                <i class="fa fa-star"></i><i class="fa fa-star mr-1"></i><i class="fa fa-star mr-1"></i> {{ $t('average') }}
                                            </div>
                                            <div v-else-if="exercise.difficulty=='hard'">
                                                <i class="fa fa-star"></i><i class="fa fa-star mr-1"></i><i class="fa fa-star mr-1"></i><i class="fa fa-star mr-1"></i> {{ $t('hard') }}
                                            </div>
                                            <div v-else-if="exercise.difficulty=='master'">
                                                <i class="fa fa-star"></i><i class="fa fa-star mr-1"></i><i class="fa fa-star mr-1"></i><i class="fa fa-star mr-1"></i><i class="fa fa-star mr-1"></i> {{ $t('master') }}
                                            </div>
                                        </div>
                                    </div>
                                    <hr>
                                    {{$t('keywords')}}:
                                    <span v-for="keyword in exercise.keywords">{{keyword}}</span>
                                </div>
                                <div class="col-md-8">
                                    <button type="button" class="btn btn-success"><i class="fas fa-running mr-1"></i> 
                                        <router-link :to='$route.path+"/challenge/"+lesson.id+"/exercise/"+exercise.id' class="collapse-item" style="text-decoration:none;color:white;" v-on:click.native="updateLesson(lesson)"> 
                                            <span v-if="exerciseStatus === 'notStarted'">START</span>
                                            <span v-if="exerciseStatus === 'completed'">START</span>
                                            <span v-if="exerciseStatus === 'inProgress'">CONTINUE</span>
                                        </router-link>
                                    </button>
                                </div>
                            </div>
                        </div>
                        </section><br/>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import spinner from './../components/spinner.vue'
import $store from "./../store/store"
import $i18n  from "./../plugins/i18n.js"
import { mapActions, mapGetters } from 'vuex'


export default {
  name: 'Lessons',

  data() {
    return {
        lessons: [],
        exercises: [],
        loading_exercises: false,
        loading_challenges: false,
        exerciseStatus: 'notStarted',
    }
  },
  
  components:{
    spinner,
  },

  computed: mapGetters(["getCourse"]),

  created() {
    this.fetchCourse(this.$route.params.projectId)
  },

  mounted(){
    if(this.$route.path.includes('lessons')){
      this.getLessons()
    }else{
      this.getExercisesWithoutLessons()
    }
  },

  methods: {
    ...mapActions(['fetchCourse']),
    updateLesson(lesson){
        $store.state.challenge = lesson.name;
        $store.state.challenge_description = lesson.description;

        localStorage.setItem("challenge", lesson.name);
        localStorage.setItem("challenge_description", lesson.description);
    },

    getExercises(id,number,name){
      localStorage.setItem("challenge", name);

      this.exercises = [];
      let context = this;
      context.$data.loading_exercises = true;
      delete axios.defaults.headers.common['project']

      axios.get(`exercises/${this.$route.params.projectId}`, {

      }).then(function(response) {
          context.$data.loading_exercises = false
          $store.state.exercisesWithinChallenge = []
            for (let l = 0; l < response.data.length; l++){
              let arr = context.lessons[number].exercise_ids
              $store.state.exercisesWithinChallenge.push(response.data[l].title)
              if (arr.includes(response.data[l].id)){
                context.exercises.push(response.data[l])
              }  
            }; 
        })  
    },
    
    getExercisesWithoutLessons(){
      this.exercises = [];
      let context = this;
      context.$data.loading_exercises = true;

      let id = context.$route.params.projectId

      axios.get(`exercises/${id}`).then(function(response) {
          context.$data.loading_exercises = false;
          context.$data.exercises = response.data
          
          for(let i = 0; i < context.$data.exercises.length; i++){
            if(context.$store.state.courses.course.exercises[i] != undefined){
              context.$data.exercises[i].solved = context.$store.state.courses.course.exercises[i].solved
              context.$data.exercises[i].started = context.$store.state.courses.course.exercises[i].started
            }
          }

          context.$data.exercises.sort(function(a, b) {
              return parseFloat(a.title.charAt(0)) - parseFloat(b.title.charAt(0));
          });
          context.$data.exercises.sort(function(a, b) {
              return parseFloat(a.module.charAt(0)) - parseFloat(b.module.charAt(0));
          });
      })
    },
    
    getLessons(){
      let context = this;

      axios.get('challenges/' + context.$route.params.lessonsId, {
        
      }).then(function(response) {
          context.$data.loading_challenges = false;
          for (let l = 0; l < response.data.length; l++){  
            context.lessons.push(response.data[l]);
          };
        })  
      },

    changeExerciseIndex: function(index,name,oldIndex){
        let context = this
        $store.state.moduleIndex = name
        let exercisesInModule = []
        
        for(let i = 0; i < this.exercises.length; i++){
            if(this.exercises[i].module === name){
                exercisesInModule.push(this.exercises[i])
            }
        }
        
        $store.state.exercisesWithinModule = exercisesInModule
        if(isNaN(index)){
          $store.state.exerciseIndex = oldIndex
        }else{
          $store.state.exerciseIndex = index
        }
    },
             
  }
};
</script>

<style>

/*@import 'packages/sb-admin-2/sb-admin-2.css';*/

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