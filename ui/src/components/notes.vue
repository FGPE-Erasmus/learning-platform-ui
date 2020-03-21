<template>
  <div class="card-body">
    <h6>{{$i18n.t('notes')}}:</h6>
    <div
      class="note mb-3 pr-2 pl-2 pt-1 pb-2 border rounded"
      style="background-color: #f8f8f8"
      v-for="note in notes"
      :key="note.id"
    >
      <div class="float-right">
        <span>{{ moment(note.created_at).format('YYYY-MM-DD HH:mm:ss') }}</span>
      </div>
      <br />
      <div class>{{ note.note }}</div>
    </div>
    <div class="p-1">
      <textarea
        v-model="newNote"
        class="form-control"
        name="note"
        id="new-note"
        rows="3"
        style="width: 100%"
      ></textarea>
      <br />
      <button
        v-on:click="addNote"
        class="btn btn-outline-success float-right mb-2"
      >{{$i18n.t('save')}}</button>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import getApiUrl from "../store/urls"

export default {
  name: "notes",

  data() {
    return {
      newNote: ""
    }
  },

  methods: {
    addNote: function() {
      axios
        .post(getApiUrl(`note/${this.exerciseId}/`), { note: this.newNote })
        .then(response => {
          this.notes.push(response.data)
          this.newNote = ""
        })
    }
  },

  props: {
    notes: {
      required: true
    },
    exerciseId: {
      required: true
    }
  }
}
</script>

<style>
</style>