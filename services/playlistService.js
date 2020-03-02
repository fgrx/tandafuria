import axios from 'axios'

const baseUrl =
  process.env.NODE_ENV === 'development'
    ? process.env.DEV_serverUrl
    : process.env.PROD_serverUrl
const urlApi = baseUrl + '/playlists'

export const playlistService = {
  async save(playlist, token) {
    const header = { headers: { Authorization: 'Bearer ' + token } }
    const result = await axios.post(urlApi, playlist, header)
    return result
  },

  async update(playlist, token) {
    const header = { headers: { Authorization: 'Bearer ' + token } }
    const result = await axios.put(
      urlApi + '/' + playlist._id,
      playlist,
      header
    )
    return result
  },

  async delete(playlist, token) {
    const header = { headers: { Authorization: 'Bearer ' + token } }
    const result = await axios.delete(urlApi + '/' + playlist._id, header)
    return result
  },

  async getPlaylists(userId, token) {
    const header = { headers: { Authorization: 'Bearer ' + token } }
    const result = await axios.get(urlApi + '/user/' + userId, header)
    return result
  },
  async findOne(idPlaylist) {
    //const header = { headers: { Authorization: 'Bearer ' + token } }
    //const result = await axios.get(urlApi + '/user/' + userId, header)
    const result = await axios.get(urlApi + '/' + idPlaylist)
    return result
  }
}
