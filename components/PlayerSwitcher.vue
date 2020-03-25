<template>
  <div>
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-list-item v-on="on" @click="getPlayers()">
          <v-list-item-action>
            <v-icon>mdi-speaker</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Change player</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
      <v-list>
        <v-list-item>
          <v-list-item-title
            ><v-btn @click="changeDevice('classic')" text>
              <v-icon>mdi-speaker</v-icon>
              Sample mode (No Spotify)</v-btn
            >
          </v-list-item-title>
        </v-list-item>

        <v-list-item v-for="player in players">
          <v-list-item-title
            ><v-btn @click="changeDevice(player.id)" text>
              <v-icon>mdi-spotify</v-icon>
              {{ player.name }}</v-btn
            >
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { spotifyConnexionService } from '@/services/spotifyConnexion'

export default {
  data() {
    return {
      players: [],
      user: this.$store.getters['authApp/getUser']
    }
  },
  async mounted() {},
  methods: {
    async getPlayers() {
      const header = await this.getHeaderSpotify(this.user)

      const serverUrl = 'https://api.spotify.com/v1'

      const url = `${serverUrl}/me/player/devices`

      try {
        const result = await this.$axios.get(url, header)
        this.players = result.data.devices
        return result.data.devices
      } catch (e) {
        alert('error, please try reloading the page', e)
      }
    },
    // changePlayer(player) {
    //   this.$store.dispatch('authSpotify/setMode', player)
    // },

    async changeDevice(idPlayer) {
      this.$store.dispatch('authSpotify/setDeviceId', idPlayer)
      if (idPlayer === 'classic') return true

      const header = await this.getHeaderSpotify(this.user)

      const serverUrl = 'https://api.spotify.com/v1'

      const url = `${serverUrl}/me/player`

      try {
        const result = await this.$axios.put(
          url,
          { device_ids: [idPlayer], play: true },
          header
        )
        return result
      } catch (e) {
        alert('error, please try reloading the page', e)
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
}
</script>

<style lang="scss" scoped></style>
