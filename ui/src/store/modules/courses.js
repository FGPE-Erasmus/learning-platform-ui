import axios from 'axios'

const state = {
  course: {},
  userCourses: []
}

const getters = {
  getCourse: state => state.course,
  getUserCourses: state => state.userCourses
}

const mutations = {
  setCourse: (state, course) => (state.course = course),
  setUserCourses: (state, courses) => (state.userCourses = courses)
}

const actions = {
  // CREATE OR GET COURSE BY ID //
  async fetchCourse({ commit }, courseId) {
    const response = await axios.get(`course/${courseId}/`)

    commit('setCourse', response.data)
  },

  // SET LAST EXERCISE ON COURSE //
  async setCoursePosition({ commit }, data) {
    let projectId = data.projectId
    let exerciseId = data.exerciseId

    const response = await axios.put(`course/${projectId}/`, {platformCourseExerciseId: exerciseId})

    commit('setCourse', response.data)
  },

  // GET LIST OF STARTED COURSES //
  async fetchUserCourses({ commit }) {
    const response = await axios.get(`courses/`)

    console.log(response)

    commit('setUserCourses', response.data)
  }
}

export default { state, getters, mutations, actions }