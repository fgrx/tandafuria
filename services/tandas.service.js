import axios from 'axios'

const urlApi = 'https://tandafuria.herokuapp.com/tandas'

export const tandaService = {
  async getTandas() {
    const result = await axios.get(`${urlApi}/0`)
    return result.data
  },
  async getTandasUser(id) {
    const url = `${urlApi}/user/${id}/0`
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
  delete(idTanda, token) {
    const header = { headers: { Authorization: 'Bearer ' + token } }
    const result = axios.delete(`${urlApi}/${idTanda}`, header)
    return result
  }
}
