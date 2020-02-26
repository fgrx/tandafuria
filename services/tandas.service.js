import axios from 'axios'

const baseUrl =
  process.env.NODE_ENV === 'development'
    ? process.env.DEV_serverUrl
    : process.env.PROD_serverUrl
const urlApi = baseUrl + '/tandas'

export const tandaService = {
  async getTandas(offset, params) {
    if (!offset) offset = 0
    const urlGetTandas = `${urlApi}/${offset}${params}`
    const result = await axios.get(urlGetTandas)
    return result.data
  },
  async getTandasUser(id, offset, params) {
    if (!offset) offset = 0
    const url = `${urlApi}/user/${id}/${offset}${params}`

    const result = await axios.get(url)
    return result.data
  },
  async getCountTandaUser(id) {
    const url = `${urlApi}/count-tandas/${id}`
    const result = await axios.get(url)
    return result.data
  },
  async getOneTanda(idTanda) {
    const result = await axios.get(`${urlApi}/find/${idTanda}`)
    return result.data
  },
  async save(tanda, token) {
    const header = { headers: { Authorization: 'Bearer ' + token } }
    const result = await axios.post(urlApi, tanda, header)
    return result
  },
  update(idTanda, tanda, token) {
    const header = { headers: { Authorization: 'Bearer ' + token } }
    const result = axios.put(`${urlApi}/${idTanda}`, tanda, header)
    return result
  },
  updateTandaComments(idTanda, tanda, token) {
    const header = { headers: { Authorization: 'Bearer ' + token } }
    const result = axios.put(`${urlApi}/${idTanda}/comments`, tanda, header)
    return result
  },
  delete(idTanda, token) {
    const header = { headers: { Authorization: 'Bearer ' + token } }
    const result = axios.delete(`${urlApi}/${idTanda}`, header)
    return result
  }
}
