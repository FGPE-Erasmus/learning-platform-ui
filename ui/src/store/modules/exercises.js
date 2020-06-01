import axios from 'axios'

const state = {
  exercise: {},
  userExercises: [],
  exercisesInProject: [],
}

const getters = {
  getExercise: state => state.exercise,
  getUserExercises: state => state.userExercises,
}

const mutations = {
  setExercise: (state, exercise) => (state.exercise = exercise),
  setUserExercises: (state, exercises) => (state.userExercises = exercises)
}

const actions = {
  // CREATE OR GET USER EXERCISE BY ID //
  async fetchExercise({ commit }, data) {
    let projectId = data.projectId
    let exerciseId = data.exerciseId

    const response = await axios.get(`exercise/${projectId}/${exerciseId}/`)
    commit('setExercise', response.data)
  },

  // SEND ANSWER TO USER EXERCISE BY ID //
  async sendExerciseAnswer({ commit }, data) {
    let exerciseId = data.exerciseId
    let answer = data.answer

    const response = await axios.put(`exercise/${exerciseId}/` ,answer)

    commit('setExercise', response.data)
  },

  // SEND TIME ON EXERCISE //
  async updateExerciseTime({ commit }, {exerciseId, seconds}) {
    const response = await axios.put(`exercise-time/${exerciseId}/`, {time: seconds})

    commit('setExercise', response.data)
  },

  // GET LIST OF USER STARTED EXERCISES //
  async fetchUserExercises({ commit }) {
    const response = await axios.get(`exercises/`)

    commit('setUserExercises', response.data)
  }
}

export default { state, getters, mutations, actions }