import { spotifyService } from "@/services/spotify.service"
import axios from "axios"

const baseUrl =
  process.env.NODE_ENV === "development"
    ? process.env.DEV_serverUrl
    : process.env.PROD_serverUrl
const urlApi = baseUrl + "/playlists"

const spotifyTracksNumberLimit = 100

export const playlistService = {
  async save(playlist, token) {
    try {
      const header = { headers: { Authorization: "Bearer " + token } }
      const result = await axios.post(urlApi, playlist, header)
      return result.data
    } catch (e) {
      console.log("error playlist.service", e)
    }
  },

  async update(playlist, token) {
    const header = { headers: { Authorization: "Bearer " + token } }

    try {
      const result = await axios.put(
        urlApi + "/" + playlist._id,
        playlist,
        header
      )
      return result.data
    } catch (e) {
      console.log("error playlist.service", e)
    }
  },

  async delete(playlist, token) {
    try {
      const header = { headers: { Authorization: "Bearer " + token } }
      const result = await axios.delete(urlApi + "/" + playlist._id, header)
      return result.data
    } catch (e) {
      console.log("error playlist.service", e)
    }
  },

  async getPlaylists(userId, token) {
    try {
      const header = { headers: { Authorization: "Bearer " + token } }
      const result = await axios.get(urlApi + "/user/" + userId, header)
      return result.data
    } catch (e) {
      console.log("error playlist.service", e)
    }
  },

  async getPublicPlaylists(userId) {
    try {
      const result = await axios.get(urlApi + "/user/public/" + userId)
      return result.data
    } catch (e) {
      console.log("error playlist.service", e)
    }
  },

  async getAllPlaylists(offset) {
    try {
      const result = await axios.get(urlApi + "/all/" + offset)
      return result.data
    } catch (e) {
      console.log("error playlist.service", e)
    }
  },
  async getFavsPlaylists(userId) {
    try {
      const results = await axios.get(urlApi + "/getFavorites/" + userId)
      return results.data
    } catch (e) {
      console.log("error playlist.service", e)
    }
  },

  async findOne(idPlaylist) {
    try {
      // const header = { headers: { Authorization: 'Bearer ' + token } }
      // const result = await axios.get(urlApi + '/user/' + userId, header)
      const result = await axios.get(urlApi + "/" + idPlaylist)
      return result.data
    } catch (e) {
      console.log("error playlist.service", e)
    }
  },

  async addTracks(playlistId, tracks, token) {
    try {
      const header = { headers: { Authorization: "Bearer " + token } }
      const result = await axios.put(
        urlApi + "/addtracks/" + playlistId,
        tracks,
        header
      )
      return result.data
    } catch (e) {
      console.log("error playlist.service", e)
    }
  },

  setAsCortina(playlistId, track, token) {
    try {
      const header = { headers: { Authorization: "Bearer " + token } }
      const result = axios.put(
        urlApi + "/updatetrack/" + playlistId,
        track,
        header
      )
      return result.data
    } catch (e) {
      console.log("error playlist.service", e)
    }
  },

  async getUserPlaylistsFromSpotify(user) {
    const header = await this.getHeaderSpotify(user)

    const serverUrl = "https://api.spotify.com/v1"

    const userSpotify = await spotifyService.getUserFromSpotify(header)
    const url = `${serverUrl}/users/${userSpotify.id}/playlists`

    try {
      const result = await axios.get(url, header)
      return result.data
    } catch (e) {
      alert("error, please contact me to help me fix this problem", e)
    }
  },
  async getTrackFromSpotifyPlaylist(playlist, user) {
    const header = await this.getHeaderSpotify(user)

    const serverUrl = "https://api.spotify.com/v1"

    const url = `${serverUrl}/playlists/${playlist.id}/tracks?limit=${spotifyTracksNumberLimit}`

    const tracks = []

    try {
      for (
        let i = 0;
        i < playlist.tracks.total;
        i += spotifyTracksNumberLimit
      ) {
        const result = await axios.get(url + "&offset=" + i, header)

        result.data.items.forEach((itemTrack) => {
          tracks.push(itemTrack.track)
        })
      }
      return tracks
    } catch (e) {
      alert("error, please contact me to help me fix this problem", e)
      return false
    }
  },
  async createPlaylistSpotify(playlist, user) {
    const header = await this.getHeaderSpotify(user)
    const serverUrl = "https://api.spotify.com/v1"

    const userSpotify = await spotifyService.getUserFromSpotify(header)

    const url = `${serverUrl}/users/${userSpotify.id}/playlists`

    try {
      const result = await axios.post(
        url,
        { name: playlist.name, description: playlist.description },
        header
      )

      return result.data
    } catch (e) {
      alert(
        "error, please contact me to help me fix this problem at fab.grignoux@gmail.com",
        e
      )
    }
  },
  async updatePlaylistSpotify(playlistId, user, tracks) {
    const header = await this.getHeaderSpotify(user)

    const serverUrl = "https://api.spotify.com/v1"

    const url = `${serverUrl}/playlists/${playlistId}/tracks`

    const tracksForSpotify = []

    tracks.forEach((track) => {
      tracksForSpotify.push(`spotify:track:${track.id}`)
    })

    try {
      for (
        let i = 0;
        i < tracksForSpotify.length;
        i += spotifyTracksNumberLimit
      ) {
        const tracksPackToSend = tracksForSpotify.slice(
          i,
          i + spotifyTracksNumberLimit
        )

        if (i === 0) {
          await axios.put(url, { uris: tracksPackToSend }, header)
        } else {
          await axios.post(url, { uris: tracksPackToSend }, header)
        }
      }

      return true
    } catch (e) {
      alert("error, please contact me to help me fix this problem", e)
      return false
    }
  },
  async getHeaderSpotify(user) {
    const token = await spotifyService.refreshTokenFromSpotify(
      user.refreshToken
    )
    const header = { headers: { Authorization: "Bearer " + token } }
    return header
  },
  testNoDuplicateTracks(playlist) {
    const tracks = playlist.tracks || []

    tracks.forEach((track) => {
      track.duplicate = false
      const titleToCompare = track.name
      const match = tracks.filter(
        (track) => this.slugify(track.name) === this.slugify(titleToCompare)
      ).length
      if (match >= 2) track.duplicate = true
    })

    return tracks
  },

  slugify(str) {
    str = str.replace(/^\s+|\s+$/g, "") // trim
    str = str.toLowerCase()

    // remove accents, swap ñ for n, etc
    const from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;"
    const to = "aaaaeeeeiiiioooouuuunc------"
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i))
    }

    str = str
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-") // collapse dashes

    str.replace("remastered", "")
    str.replace("remasterizado", "")

    return str
  }
}
