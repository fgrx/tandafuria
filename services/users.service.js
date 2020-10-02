import axios from "axios"

const urlApi =
  process.env.NODE_ENV === "development"
    ? process.env.DEV_serverUrl
    : process.env.PROD_serverUrl

export const userService = {
  async addUser(user) {
    try {
      const result = await axios.post(urlApi + "/users", user)
      return result.data
    } catch (e) {
      console.log("error user.service", e)
    }
  },

  async getUser(user) {
    const header = { headers: { Authorization: "Bearer " + user.token } }
    try {
      const result = await axios.get(urlApi + "/users/" + user.id, header)
      return result.data
    } catch (e) {
      console.log("error user.service", e)
    }
  },

  async getUserInfos(id) {
    try {
      const result = await axios.get(urlApi + "/users/infos/" + id)
      return result.data
    } catch (e) {
      console.log("error user.service", e)
    }
  },

  async updateUser(user, token) {
    try {
      const header = { headers: { Authorization: "Bearer " + token } }
      const result = await axios.put(urlApi + "/users", user, header)
      return result.data
    } catch (e) {
      console.log("error user.service", e)
    }
  },

  async signin(username, password) {
    try {
      const result = await axios.post(urlApi + "/auth/signin", {
        username,
        password
      })
      return result.data
    } catch (e) {
      console.log("error user.service", e)
    }
  },

  async getTopUsers() {
    try {
      const result = await axios.get(urlApi + "/users")
      return result.data
    } catch (e) {
      console.log("error user.service", e)
    }
  },

  async sendRecoveryMail(email) {
    try {
      const result = await axios.post(urlApi + "/auth/requestNewPassword", {
        email
      })
      return result.data
    } catch (e) {
      console.log("error user.service", e)
    }
  },

  async resetPassword(email, code, password) {
    try {
      const result = await axios.post(urlApi + "/auth/resetPassword", {
        email,
        code,
        password
      })
      return result.data
    } catch (e) {
      console.log("error user.service", e)
    }
  }
}
