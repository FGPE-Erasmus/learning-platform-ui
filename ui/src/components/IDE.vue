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
                    <div class="modal-dialog modal-lg">
                    
                      <!-- Modal content-->
                      <div class="modal-content">
                        <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div v-if="loading_solution" class="d-flex justify-content-center">
                                <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                            </div>
                            <span v-if="surrender">Chcesz się poddać?</span>

                            <button v-if="surrender" type="button" class="btn btn-primary" v-on:click="getSolution(solution)">{{$i18n.t('yes')}}</button>

                            <div v-if="!surrender">{{solution_decoded}}</div>
                        </div>
                        <div class="modal-footer">
                          <button type="button" @click="surrender = !surrender" class="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                      </div>
                    </div>
                  </div>
              
            <div class="card-body" style="min-height: 100px;">
                <div v-if="loading_exercises" class="d-flex justify-content-center">
                    <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
                </div>
                <div v-if="statements_format=='pdf'" class="col-12 embed-responsive embed-responsive-16by9" style="max-height: 320px;">
                    <iframe class="embed-responsive-item" :src="instructions" allowfullscreen ></iframe>
                </div>
                <div v-else-if="statements_format == 'txt'" class="col-12" style="max-height: 320px;overflow: auto;">
                         {{instructions}}     
                </div>
                <div v-else-if="statements_format == 'html'" v-html="instructions" class="col-12" style="max-height: 320px;overflow: auto;"></div>
                <div v-else-if="statements_format == 'markdown'" v-html="instructions" class="col-12" style="max-height: 320px;overflow: auto;"></div>                  
            </div> 
            </div>
            <div class="row">
                <div class="col-md-6">
                    <div class="card shadow mb-4">
                        <div class="card-body"> 
                            <textarea id="editor"></textarea>
                            <div class="mt-2">
                                <button type="button" class="btn btn-primary mr-2 mb-1 code-btn" v-on:click="runit()"><i class="fas fa-play mr-1"></i> {{$i18n.t('run')}}</button>
                                <button type="button" class="btn btn-primary mr-2 mb-1 code-btn" v-on:click="terminate()"><i class="fas fa-stop mr-1"></i> {{$i18n.t('stop')}}</button>
                                <button type="button" class="btn btn-primary mr-2 mb-1 code-btn" v-on:click="reload()"><i class="fas fa-redo mr-1"></i> {{$i18n.t('reload')}}</button>
                            </div>
                            <div class="mt-1">
                                <button type="button" class="btn btn-primary mr-2 mb-1 code-btn" v-on:click="sendAnswer()"><i class="far fa-save mr-1"></i> {{$i18n.t('save')}}</button>
                                <button type="button" class="btn btn-primary mr-2 mb-1 code-btn" v-on:click="onSubmit()"><i class="far fa-save mr-1"></i> {{$i18n.t('submit')}}</button>
                                <button type="button" data-toggle="modal" data-target="#solution" class="btn btn-primary mr-2 mb-1 code-btn" ><i class="fas fa-question-circle"></i> {{$i18n.t('solution')}}</button>
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
                {{isCompleted}}</h6>
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


export default {
name: "Editor",

props:['exercise','lessons'],

created() {
    this.tabClose()
    this.fetchExercise({projectId: this.$route.params.projectId, exerciseId: this.$route.params.exercisesId}).then(resp =>{
        this.setCoursePosition({projectId: this.$route.params.projectId, exerciseId: this.$route.params.exercisesId})
    })
},

components: {
    Notes
},

mounted(){
    this.runmirror();
    this.runoutput();
    this.getExercise();
    this.timeTracker();
},

beforeRouteLeave(to, from, next) {
    const endDate = new Date()
    const spentTime = Math.floor((endDate.getTime() - this.$data.dateStarted.getTime()) / 1000)

    next()
},

data(){
    return {
        editor: null,
        output: null,
        task: [],
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
        testSet: [undefined,undefined,6,3,8,20,5,2],
        submitClicked: false,
        testowa_tablica: [],
        try_counter: 0,
        tests_results: [],
        linesClicked: [],
        linesSubmit: [],
        outputArray: [],
        inputCounter: 0,
        comments_submit: [],
        dodawanie: [55,10,1,5],
        counter_tests: 0,
        outArrayResults: [],
        dateStarted: {},
        input_resolve: '',
        isCompleted: null

    }
},

computed: {
    liner: function(){
        if(this.$data.isFinishesInput == true){
        return -1
        }else{
            return this.output.lineCount()
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
                    context.sendAnswer()
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
        this.editor.setValue('');
    },

    terminate: function(){
        Sk.break = true;
    },

    sendAnswer: function(){
      let answerData = {
        answer: this.editor.getDoc().getValue()
      }
      if (this.isCompleted === true) {
          answerData.solved = isCompleted
      }

      this.sendExerciseAnswer({exerciseId: this.$route.params.exercisesId, answer: answerData})
    },

    onSubmit: function(){
        let context = this

        //VALIDATE SOURCE CODE WITH STATIC CORRECTORS
        
        let pattern = $store.state.validator_instructions

        class validate{
            constructor(expression,isAllowed,comment) {
                this.expression = expression
                this.isAllowed = isAllowed
                this.comment = comment
            }
        }

        let sortedValidator = []
        let comments = []
        
        for(let i=0; i<$store.state.validator_instructions.length; i++){
            if($store.state.validator_instructions[i].includes('+>')){

                let index = $store.state.validator_instructions[i].indexOf("+>")
    
                let instruction = new validate(
                    $store.state.validator_instructions[i].slice(0,index-1),
                    false,
                    $store.state.validator_instructions[i].slice(index+2,$store.state.validator_instructions[i].length)
                )
                sortedValidator.push(instruction)

            }else{
                let index = $store.state.validator_instructions[i].indexOf("->")
                
                let instruction = new validate(
                    $store.state.validator_instructions[i].slice(0,index-1),
                    true,
                    $store.state.validator_instructions[i].slice(index+2,$store.state.validator_instructions[i].length)
                )
                sortedValidator.push(instruction) 
            }
        }
        
        for(let j=0; j<sortedValidator.length; j++){
            if(sortedValidator[j].expression.substr(sortedValidator[j].expression.length - 1) != '/'){
                sortedValidator[j].expression = sortedValidator[j].expression + '/' 
            }
            let pattern = new RegExp(eval(sortedValidator[j].expression))
            let result = pattern.test(context.editor.getDoc().getValue())

            if(sortedValidator[j].isAllowed==true && result==false){
                comments.push(sortedValidator[j].comment)
                context.$data.isCompleted = false
            }else if(sortedValidator[j].isAllowed==false && result==true){
                comments.push(sortedValidator[j].comment)
                context.$data.isCompleted = false
            }
        }
        context.$data.comments_submit = comments
        
        //IF VALIDATION PASS AND INPUT EXISTS AND TESTSETS NOT EMPTY
        //if(comments.length == 0){

            this.submitClicked = true
            let i = 0

            let interval = setInterval(function(){
                context.$data.testowa_tablica.push(context.$data.testSet[i])
                context.runit();
                i++ 

                if(i == $store.state.sortedInout.length){
                    clearInterval(interval)
                   
                    setTimeout(function(){
                        //porównujemy wyniki testów z outarray
                        for(let x=0; x<$store.state.sortedInout.length; x++){
                            let pattern = $store.state.sortedInout[x].outArray
                            if(pattern.charAt(0) == '['){ pattern = pattern.slice(1,pattern.length - 1)}

                                pattern = eval(pattern)
                                let compare = pattern.test(context.$data.tests_results[x]) 
                                context.$data.outArrayResults.push(compare)   
                        }
                        if(context.$data.outArrayResults.includes(false)){
                            context.$data.comments_submit.push('Tests not passed')
                            context.$data.isCompleted = false
                        }else if(context.$data.comments_submit.length == 0){
                            context.$data.isCompleted = true
                        }

                    },100)
                }
            },500);
            

            // IF EXERCISE TYPE = "SPOT BUG"
            for(let j=0; j<context.editor.lineCount(); j++){
                if (context.editor.lineInfo(j).gutterMarkers != null && context.editor.lineInfo(j).gutterMarkers != undefined) {
                    context.$data.linesSubmit.push(context.editor.lineInfo(j).line)
                }
            }
        //}
    },

    setCursor: function(){
        let context = this

        let interval = setInterval(function(){

            let lineamount = context.output.lineCount()
            let zcomputed = context.liner

            context.output.markText({line: -1, ch: 30000 }, {line: zcomputed-1, ch:30000 }, {readOnly: true})
            context.output.setCursor(context.output.lineCount())

            if(context.$data.isFinishesInput == true){
                clearInterval(interval)
                context.$data.isFinishesInput == false
            }
        }, 100);
    },

    inputFunction: function(pythonPrompt){
        const context = this;
        let i = 0
        
        if(context.$data.submitClicked == false){
            if(context.$data.isInput == false){
                context.setCursor();
            }
            context.$data.isInput = true

            context.$data.outputArray.push(this.output.getDoc().getValue())

            function myFunction() {
               
            }

            if(context.$data.input_resolve === ''){
                context.$data.history = context.$data.history + context.output.getLine(0) + pythonPrompt
            }else{
                context.$data.history = context.$data.history +'\n' + context.output.getLine(0) + pythonPrompt
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

                        context.output.getWrapperElement().removeEventListener("keyup",myFunction);
                        resolve(input)
                    }
                });
            })
        }else{
            return new Promise(function(resolve,reject){

                if(context.$data.try_counter > 0 ){
                    i =  context.$data.try_counter
                }

                context.$data.try_counter++
                //resolve(context.$data.dodawanie[i])
                resolve(eval($store.state.sortedInout[context.$data.counter_tests].inArray)[i])      
            })
        }
    },


    // RUN PYTHON INTERPRETER
   runit: function () {
        let context = this
        let sourcecode = ''

        context.output.getDoc().setValue('')
        context.$data.temp_input = this.editor.getDoc().getValue()
        
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

            //sourcecode = this.editor.getDoc().getValue();
            context.$data.temp_code = this.editor.getDoc().getValue()
        }else{
            context.editor.getDoc().setValue(context.$data.template)
            context.editor.replaceRange('\n' + context.$data.library, {line: context.editor.lineCount(),ch: 1}); 
            context.editor.replaceRange('\n' + context.$data.temp_input, {line: context.editor.lineCount(),ch: 1});
        }

        sourcecode = this.editor.getDoc().getValue()
        context.editor.getDoc().setValue(context.$data.temp_input)

        const cp_this = this;

        Sk.pre = "output";

        Sk.configure({
            output:this.outf,
            read:this.builtinRead,
            debugging: true,
            inputfun: this.inputFunction,
            inputfunTakesPrompt: true
        }); 

        let susp_handlers = {};
        Sk.break = false; //
        susp_handlers["Sk.debug"] = function handler(susp) {
            return new Promise(function(resolve, reject) {
                try {
                    
                    if (Sk.break)
                        console.log('x');
                    /*reject("Przerwano na życzenie użytkownika.");*/
                    else 
                        setTimeout(function () { 
                            
                            try {
                                
                                cp_this.output.getDoc().setValue(document.getElementById('output').innerHTML);

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

            cp_this.output.getDoc().setValue(document.getElementById('output').innerHTML);
            context.editor.getDoc().setValue(context.$data.temp_input)

            context.$data.counter_tests++

            if(context.$data.submitClicked == true){
               
                //context.$data.tests_results.pop()
                context.$data.tests_results.push(document.getElementById('output').innerHTML)

                context.output.getDoc().setValue('')
                context.$data.try_counter = 0
                document.getElementById('output').innerHTML = ''
                context.$data.testowa_tablica = []
            }
            
            if(context.$data.isInput == true){
                let linesAmount = context.output.lineCount()
                let lastLine = linesAmount - 2
                let lastLineText = context.output.getLine(lastLine)

                context.output.getDoc().setValue(context.$data.history + '\n' + lastLineText + '\n')
                /*
                if(context.$data.outputArray[context.$data.outputArray.length-1] == ''){
                    context.output.getDoc().setValue(context.$data.history + context.output.getDoc().getValue()+ lastLineText)
                }else{
                    context.output.getDoc().setValue(context.$data.history + lastLineText)
                }
                */

                let pos = { 
                    line: context.output.lineCount(),
                    ch: 1 
                }

                context.output.replaceRange('**********PROGRAM IS FINISHED**********', pos)

                context.$data.history = ''
                context.$data.isFinishesInput = true
                context.$data.isInput = false   
            }            
        },
            function(err){

                if(context.$data.submitClicked == true){
                    //context.$data.tests_results.pop()

                    if(document.getElementById('output').innerHTML == ''){
                        context.$data.tests_results.push(err.toString())
                    }else{
                        context.$data.tests_results.push(document.getElementById('output').innerHTML)
                    }

                    context.output.getDoc().setValue('')
                    document.getElementById('output').innerHTML = ''
                    context.$data.try_counter = 0
                    context.$data.testowa_tablica = []
                }else{
                    document.getElementById('output').innerHTML = err.toString();
                    cp_this.output.getDoc().setValue(err.toString());
                    context.$data.testowa_tablica = []
                }
            });
        },
    // REPO API SIDE METHODS

    getExercise: function(){
        let context = this
        let accessToken = ''
        this.$data.loading_exercises = true
    
        axios.get('/exercises/'+ context.$route.params.exercisesId +'?join=statements&join=instructions&join=templates&join=skeletons&join=embeddables&join=solutions&join=libraries&join=tests&join=dynamic_correctors&join=static_correctors', {})
        .then(function(response) {
            $store.state.module = response.data.module

            if(response.data.embeddables.length > 0){ context.$data.embeddables = response.data.embeddables }
            
            if(response.data.solutions.length > 0){ context.$data.solution = response.data.solutions[0] }

            if(response.data.statements.length > 0){
                context.getStatements(response.data.statements[0].id, response.data.statements[0].format)
            }

            if(response.data.static_correctors.length > 0){ context.getStaticCorrectors(response.data.static_correctors[0].id) }

            if(response.data.dynamic_correctors.length > 0){ context.getTests(response.data.dynamic_correctors[0].id) }

            if(response.data.skeletons.length > 0){ context.getSkeletons(response.data.skeletons[0].id) }

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

        axios.get('/statements/' + statements_path+ '/contents'  , {
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
        axios.get('/skeletons/' + skeletons_path+ '/contents', {
        }).then(function(response) {    
            let decodedString = context.b64DecodeUnicode(response.data)
            context.$data.skeletons = decodedString;
            context.editor.setValue(decodedString)  
        });
    },

    getEmbeddable: function(pathname){
        let context = this
        context.$data.embeddable_format = pathname.pathname.substring(pathname.pathname.lastIndexOf('.') + 1)
        context.$data.embeddable = ''
        context.$data.loading_embeddable = true

        axios.get('/embeddables/'+ pathname.id + '/contents',{
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

        axios.get('/templates/' + pathname + '/contents', {
        }).then(function(response) {
            let decodedString = atob(response.data);
            context.$data.template = context.$data.template +'\n'+ decodedString
        })
    },

    getLibraries: function(pathname){
        let context = this

        axios.get('/libraries/'+ pathname +'/contents', {
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

        axios.get('/solutions/'+ pathname.id +'/contents', { 
        }).then(function(response) {
            let decodedString = atob(response.data);
            context.$data.loading_solution = false
            context.$data.solution_decoded = decodedString
        })
    },

    getStaticCorrectors: function(pathname){
        let context = this

        axios.get('/static-correctors/'+ pathname +'/contents', {
        }).then(function(response) {

            let decodedString = context.b64DecodeUnicode(response.data);
            $store.state.validator_instructions = decodedString.match(/[^\r\n]+/g)
        })
    },

    getTests: function(pathname){
        let context = this
        $store.state.sortedInout = []

        axios.get('/dynamic-correctors/'+ pathname +'/contents', {
        }).then(function(response) {
            let decodedString = context.b64DecodeUnicode(response.data);
            $store.state.tests_array = decodedString.match(/[^\r\n]+/g)

            class inout{
                constructor(inArray,outArray) {
                    this.inArray = inArray
                    this.outArray = outArray
                }
            }

            for(let i=0; i<$store.state.tests_array.length; i++){
                let index = $store.state.tests_array[i].indexOf("->")
    
                let result = new inout(
                    $store.state.tests_array[i].slice(0,index),
                    $store.state.tests_array[i].slice(index+3,$store.state.tests_array[i].length)
                )
                $store.state.sortedInout.push(result)
            }
        })
    },

    b64DecodeUnicode: function(str){
        return decodeURIComponent(atob(str).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    },

    timeTracker: function(){
        this.$data.dateStarted = new Date();
    },

    tabClose: function() {
        let context = this
        window.addEventListener('beforeunload', function (event) {
            const endDate = new Date()
            const spentTime = Math.floor((endDate.getTime() - context.$data.dateStarted.getTime()) / 1000)

            context.updateExerciseTime({ exerciseId: context.$route.params.exercisesId, seconds: spentTime })
        }, false)
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
