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

  async getPlublicPlaylists(userId) {
    const result = await axios.get(urlApi + '/user/public/' + userId)
    return result
  },

  async getAllPlaylists(offset) {
    const result = await axios.get(urlApi + '/all/' + offset)
    return result
  },
  async getFavsPlaylists(userId) {
    const results = await axios.get(urlApi + '/getFavorites/' + userId)
    return results
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
    const header = await this.getHeaderSpotify(user)

    const serverUrl = 'https://api.spotify.com/v1'

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
    const header = await this.getHeaderSpotify(user)

    const serverUrl = 'https://api.spotify.com/v1'

    const url = `${serverUrl}/playlists/${playlist.id}/tracks`

    try {
      const result = await axios.get(url, header)
      return result
    } catch (e) {
      alert('error, please contact me to help me fix this problem', e)
    }
  },
  async createPlaylistSpotify(playlist, user) {
    const header = await this.getHeaderSpotify(user)
    const serverUrl = 'https://api.spotify.com/v1'

    const urlGetUserInfsos = `${serverUrl}/me`
    const resultUser = await axios.get(urlGetUserInfsos, header)

    const userSpotify = resultUser.data.id

    const url = `${serverUrl}/users/${userSpotify}/playlists`

    try {
      const result = await axios.post(
        url,
        { name: playlist.name, description: playlist.description },
        header
      )
      return result
    } catch (e) {
      alert('error, please contact me to help me fix this problem', e)
    }
  },
  async updatePlaylistSpotify(playlistId, user, tracks) {
    const header = await this.getHeaderSpotify(user)

    const serverUrl = 'https://api.spotify.com/v1'

    const url = `${serverUrl}/playlists/${playlistId}/tracks`

    const tracksForSpotify = []

    tracks.forEach((track) => {
      tracksForSpotify.push(`spotify:track:${track.id}`)
    })

    try {
      const result = await axios.put(url, { uris: tracksForSpotify }, header)
      return result
    } catch (e) {
      alert('error, please contact me to help me fix this problem', e)
    }
  },
  async getHeaderSpotify(user) {
    const token = await spotifyConnexionService.refreshTokenFromSpotify(
      user.refreshToken
    )
    const header = { headers: { Authorization: 'Bearer ' + token } }
    return header
  }
}
