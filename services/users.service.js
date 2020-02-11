import axios from 'axios'

const urlApi = 'https://tandafuria.herokuapp.com'
// const urlApi = 'http://localhost:4000'

export const userService = {
  async addUser(user) {
    const result = await axios.post(urlApi + '/users', user)
    return result
  },

  async updateUser(user, token) {
    const header = { headers: { Authorization: 'Bearer ' + token } }
    const result = await axios.put(urlApi + '/users', user, header)
    return result
  },

  async signin(username, password) {
    const result = await axios.post(urlApi + '/auth/signin', {
      username,
      password
    })
    return result
  },

  logout() {
    localStorage.clear()
  }
}
