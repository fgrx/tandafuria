import axios from 'axios'

const urlApi = 'http://localhost:4000/tandas'

export const tandaService = {
  async getTandas() {
    const result = await axios.get(urlApi)
    return result
  },
  async getTandasUser(id) {
    const result = await axios.get(`${urlApi}/user/${id}`)
    return result
  },
  async getOneTanda(idTanda) {
    const result = await axios.get(`${urlApi}/${idTanda}`)
    return result
  },
  async save(tanda) {
    const result = await axios.post(urlApi, tanda)
    return result
  },
  update(idTanda, tanda) {
    const result = axios.put(`${urlApi}/${idTanda}`, tanda)
    return result
  },
  delete(idTanda) {
    const result = axios.delete(`${urlApi}/${idTanda}`)
    return result
  }
}
