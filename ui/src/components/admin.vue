<template>
  <div class="container-fluid mt-4 mr-1">
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <div class="row">
          <div class="col-sm-8">
            <h6 class="m-0 font-weight-bold text-primary">Programming Education Platform</h6>
          </div>
          <div class="col-sm-4">
            <button @click="createCsv()" type="button" class="btn-sm btn-outline-primary float-right">CSV</button>
          </div>
        </div>  
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <div id="dataTable_wrapper" class="dataTables_wrapper dt-bootstrap4">
            <div class="row">
              <div class="col-sm-12">
                <table class="table table-striped table-bordered dataTable" id="dataTable" width="100%" cellspacing="0" role="grid" aria-describedby="dataTable_info" style="width: 100%;">
                  <thead>
                    <tr role="row">
                      <th class="sorting_asc" tabindex="0" aria-controls="dataTable" rowspan="1" colspan="1" aria-sort="ascending" aria-label="Name: activate to sort column descending" style="width: 250px;">Username</th>
                      <th class="sorting" tabindex="0" aria-controls="dataTable" rowspan="1" colspan="1" aria-label="Position: activate to sort column ascending" style="width: 5%;">Solved Exercises</th>
                      <th class="sorting" tabindex="0" aria-controls="dataTable" rowspan="1" colspan="1" aria-label="Office: activate to sort column ascending" style="width: 5%;">Attempts</th>
                      <th class="sorting" tabindex="0" aria-controls="dataTable" rowspan="1" colspan="1" aria-label="Age: activate to sort column ascending" style="width: 5%;">Points</th>
                      <th class="sorting" tabindex="0" aria-controls="dataTable" rowspan="1" colspan="1" aria-label="Start date: activate to sort column ascending" style="width: 7%;">Time spent</th>
                      <th class="sorting" tabindex="0" aria-controls="dataTable" rowspan="1" colspan="1" aria-label="Salary: activate to sort column ascending" style="width: 96px;">Last login</th>
                      <th style="width:30px;"></th>
                    </tr>
                  </thead>
                  <tfoot>
                    <tr>
                      <th rowspan="1" colspan="1">Username</th>
                      <th rowspan="1" colspan="1">Solved Exercises</th>
                      <th rowspan="1" colspan="1">Attempts</th>
                      <th rowspan="1" colspan="1">Points</th>
                      <th rowspan="1" colspan="1">Time spent</th>
                      <th rowspan="1" colspan="1">Last login</th></tr>
                      <!--<th class="details-control"></th>-->
                  </tfoot>
                  <tbody>
                    <tr role="row" class="odd" v-for="user in users">
                      <td v-if="user.microsoft_mail != null">{{user.microsoft_mail}}</td>
                      <td v-else>{{user.username}}</td>
                      <td>{{user.solved_amount}}</td>
                      <td>{{user.number_of_attempts}}</td>
                      <td>{{user.points}}</td>
                      <td>{{user.time_spent_seconds}}</td>
                      <td>{{user.last_login}}</td>
                      <td class="details-control"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import $store from "./../store/store";
import $i18n  from "./../plugins/i18n.js"
import { mapGetters, mapActions } from "vuex"
import $ from 'jquery';
import moment from 'moment'
import dt from 'datatables.net';
import './../packages/DataTables/dataTables.bootstrap4.js'


export default {
  name: "admin",

  data() {
    return {
      users: [],
    };
  },

  created(){
    this.getUsers()
  },

  mounted() {
    this.dt = $('#dataTable').DataTable({
      autoWidth: false,
    })
  },

  methods: {
    getUsers: async function(){
      const response = await axios.get(`users/`)
      this.users = response.data
      
      for(let i = 0; i < this.users.length; i++){
        this.users[i].time_spent_seconds = this.formatTime(this.users[i].time_spent_seconds)
        this.users[i].last_login = new Date(this.users[i].last_login)
        this.users[i].last_login = moment(this.users[i].last_login).format('YYYY-MM-DD, hh:mm:ss')
      }
      
      this.dt.destroy();
      let context = this
      this.$nextTick(() => {
        context.dt = $('#dataTable').DataTable()
        context.addRow()
      }); 
    },

    getUserDetails: async function(name, mail){
      const response = await axios.post(`userdetails/`,{userName: name, mirosoftMail: mail})
      return response.data
    },

    formatTime: function(seconds){
      let time = new Date(1970,0,1);
      time.setSeconds(seconds);
      let format = time.toTimeString().substr(0,8);
      if(seconds > 86399)
          format = Math.floor((time - Date.parse('1/1/70')) / 3600000) + format.substr(2);
      return format;
    },

    format: function(submission,index){
      let trs=''

      for(let i = 0; i < submission.length; i++){
        trs += '<tr>'+
                '<td style="width:10vw;vertical-align:top;"><div class="entry">' + submission[i].project_name +'</div></td>'+
                '<td style="width:10vw;vertical-align:top;"><div class="entry">'+ submission[i].module_name +'</div></td>'+
                '<td style="width:10vw;vertical-align:top;"><div class="entry">'+ submission[i].exercise_name +'</div></td>'+
                '<td style="width:10vw;vertical-align:top;"><div class="entry">'+ submission[i].exercise_description +'</div></td>'+
                '<td style="width:10vw;vertical-align:top;"><code><div class="entry">'+ submission[i].last_answer +'</div></code></td>'+
                '<td style="width:10vw;vertical-align:top;"><div class="entry">'+ submission[i].last_good_answer +'</div></td>'+
                '<td style="width:5vw;vertical-align:top;"><div class="entry">'+ submission[i].number_of_attempts +'</div></td>'+
                '<td style="width:5vw;vertical-align:top;"><div class="entry">'+ submission[i].solved +'</div></td>'+
              '</tr>'
      }
    return '<table class="child_table" id = "child_details' + index + '"cellpadding="5" cellspacing="0" border="0" style="padding-left:20px;">'+
           '<thead><tr><th class="childTable">Project</th><th class="childTable">Module</th><th class="childTable">Exercise</th><th class="childTable">Exercise description</th><th class="childTable">Last answer</th><th class="childTable">Last correct answer</th><th class="childTable">Attempts</th><th class="childTable">Solved</th></tr></thead><tbody>'
               + trs +
           '</tbody></table>';
    },

    addRow: function(){
      let context = this
      $('#dataTable tbody').on('click', 'td.details-control', async function () {
          let tr = $(this).closest('tr')
          let row = context.dt.row( tr )
          let d = row.data();
          let index = row.index()

          if ( row.child.isShown() ) {
              row.child.hide()
              tr.removeClass('shown')
          }
          else {
            let user = context.users[index]
            let data = context.dt.row( $(this).parents('tr') ).data();
            const response = await context.getUserDetails(user.username, user.microsoft_mail)
            row.child(context.format(response,index)).show()

            $('#child_details' + index).DataTable({
              destroy: true,
              scrollY: '30vh',
              scrollCollapse: true,
              responsive: true,
            });

            tr.addClass('shown')
          }
      });
    },

    processCsvRow: function(row){
      let finalVal = '';
        for (let j = 0; j < row.length; j++) {
          let innerValue = row[j] === null ? '' : row[j].toString()
          if (row[j] instanceof Date) {
            innerValue = row[j].toLocaleString()
          }
          let result = innerValue.replace(/"/g, '""')
          if (result.search(/("|,|\n)/g) >= 0)
            result = '"' + result + '"'
          if (j > 0)
            finalVal += ',';
          finalVal += result;
        }
      return finalVal + '\n';
    },

    downloadCsv: function(csvFile){
      const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' })
      if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, csvFile)
      }else {
        let link = document.createElement("a")
        if (link.download !== undefined) { // feature detection
          // Browsers that support HTML5 download attribute
          let url = URL.createObjectURL(blob)
          link.setAttribute("href", url)
          link.setAttribute("download", 'students.csv')
          link.style.visibility = 'hidden';
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
    },

    createCsv: function(){
      const entriesAmount = this.dt.rows().count()
      let csvFile = this.processCsvRow(['Username', 'Solved exercises', 'Attempts', 'Points', 'Time spent', 'Last login'])

      for (let i = 0; i < entriesAmount; i++) {
          csvFile += this.processCsvRow(this.dt.rows().data()[i]);
      }

      this.downloadCsv(csvFile)
    },
  },
};
</script>

<style>

@import '../packages/sb-admin-2/sb-admin-2.css';
@import '../packages/DataTables/datatables.css';
@import '../packages/DataTables/dataTables.bootstrap4.css';

body {
  font: 90%/1.45em "Helvetica Neue", HelveticaNeue, Verdana, Arial, Helvetica, sans-serif;
  margin: 0;
  padding: 0;
  color: #333;
  background-color: #fff;
}

td.details-control {
    background: url('https://www.datatables.net/examples/resources/details_open.png') no-repeat center center;
    cursor: pointer;
    max-width: 100px;
}
tr.shown td.details-control {
    background: url('https://www.datatables.net/examples/resources/details_close.png') no-repeat center center;
}

th{
  color: #858796;
  font-size: 14px;
}
.childTable{
  color: black;
  font-size: 15px;
  background-color: #fff;
}

table.dataTable thead th, table.dataTable thead td {
    border-bottom: 1px solid #ddd;
}

table.dataTable tfoot th, table.dataTable tfoot td {
    border-top: 1px solid #ddd;
}

.entry{
  max-height:100px;
  overflow-y:auto;
  color: #858796;
}

.dataTables_scrollBody
{
 overflow-x: hidden;
}

.table-responsive{
 overflow-x: hidden;
}

.label{
  padding-right: 30px;
}

@media only screen and (max-width: 1200px) {
 .dataTables_scrollBody
  {
 overflow-x: scroll;
  }
 .table-responsive{
  overflow-x: scroll;
 }
}

.dataTables_wrapper .dataTables_paginate .paginate_button{
  padding: 0;
  background-color: #fff;
  border-right-color: #fff;
}
.page-item{
  border-right-color: #fff;
}

#dataTable .even { background-color: #fff }
#dataTable .odd { background-color: #fff }

</style>