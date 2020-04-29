<template>
    <div>
        <div class="card shadow mb-4">
            <!--
            <div class="card-header py-3">
                <h6 class="m-0 font-weight-bold text-primary">{{challenge}}</h6>
            </div>
            -->

            <div class="card-body" style="min-height: 100px;">
                <!--
                <h6 style="white-space: pre-line;">Treść punktu:</h6>
                <span>Lista ćwiczeń dostępnych dla punktu:</span>
                -->
                <div class="row mb-3">
                    <div class="col-4" v-if="$store.state.exercisesWithinModule.length != 0 && $store.state.exercisesWithinModule[0].id != undefined">
                        <router-link :to='"/projects/" + this.$route.params.projectId + "/exercises/" + $store.state.exercisesWithinModule[getPreviousExerciseIndex()].id' exact v-on:click.native="changeExerciseIndexBackward()">
                            <button id="backward" class="btn btn-outline-primary">{{$t('previous')}}</button>
                        </router-link>
                    </div>
                    <div  class="col-4 d-flex justify-content-center">
                        <span v-if="$store.state.exercises.exercise.solved === false"> {{$i18n.t('time_spent')}}: </span>
                        <span v-else> {{$i18n.t('completedInTime')}} </span>
                        <span>{{hours}}:{{minutes}}:{{seconds}}</span>
                    </div>
                    <div  class="col-4 d-flex justify-content-end">
                        <button type="button" data-toggle="modal" data-target="#solution" class="btn-xs btn btn-outline-secondary mr-2 mb-1 code-btn" ><i class="fas fa-question-circle"></i> {{$i18n.t('solution')}}
                        </button>
                        <div v-if="$store.state.exercisesWithinModule.length != 0 && $store.state.exercisesWithinModule[getNextExerciseIndex()].id != undefined">
                            <router-link :to='"/projects/" + this.$route.params.projectId + "/exercises/" + $store.state.exercisesWithinModule[getNextExerciseIndex()].id' exact v-on:click.native="changeExerciseIndexForward()">
                                <button id="forward" :class="buttonStyler">{{$t('next')}}</button>
                            </router-link>
                        </div>
                    </div>
                </div>

                <div v-if="this.$route.path.includes('lessons')" class="row">
                    <div  class="col-12">
                        <span>{{$i18n.t('exercises_list')}}</span>
                        <span v-for="exercise in $store.state.exercisesWithinChallenge" :key="exercise.id"  class="btn btn-link">
                            {{exercise}}
                        </span>
                    </div>     
                </div>

                <div v-if="this.$data.embeddables.length > 0" class="row">
                    <div  class="col-12">
                        <span>{{$i18n.t('embeddables_list')}}:</span>
                        <span v-for="embeddable in embeddables"  class="btn btn-link" data-toggle="modal" data-target="#myModal" v-on:click="getEmbeddable(embeddable)">
                            {{embeddable.pathname}}
                        </span> 
                    </div>     
                </div>

                  <!-- Modal EMBEDDABLES-->
                  <div class="modal fade" id="myModal" role="dialog">
                    <div class="modal-dialog modal-lg">
                    
                      <!-- Modal content-->
                      <div class="modal-content">
                        <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div v-if="loading_embeddable" class="d-flex justify-content-center">
                                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                            </div>
                            <img v-if="embeddable_format=='jpg'||embeddable_format=='png'" :src="embeddable">
                            <div v-if="embeddable_format=='pdf'" class="col-12 embed-responsive embed-responsive-16by9" style="max-height: 320px;">
                                <iframe class="embed-responsive-item" :src="embeddable" allowfullscreen ></iframe>
                            </div>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Modal SOLUTION-->
                  <div class="modal fade" id="solution" role="dialog">
                    <div class="modal-dialog modal-md">
                    
                      <!-- Modal content-->
                      <div class="modal-content">
                        <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div v-if="loading_solution" class="d-flex justify-content-center">
                                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                            </div>
                            <span v-if="surrender">{{$i18n.t('wantSurrender')}}</span>

                            <div v-if="!surrender">
                                <span style="white-space: pre;">
                                    {{solution_decoded}}
                                </span>
                            </div>
                        </div>
                        <div class="modal-footer">
                          <button v-if="surrender" type="button" class="btn btn-primary" v-on:click="getSolution(solution)">{{$i18n.t('yes')}}</button>
                          <button type="button" @click="surrender = !surrender" class="btn btn-default" data-dismiss="modal">{{$i18n.t('close')}}</button>
                        </div>
                      </div>
                    </div>
                  </div>
              
            <div class="card-body" style="min-height: 100px;">
                <div v-if="loading_exercises" class="d-flex justify-content-center">
                    <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                </div>
                <div v-if="statements_format=='pdf'" class="col-12 embed-responsive embed-responsive-16by9" style="max-height: 280px;">
                    <iframe class="embed-responsive-item" :src="instructions" allowfullscreen ></iframe>
                </div>
                <div v-else-if="statements_format == 'txt'" class="col-12" style="max-height: 280px;overflow: auto;">
                         {{instructions}}     
                </div>
                <div v-else-if="statements_format == 'html'" v-html="instructions" class="col-12" style="max-height: 280px;overflow: auto;"></div>
                <div v-else-if="statements_format == 'markdown'" v-html="instructions" class="col-12" style="max-height: 280px;overflow: auto;"></div>                  
            </div> 
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="card shadow mb-4">
                        <div class="card-body"> 
                            <textarea id="editor"></textarea>
                            <div class="mt-2">
                                <button type="button" class="btn btn-primary mr-2 mb-1 code-btn" v-on:click="runit()"><i :class="iconRun"></i> <span>{{start}}</span></button>
                                <button type="button" class="btn btn-primary mr-2 mb-1 code-btn" v-on:click="reload()"><i class="fas fa-redo mr-1"></i> {{$i18n.t('reload')}}</button>
                                <button type="button" class="btn btn-primary mr-2 mb-1 code-btn" v-on:click="saveCode()"><i class="far fa-save mr-1"></i> {{$i18n.t('save')}}</button>
                                <button type="button" class="btn btn-primary mr-2 mb-1 code-btn" v-on:click="onSubmit()"><i class="far fa-save mr-1"></i> {{$i18n.t('submit')}}</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card shadow mb-4">
                        <div class="card-body">
                           <textarea id="output"></textarea>
                        </div>
                    </div>
                </div> 
            </div>
            <div class="card-header py-3">
                <h6 class="m-0 font-weight-bold text-primary">{{$i18n.t('grade')}}:
                    <span v-if="isCompleted">{{$i18n.t('completed')}}</span>
                    <span v-else-if="isCompleted === false">{{$i18n.t('uncompleted')}}</span>
                </h6>
            </div>
            <div class="card-body" style="min-height: 100px;">
                <h6>{{$i18n.t('comments')}}:</h6>
                <div v-for="comment in comments_submit">{{comment}}</div>
            </div>
            <Notes :notes="$store.getters.getExercise.notes" :exerciseId="$store.getters.getExercise.platform_course_exercise_id" />
        </div>
    </div>
</template>

<script>

import * as edit from '../packages/skulpt/skulpt.min.js'
import * as edits from '../packages/skulpt/skulpt-stdlib.js'
import * as cdmr from '../packages/codemirror/lib/codemirror.js'
import * as pyth from '../packages/codemirror/mode/python/python.js'

import * as bs from '../packages/sb-admin-2/bootstrap.bundle.min.js'
import * as jq from '../packages/sb-admin-2/jquery-3.4.1.min.js'

import Notes from './notes'
import axios from "axios";
import marked from 'marked';
import $store from "./../store/store";
import $i18n  from "./../plugins/i18n.js"
import { mapActions, mapGetters } from 'vuex'
let RegexParser = require("regex-parser");


export default {
name: "Editor",

props:['exercise','lessons'],

created() {
    this.fetchCourse(this.$route.params.projectId)
    this.fetchExercise({projectId: this.$route.params.projectId, exerciseId: this.$route.params.exercisesId}).then(resp =>{
        this.setCoursePosition({projectId: this.$route.params.projectId, exerciseId: this.$route.params.exercisesId})
        this.showTime()
    })
    this.timeTracker()

},

components: {
    Notes
},

mounted(){
    window.addEventListener('beforeunload', this.updateTimeCloseTab)
    this.runmirror();
    this.runoutput();
    this.getExercise();
},



beforeRouteUpdate(to, from, next) {
    window.removeEventListener('beforeunload', this.updateTimeCloseTab)
    this.updateTime()
    next()
},

beforeRouteLeave (to, from, next) {
    if(to.name != 'login'){
        window.removeEventListener('beforeunload', this.updateTimeCloseTab)
        this.updateTime()
    } else{
        this.updateTimeCloseTab()
    } 
    next() 
},


data(){
    return {
        editor: null,
        output: null,
        task: [],
        defaultExerciseCode: '',
        skeletons: '',
        instructions: '',
        statements_format:'', 
        loading_exercises: false,
        message: '',
        project_name: '',
        module_name:'',
        challenge_description:'',
        challenge: '',
        input: '',
        history: '',
        isInput: false,
        isFinishesInput: false,
        isReadOnly: true,
        embeddables: [],
        embeddable: '',
        embeddable_format: '',
        loading_embeddable: false,
        template: '',
        solution: [],
        solution_decoded: '',
        loading_solution: false,
        surrender: true,
        close_surrender: true,
        library: '',
        temp_code: '',
        temp_input: '',
        submitClicked: false,
        testowa_tablica: [],
        try_counter: 0,
        tests_results: [],
        linesClicked: [],
        linesSubmit: [],
        outputArray: [],
        inputCounter: 0,
        comments_submit: [],
        counter_tests: 0,
        outArrayResults: [],
        dateStarted: {},
        input_resolve: '',
        isCompleted: null,
        terminateInput: false,
        terminateClick: 0,
        inputStatus: '',
        programStatus: '',
        iconRun: 'fas fa-play mr-1',
        iconStop: 'fas fa-stop mr-1',
        start: 'Start',
        seconds: '00',
        minutes: '00',
        hours: '00',
        exerciseStatus: 'notStarted',
        fetchedExerciseTime: 0, // zmienić na dotychczasowy czas spędzony nad zadaniem(pobrany z api)
        outputMarker: 0,
        currentOutput: '',
        validatorInstructions: [],
        testsInstructions: [],

    }
},

computed: {
    liner: function(){
        if(this.$data.isFinishesInput === true){
        return -1
        }else{
            return this.output.lineCount()
        }
    },

    buttonStyler: function(){
        if($store.state.exercises.exercise.solved === true && $store.state.exerciseIndex != $store.state.exercisesWithinModule.length-1){
            return 'btn btn-outline-success';
        }else if($store.state.exerciseIndex === $store.state.exercisesWithinModule.length-1){ 
            return 'btn btn-outline-secondary'
        }
        else if($store.state.exercises.exercise.solved === false){
            return 'btn btn-outline-warning'
        }
    }
},


methods: {
    ...mapActions([
        'fetchExercise',
        'sendExerciseAnswer',
        'updateExerciseTime',
        'setCoursePosition',
        'fetchCourse'
    ]),

    logout: function(){
      $store.dispatch('logout')
        .then(() => {
          this.$router.push('/')
        })
    },
    // Codemirror
    runmirror: function(){
        let context = this;
        this.editor = cdmr.fromTextArea(document.getElementById("editor"), {
            lineNumbers: true,
            gutters: ["CodeMirror-linenumbers", "breakpoints"],
            styleSelectedText: true,
            mode: 'python',
            theme: 'dracula',

            extraKeys: {
                "Ctrl-S": function(instance) {
                    context.saveCode()
                },
                "Ctrl-Enter": function() { 
                    context.runit()
                }      
            }
        });

        this.editor.setSize('100%', 310);
        
        this.editor.on("gutterClick", function(cm, n) {
            
            let info = cm.lineInfo(n);

            // ZOSTAWIAM PONIŻSZY KOD, JAKBY TRZEBA BYŁO JEDNAK ZAZNACZAĆ WIERSZ

            /*
            for(let i=0; i<5; i++){
                console.log(cm.lineInfo(i).gutterMarkers)
            }
            */
            
            /*
            if(context.$data.linesClicked.includes(n) ){

                for(let i=0; i<cm.getAllMarks().length; i++){
                   cm.getAllMarks()[i].clear() 
                }
                
                //context.$data.linesClicked = context.$data.linesClicked.filter(e => e != n)

                console.log(n + 'black')
                context.$data.linesClicked.pop()
            }else{
                cm.markText({line: n-1, ch: 26234}, {line: n, ch: 42234}, {className: "disabled"})
                console.log(n + 'red')
                context.$data.linesClicked.push(n)
                //context.$data.linesClicked = context.$data.linesClicked.filter(e => e != n)
            }
            cm.markText({line: n-1, ch: 26234}, {line: n, ch: 42234}, {className: "disabled"}).clear()
            console.log(cm.markText({line: n-1, ch: 26234}, {line: n, ch: 42234}, {className: "disabled"}))
            console.log(cm.getAllMarks())
            console.log(context.$data.linesClicked)
            */

            cm.setGutterMarker(n, "breakpoints", info.gutterMarkers ? null : makeMarker());
        });

        function makeMarker() {
            var marker = document.createElement("div");
            marker.style.color = "white";
            marker.innerHTML = "●";
            return marker;
        }     
    },
    
    runoutput: function(){
        this.output = cdmr.fromTextArea(document.getElementById("output"), {
            lineNumbers: true,
            mode: 'text/plain',
            theme: 'default',
        });

        this.output.setSize('100%', 310);  
    },
    
    // INTERPRETER

    outf: function(text){
        let mypre = document.getElementById("output"); 
        mypre.innerHTML = mypre.innerHTML + text;
    },

    builtinRead: function (x) {
        if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
        throw "File not found: '" + x + "'";
        return Sk.builtinFiles["files"][x];
    },

    reload: function(){
        this.editor.setValue(this.$data.skeletons)
    },

    terminate: function(){
        Sk.break = true
    },

    saveCode: function() {
      let requestData = {
          code: this.editor.getDoc().getValue()
      }

      axios.put(`exercise-code/${this.$route.params.exercisesId}/`, requestData).then(response => {
        })
    },

    sendAnswer: function() {
        // Kod do wklejenia przy sprawdzaniu i przesyłaniu rozwiązania - TODO
      let answerData = {
        answer: this.editor.getDoc().getValue()
      }
      
      if (this.isCompleted === true) {
          answerData.solved = true
          for(let i = 0; i < this.$parent.exercises.length; i++){
                if(this.$parent.exercises[i].id === this.$route.params.exercisesId && this.$parent.exercises[i].solved === false){
                    this.$parent.exercises[i].solved = true
                    this.$parent.exercisesSolvedAmount++
                }
           }
      }else if(this.isCompleted === false && $store.state.exercises.exercise.solved === true){
          answerData.solved = true
      }else if(this.isCompleted === false && $store.state.exercises.exercise.solved === false){
          answerData.solved = false
      }

      this.sendExerciseAnswer({exerciseId: this.$route.params.exercisesId, answer: answerData})

    },

    validateInstructions: function(){
        let context = this
        let pattern = context.$data.validatorInstructions
        let sortedValidator = []

        class validate{
            constructor(expression,isAllowed,comment) {
                this.expression = expression
                this.isAllowed = isAllowed
                this.comment = comment
            }
        }

        for(let i = 0; i < context.$data.validatorInstructions.length; i++){
            if(context.$data.validatorInstructions[i].includes('+>')){
                let index = context.$data.validatorInstructions[i].indexOf("+>")
                let leftEndPlus = index-1
                while(context.$data.validatorInstructions[i].charCodeAt(leftEndPlus + 1) == 32){
                    leftEndPlus--
                }
                let rightStartPLus = index + 2 
                while(context.$data.validatorInstructions[i].charCodeAt(rightStartPLus) == 32){
                    rightStartPLus++
                }
                let instruction = new validate(
                    context.$data.validatorInstructions[i].slice(0,leftEndPlus),
                    false,
                    context.$data.validatorInstructions[i].slice(rightStartPLus, context.$data.validatorInstructions[i].length)
                )
                sortedValidator.push(instruction)
            }else{
                let index = context.$data.validatorInstructions[i].indexOf("->")
                let leftEndMinus = index-1
                while(context.$data.validatorInstructions[i].charCodeAt(leftEndMinus + 1) == 32){
                    leftEndMinus--
                }
                let rightStartMinus = index + 2 
                while(context.$data.validatorInstructions[i].charCodeAt(rightStartMinus) == 32){
                    rightStartMinus++
                }
                let instruction = new validate(
                    context.$data.validatorInstructions[i].slice(0,leftEndMinus),
                    true,
                    context.$data.validatorInstructions[i].slice(rightStartMinus, context.$data.validatorInstructions[i].length)
                )
                sortedValidator.push(instruction) 
            }
        }
        return sortedValidator
    },

    testInstructions: function(){
        let context = this
        let pattern = context.$data.validatorInstructions
        let sortedValidator = []

        class inout{
            constructor(inArray,outArray) {
                this.inArray = inArray
                this.outArray = outArray
            }
        }

        for(let i = 0; i < $store.state.tests_array.length; i++){
            let index = $store.state.tests_array[i].indexOf("->")


            let leftEnd = index-1
            while($store.state.tests_array[i].charCodeAt(leftEnd) == 32){
                leftEnd--
            }

            let rightStart = index + 2 
            while($store.state.tests_array[i].charCodeAt(rightStart) == 32){
                rightStart++
            }
    
            let result = new inout(
                $store.state.tests_array[i].slice(0,leftEnd+1),
                $store.state.tests_array[i].slice(rightStart,$store.state.tests_array[i].length)
            )
                
            $store.state.sortedInout.push(result)
        }
        return $store.state.sortedInout
    },

    onSubmit: function(){
        let context = this

        if(context.$data.inputStatus === 'unfinished' || context.$data.programStatus === 'running'){
            alert('Stop running program first')
            return
        }
        context.$data.tests_results = []
        $store.state.sortedInout = []
        context.$data.counter_tests = 0
        //VALIDATE SOURCE CODE WITH STATIC CORRECTORS
        let sortedValidator = this.validateInstructions()
        this.testInstructions()
        if($store.state.sortedInout.length === 0 || sortedValidator.length === 0){return}
        let comments = []
        
        if(sortedValidator.length > 0){
            for(let j = 0; j < sortedValidator.length; j++){
                let pattern =  RegexParser(sortedValidator[j].expression)
                let result = pattern.test(context.editor.getDoc().getValue())
                if(sortedValidator[j].isAllowed === true && result === false){
                    comments.push(sortedValidator[j].comment)
                    context.$data.isCompleted = false
                }else if(sortedValidator[j].isAllowed === false && result === true){
                    comments.push(sortedValidator[j].comment)
                    context.$data.isCompleted = false
                }
            }
            context.$data.comments_submit = comments
        }
        //IF VALIDATION PASS AND INPUT EXISTS AND TESTSETS NOT EMPTY
        //if(comments.length == 0){
        this.submitClicked = true
        let i = 1
        context.runit()

        let interval = setInterval(function(){
            if(context.$data.programStatus === 'finished' && i < $store.state.sortedInout.length){
               context.runit();
               i++ 
            }
            if(i === $store.state.sortedInout.length){
                clearInterval(interval)
                setTimeout(function(){
                    for(let x = 0; x < $store.state.sortedInout.length; x++){
                        let pattern = RegexParser($store.state.sortedInout[x].outArray)
                        /*
                        if(pattern.charAt(0) == '['){ pattern = pattern.slice(1,pattern.length - 1)}
                        pattern = eval(pattern)
                        */
                        try{
                            context.$data.outArrayResults.push(pattern.test(context.$data.tests_results[x]))
                        }catch(err){
                            console.log(err.message)
                            context.$data.comments_submit.push('Something wrong with validator, please contact your teacher')
                        }  
                    }
                    if(context.$data.outArrayResults.includes(false) || context.$data.outArrayResults.length === 0){
                        context.$data.comments_submit.push('Tests not passed')
                        context.$data.isCompleted = false
                    }else if(context.$data.comments_submit.length === 0){
                        context.$data.isCompleted = true
                        context.toggleButtonClass()
                    }
                    context.$data.outArrayResults = []
                    context.$data.submitClicked = false
                    context.sendAnswer()
                },100)
            }
        },50); 
        // IF EXERCISE TYPE = "SPOT BUG"
        for(let j = 0; j < context.editor.lineCount(); j++){
            if (context.editor.lineInfo(j).gutterMarkers != null && context.editor.lineInfo(j).gutterMarkers != undefined) {
                context.$data.linesSubmit.push(context.editor.lineInfo(j).line)
            }
        }   
    },

    setCursor: function(){
        let context = this

        let interval = setInterval(function(){

            let lineamount = context.output.lineCount()
            let zcomputed = context.liner

            context.output.markText({line: -1, ch: 2000 }, {line: zcomputed-2, ch: 3000 }, {readOnly: true})
            context.output.setCursor(context.output.lineCount())

            if(context.$data.isFinishesInput === true){
                clearInterval(interval)
                context.$data.isFinishesInput === false
            }
        }, 100);
    },

    enterFake: function(){
            let context = this
            context.$data.terminateInput = true    
            let input = context.output.getWrapperElement()

            let ev = document.createEvent('Event');
            ev.initEvent('keyup');
            ev.which = ev.keyCode = 13;

            input.dispatchEvent(ev)
            context.$data.terminateClick = 1
    },

    inputFunction: function(pythonPrompt){
        const context = this;
        let i = 0

        context.$data.inputStatus = 'unfinished'
        if(context.$data.submitClicked === false){
            if(context.$data.isInput === false){
                context.setCursor();
            }

            context.$data.isInput = true

            context.$data.outputArray.push(context.output.lineCount())

            if(context.$data.inputCounter > 0){
                context.$data.currentOutput = ''
               
                for(let j = context.$data.outputArray[context.$data.outputArray.length-2]; j < context.$data.outputArray[context.$data.outputArray.length-1]; j++){
                    context.$data.currentOutput = context.$data.currentOutput + context.output.getLine(j-1) + '\n'
                }
            }
            
            function myFunction() {
               
            }
            
            if(context.$data.input_resolve === ''){
                context.$data.history = context.$data.history + context.output.getDoc().getValue() + pythonPrompt
            }else{
                context.$data.history = context.$data.history +'\n' + context.$data.currentOutput + pythonPrompt
            }
            
            this.output.getDoc().setValue(context.$data.history)
            let lineamount = context.output.lineCount()
            
            if(context.output.getLine(lineamount-1) != ''){
                let pos = { 
                    line: lineamount,
                    ch: 1 
                }
                context.output.replaceRange('\n', pos);
            }
            
            context.$data.inputCounter++
            
            return new Promise(function(resolve,reject){
                let counter = 0
                
                context.output.getWrapperElement().addEventListener('keyup', function(e) {
                    e.stopPropagation()

                    if (e.keyCode == 13 && counter==0) {

                        let calosc = context.output.getDoc().getValue()
                        let input = calosc.replace(context.$data.history, '')

                        if(input.charAt(0) == '\n'){
                            input = input.substring(1, input.length-1)
                        }else{
                            input = input.substring(0, input.length-1)
                        }

                        context.$data.history = context.$data.history + input
                        counter++
                        context.$data.input_resolve = input
                        context.output.getWrapperElement().removeEventListener("keyup",myFunction)
                        
                        if(context.$data.terminateInput === false){
                           resolve(input)
                        }else{
                            reject('You terminated program, its fine, dont worry')
                        }
                    }
                });
            })
        }else{
            return new Promise(function(resolve,reject){

                if(context.$data.try_counter > 0 ){
                    i =  context.$data.try_counter
                }

                context.$data.try_counter++
                resolve(eval($store.state.sortedInout[context.$data.counter_tests].inArray)[i])      
            })
        }
    },


    // RUN PYTHON INTERPRETER
   runit: function () {
        let context = this

        if(context.$data.inputStatus === 'unfinished' && context.$data.submitClicked === false){
            context.enterFake()
        }else if(context.$data.programStatus != 'running' && context.$data.submitClicked === false){
            context.runitHandler()
            context.$data.iconRun = 'fas fa-stop mr-1'
            context.$data.start = 'Stop'
        }else if(context.$data.programStatus != 'running' && context.$data.submitClicked === true){
            context.runitHandler()
        }else{
            Sk.break = true
            context.$data.programStatus = 'suspended'
            context.$data.iconRun = 'fas fa-play mr-1'
            context.$data.start = 'Start'
        }   
    },

    runitHandler: function(){
            let context = this
            let sourcecode = ''
            context.$data.input_resolve = ''
            context.$data.isFinishesInput = false
            context.$data.programStatus = 'running'

            context.output.clearHistory()
            document.getElementById('output').innerHTML = null

            context.output.getDoc().setValue('')
            context.output.clearHistory()

            context.$data.temp_input = context.editor.getDoc().getValue()
            
            if(context.$data.temp_code.length == 0){
                if(context.$data.library.length > 0 && context.$data.template.length > 0){

                    let updatedTemplate = context.$data.template.replace('{{code}}', context.$data.temp_input)
                    context.editor.getDoc().setValue(updatedTemplate)
                    context.editor.replaceRange('\n' + context.$data.library, {line: context.editor.lineCount(),ch: 1});

                }else if(context.$data.library.length > 0){
                    context.editor.getDoc().setValue(context.$data.library)
                    context.editor.replaceRange('\n' + context.$data.temp_input, {line: context.editor.lineCount(),ch: 1});
                }
                else if(context.$data.template.length > 0){
                    let updatedTemplate = context.$data.template.replace('{{code}}', context.$data.temp_input)
                    context.editor.getDoc().setValue(updatedTemplate)
                }

                context.$data.temp_code = context.editor.getDoc().getValue()
            }else{
                context.editor.getDoc().setValue(context.$data.template)
                context.editor.replaceRange('\n' + context.$data.library, {line: context.editor.lineCount(),ch: 1}); 
                context.editor.replaceRange('\n' + context.$data.temp_input, {line: context.editor.lineCount(),ch: 1});
            }

            sourcecode = context.editor.getDoc().getValue()
            context.editor.getDoc().setValue(context.$data.temp_input)

            const cp_this = context;

            Sk.pre = "output";

            Sk.configure({
                output:context.outf,
                read:context.builtinRead,
                debugging: true,
                inputfun: context.inputFunction,
                inputfunTakesPrompt: true,
                //future: Sk.python3
            }); 

            let susp_handlers = {};
            Sk.break = false; //
            susp_handlers["Sk.debug"] = function handler(susp) {
                return new Promise(function(resolve, reject) {
                    try {
                        if (Sk.break)
                            console.log('x');
                        else 
                            setTimeout(function () { 
                                try {
                                    context.output.getDoc().setValue(document.getElementById('output').innerHTML);
                                    resolve(susp.resume()); 
                                } catch(e) {
                                    reject(e);
                                } 
                            }, 1);              
                    } catch(e) {
                        reject(e);
                    }
                });
            };

            var myPromise = Sk.misceval.asyncToPromise(function(){
                return Sk.importMainWithBody("<stdin>", false, sourcecode, true);
            }, susp_handlers);

            myPromise.then(function(mod) {
                context.$data.inputStatus = 'finished'
                context.$data.programStatus = 'finished'
                context.$data.iconRun = 'fas fa-play mr-1'
                context.$data.start = 'Start'
                context.$data.inputCounter = 0
                context.$data.temp_code = ''

                context.output.getDoc().setValue(document.getElementById('output').innerHTML);
                context.editor.getDoc().setValue(context.$data.temp_input)

                context.$data.counter_tests++

                if(context.$data.submitClicked === true){
                   
                    context.$data.tests_results.push(document.getElementById('output').innerHTML)
                    context.output.getDoc().setValue('')
                    context.$data.try_counter = 0
                    document.getElementById('output').innerHTML = ''
                    context.$data.testowa_tablica = []
                }
                
                if(context.$data.isInput === true){
                    let linesAmount = context.output.lineCount()
                    let lastLine = linesAmount - 2
                    let lastLineText = context.output.getLine(lastLine)

                    context.$data.outputArray.push(context.output.lineCount())
                    context.$data.currentOutput = ''

                    for(let j = context.$data.outputArray[context.$data.outputArray.length-2]; j < context.$data.outputArray[context.$data.outputArray.length-1]; j++){
                        context.$data.currentOutput = context.$data.currentOutput + context.output.getLine(j-1) + '\n'
                    }

                    context.output.getDoc().setValue(context.$data.history + '\n' + context.$data.currentOutput)

                    let pos = { 
                        line: context.output.lineCount(),
                        ch: 1 
                    }

                    context.output.replaceRange('**********PROGRAM IS FINISHED**********', pos)
                    context.$data.history = ''
                    context.$data.isFinishesInput = true
                    context.$data.isInput = false
                    context.$data.outputArray = []   
                }            
            },
                function(err){
                    context.$data.inputStatus = 'finished'
                    context.$data.programStatus = 'finished'
                    context.$data.iconRun = 'fas fa-play mr-1'
                    context.$data.start = 'Start'
                    context.$data.isFinishesInput = true
                    context.$data.isInput = false
                    context.$data.temp_code = ''  

                    if(context.$data.submitClicked === true){

                        if(document.getElementById('output').innerHTML == ''){
                            context.$data.tests_results.push(err.toString())
                        }else{
                            context.$data.tests_results.push(document.getElementById('output').innerHTML)
                        }

                        context.output.getDoc().setValue('')
                        document.getElementById('output').innerHTML = ''
                        context.$data.try_counter = 0
                        context.$data.testowa_tablica = []
                    }else if(context.$data.terminateInput === true){
                        context.$data.terminateInput = false
                        context.output.getDoc().setValue(context.$data.history)
                    }
                    else{
                        document.getElementById('output').innerHTML = err.toString();
                        context.output.getDoc().setValue(err.toString());
                        context.$data.testowa_tablica = []
                    }
                    context.$data.history = ''
                });
    },
    // REPO API SIDE METHODS

    getExercise: function(){
        let context = this
        let accessToken = ''
        this.$data.loading_exercises = true

        axios.get('exercise-details/'+ context.$route.params.exercisesId)
        .then(function(response) {
            $store.state.module = response.data.module

            if(response.data.embeddables.length > 0){ context.$data.embeddables = response.data.embeddables }
            
            if(response.data.solutions.length > 0){ context.$data.solution = response.data.solutions[0] }

            if(response.data.statements.length > 0){
                context.getStatements(response.data.statements[0].id, response.data.statements[0].format)
            }

            if(response.data.static_correctors.length > 0){ context.getStaticCorrectors(response.data.static_correctors[0].id) }

            if(response.data.dynamic_correctors.length > 0){ context.getTests(response.data.dynamic_correctors[0].id) }

            if (response.data.skeletons.length > 0) {
                context.getSkeletons(response.data.skeletons[0].id)
            } else {
                context.editor.setValue($store.getters.getExercise.saved_code)
            }

            if(response.data.templates.length > 0){
                for(let i = 0; i < response.data.templates.length; i++){
                  context.getTemplates(response.data.templates[i].id) 
                }
            }

            if(response.data.libraries.length > 0){
                for(let i = 0; i < response.data.libraries.length; i++){
                  context.getLibraries(response.data.libraries[i].id)  
                }
            }
        })       
    },

    getStatements: function(statements_path,statements_format){
        let context = this

        axios.get('statements/' + statements_path, {
            }).then(function(response) {
                context.$data.project_name = $store.state.project;
                context.$data.challenge_description = $store.state.challenge_description;
                context.$data.challenge = $store.state.challenge;
                context.$data.loading_exercises = false;
                context.$data.statements_format = statements_format;
                if (statements_format=='pdf'){
                    context.$data.instructions = 'data:application/pdf;base64,'+response.data;
                }else if(statements_format=='markdown'){
                    let decodedString = context.b64DecodeUnicode(response.data)
                    context.$data.instructions = marked(decodedString)
                }
                else{
                    context.$data.instructions = context.b64DecodeUnicode(response.data)
                }    
            });
    },

    getSkeletons: function(skeletons_path){
        let context = this
        axios.get('skeletons/' + skeletons_path, {
        }).then(function(response) {   
            let decodedString = context.b64DecodeUnicode(response.data)
            context.$data.skeletons = decodedString;
            if ($store.getters.getExercise.saved_code != null) {
                context.editor.setValue($store.getters.getExercise.saved_code)
            } else {
                context.editor.setValue(decodedString)
            }
        });
    },

    getEmbeddable: function(pathname){
        let context = this
        context.$data.embeddable_format = pathname.pathname.substring(pathname.pathname.lastIndexOf('.') + 1)
        context.$data.embeddable = ''
        context.$data.loading_embeddable = true

        axios.get('embeddables/'+ pathname.id,{
        }).then(function(response) {
            context.$data.loading_embeddable = false

            if (context.$data.embeddable_format=='pdf'){
                context.$data.embeddable = 'data:application/pdf;base64,'+response.data;
            }else if(context.$data.embeddable_format=='markdown'){
                let decodedString = atob(response.data);
                context.$data.embeddable = marked(decodedString);
            }
            else if(context.$data.embeddable_format=='jpg'){
                context.$data.embeddable = 'data:image/jpeg;base64,'+response.data;      
            }
            else if(context.$data.embeddable_format=='png'){
                context.$data.embeddable = 'data:image/png;base64,'+response.data;      
            }    
        })
    },

    getTemplates: function(pathname){
        let context = this

        axios.get('templates/' + pathname, {
        }).then(function(response) {
            let decodedString = atob(response.data);
            context.$data.template = context.$data.template +'\n'+ decodedString
        })
    },

    getLibraries: function(pathname){
        let context = this
        axios.get('libraries/'+ pathname, {
        }).then(function(response) {
            let decodedString = atob(response.data);
            context.$data.library = context.$data.library +'\n'+ decodedString
        })
    },

    getSolution: function(pathname){
        let context = this
        context.$data.solution_decoded = ''
        context.$data.loading_solution = true
        context.$data.surrender = false

        if(pathname.id === undefined){
            context.$data.loading_solution = false
            context.$data.solution_decoded = 'There is no solution'
        }else{
           axios.get('solutions/'+ pathname.id, { 
           }).then(function(response) {
                let decodedString = atob(response.data);
                context.$data.loading_solution = false
                context.$data.solution_decoded = decodedString
            }) 
        }
    },

    getStaticCorrectors: function(pathname){
        let context = this

        axios.get('static-correctors/'+ pathname, {
        }).then(function(response) {
            let decodedString = context.b64DecodeUnicode(response.data);
            context.$data.validatorInstructions = decodedString.match(/[^\r\n]+/g)
        })
    },

    getTests: function(pathname){
        let context = this
        $store.state.sortedInout = []

        axios.get('dynamic-correctors/'+ pathname, {
        }).then(function(response) {
            let decodedString = context.b64DecodeUnicode(response.data);
            $store.state.tests_array = decodedString.match(/[^\r\n]+/g)
            context.$data.testsInstructions = decodedString.match(/[^\r\n]+/g) 
        })
    },

    b64DecodeUnicode: function(str){
        return decodeURIComponent(atob(str).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    },

    showTime: function(){
        let startTimer = new Date()
        let context = this

        let timeInterval = setInterval(function(){
            let currentTimer = new Date()
            currentTimer.setTime(currentTimer.getTime() + ($store.state.exercises.exercise.time_spent_seconds * 1000))
            let timeElapsed = new Date(currentTimer - startTimer)

            context.$data.seconds = timeElapsed.getUTCSeconds()
            context.$data.minutes = timeElapsed.getUTCMinutes()
            context.$data.hours = timeElapsed.getUTCHours()

            if(context.$data.seconds < 10){
                context.$data.seconds = '0' + context.$data.seconds
            }
            if(context.$data.minutes < 10){
                context.$data.minutes = '0' + context.$data.minutes
            }
            if(context.$data.hours < 10){
                context.$data.hours = '0' + context.$data.hours
            }
            
            if($store.state.exercises.exercise.solved === true){
                clearInterval(timeInterval)
            }
            
        },1000)
    },

    timeTracker: function(){
        this.$data.dateStarted = new Date();
    },

    updateTime: function(){
        if($store.state.exercises.exercise.solved === true){
            return
        }else{
            const endDate = new Date()
            const spentTime = Math.floor((endDate.getTime() - this.$data.dateStarted.getTime()) / 1000)
            this.updateExerciseTime({ exerciseId: this.$route.params.exercisesId, seconds: spentTime })
        }
    },

    updateTimeCloseTab: function(){
        if($store.state.exercises.exercise.solved === true){
            return
        }else{
            const endDate = new Date()
            const spentTime = Math.floor((endDate.getTime() - this.$data.dateStarted.getTime()) / 1000)
            localStorage.setItem('exerciseId', this.$route.params.exercisesId)
            localStorage.setItem('seconds', spentTime)
            localStorage.setItem('fgpeId', $store.getters.getUserMe.id)
        }
    },

    getPreviousExerciseIndex: function(){
        if($store.state.exerciseIndex === 0){
            return 0
        }else{
            let index = $store.state.exerciseIndex-1
            return index  
        } 
    },

    getNextExerciseIndex: function(){
        if($store.state.exerciseIndex === $store.state.exercisesWithinModule.length-1){
            let index = $store.state.exerciseIndex
            return index 
        }else if($store.state.exerciseIndex < $store.state.exercisesWithinModule.length-1){
            let index = $store.state.exerciseIndex+1
            return index
        }
        else{
            let index = $store.state.exerciseIndex-1
            return index 
        } 
    },

    changeExerciseIndexBackward: function(){
        if($store.state.exerciseIndex === 0){
            $store.state.exerciseIndex = 0
        }else if($store.state.exerciseIndex < 0){
            $store.state.exerciseIndex = 0
        }
        else{
            $store.state.exerciseIndex--
        }
        
    },

    changeExerciseIndexForward: function(){
        if($store.state.exerciseIndex === $store.state.exercisesWithinModule.length-1){
            $store.state.exerciseIndex = $store.state.exerciseIndex
        }else{
            $store.state.exerciseIndex++
        }
    },

    toggleButtonClass: function () {
        if($store.state.exercises.exercise.solved === true){
            document.getElementById("forward").classList.remove("btn-outline-warning")
            document.getElementById("forward").classList.add("btn-outline-success")
        }else if($store.state.exerciseIndex === $store.state.exercisesWithinModule.length-1){
            document.getElementById("forward").classList.remove("btn-outline-warning")
            document.getElementById("forward").classList.add("btn-outline-secondary")
        }
    },

    }
};
</script>

<style>

@import '../packages/sb-admin-2/sb-admin-2.css';
@import '../packages/codemirror/theme/dracula.css';
@import '../packages/codemirror/lib/codemirror.css';

.CodeMirror { text-align: left!important; }

.disabled { background-color: #FF0000; }

.black { background-color: #000000; }

.breakpoints {width: .8em;}
.breakpoint {color: white;}
.CodeMirrow {border: 1px solid #aaa;}

.h3{padding-top:1.0rem !important;}

.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}

.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid black;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: black transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
.nextExercise{

}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media only screen and (max-width: 450px) {
  .code-btn {
    width: 100%
  }
}

</style>
