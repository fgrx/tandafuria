import axios from "axios"

const baseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.DEV_serverUrl
    : process.env.PROD_serverUrl
const urlApi = baseUrl + "/tandas"

export const tandaService = {
  async getAllTandasId() {
    try {
      const url = `${urlApi}/allId`
      const result = await axios.get(url)
      return result.data
    } catch (e) {
      console.log("error tandas.service", e)
    }
  },

  async getTandas(offset, params) {
    if (!offset) offset = 0

    try {
      const urlGetTandas = `${urlApi}/${offset}${params}`
      const result = await axios.get(urlGetTandas)
      return result.data
    } catch (e) {
      console.log("error tandas.service", e)
    }
  },
  async getTandasUser(id, offset, params) {
    if (!offset) offset = 0
    const url = `${urlApi}/user/${id}/${offset}${params}`

    try {
      const result = await axios.get(url)
      return result.data
    } catch (e) {
      console.log("error tandas.service", e)
    }
  },
  async getCountTandaUser(id) {
    try {
      const url = `${urlApi}/count-tandas/${id}`
      const result = await axios.get(url)
      return result.data
    } catch (e) {
      console.log("error tandas.service", e)
    }
  },
  async getOneTanda(idTanda) {
    try {
      const result = await axios.get(`${urlApi}/find/${idTanda}`)
      return result.data
    } catch (e) {
      console.log("error tandas.service", e)
    }
  },
  async save(tanda, token) {
    try {
      const header = { headers: { Authorization: "Bearer " + token } }
      const result = await axios.post(urlApi, tanda, header)
      return result.data
    } catch (e) {
      console.log("error tandas.service", e)
    }
  },
  update(idTanda, tanda, token) {
    try {
      const header = { headers: { Authorization: "Bearer " + token } }
      const result = axios.put(`${urlApi}/${idTanda}`, tanda, header)
      return result.data
    } catch (e) {
      console.log("error tandas.service", e)
    }
  },
  updateTandaComments(idTanda, tanda, token) {
    try {
      const header = { headers: { Authorization: "Bearer " + token } }
      const result = axios.put(`${urlApi}/${idTanda}/comments`, tanda, header)
      return result.data
    } catch (e) {
      console.log("error tandas.service", e)
    }
  },
  delete(idTanda, token) {
    try {
      const header = { headers: { Authorization: "Bearer " + token } }
      const result = axios.delete(`${urlApi}/${idTanda}`, header)
      return result.data
    } catch (e) {
      console.log("error tandas.service", e)
    }
  }
}
