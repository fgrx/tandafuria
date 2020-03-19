import axios from 'axios'

const urlApi =
  process.env.NODE_ENV === 'development'
    ? process.env.DEV_serverUrl
    : process.env.PROD_serverUrl

export const userService = {
  async addUser(user) {
    const result = await axios.post(urlApi + '/users', user)
    return result
  },

  async getUser(user) {
    const header = { headers: { Authorization: 'Bearer ' + user.token } }
    const result = await axios.get(urlApi + '/users/' + user.id, header)
    return result
  },

  async getUserInfos(id) {
    const result = await axios.get(urlApi + '/users/infos/' + id)
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

  async getTopUsers() {
    const result = await axios.get(urlApi + '/users')
    return result.data
  },

  async sendRecoveryMail(email) {
    const result = await axios.post(urlApi + '/auth/requestNewPassword', {
      email
    })
    return result
  },

  async resetPassword(email, code, password) {
    const result = await axios.post(urlApi + '/auth/resetPassword', {
      email,
      code,
      password
    })
    return result
  }
}
