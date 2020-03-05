import axios from 'axios'
import { spotifyConnexionService } from '@/services/spotifyConnexion'

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
  },

  async addTracks(playlistId, tracks, token) {
    const header = { headers: { Authorization: 'Bearer ' + token } }
    const result = await axios.put(
      urlApi + '/addtracks/' + playlistId,
      tracks,
      header
    )
    return result
  },

  setAsCortina(playlistId, track, token) {
    const header = { headers: { Authorization: 'Bearer ' + token } }
    const result = axios.put(
      urlApi + '/updatetrack/' + playlistId,
      track,
      header
    )
    return result
  },

  async getUserPlaylistsFromSpotify(user) {
    const token = await spotifyConnexionService.refreshTokenFromSpotify(
      user.refreshToken
    )

    const serverUrl = 'https://api.spotify.com/v1'
    const header = { headers: { Authorization: 'Bearer ' + token } }

    const urlGetUserInfsos = `${serverUrl}/me`
    const resultUser = await axios.get(urlGetUserInfsos, header)

    const userSpotify = resultUser.data.id

    const url = `${serverUrl}/users/${userSpotify}/playlists`

    try {
      const result = await axios.get(url, header)
      return result
    } catch (e) {
      alert('error, please contact me to help me fix this problem', e)
    }
  },
  async getTrackFromSpotifyPlaylist(playlist, user) {
    const token = await spotifyConnexionService.refreshTokenFromSpotify(
      user.refreshToken
    )

    const serverUrl = 'https://api.spotify.com/v1'
    const header = { headers: { Authorization: 'Bearer ' + token } }

    const url = `${serverUrl}/playlists/${playlist.id}/tracks`

    try {
      const result = await axios.get(url, header)
      return result
    } catch (e) {
      alert('error, please contact me to help me fix this problem', e)
    }
  }
}
