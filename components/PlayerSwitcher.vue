<template>
  <div>
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-list-item v-on="on" @click="detectActualPlayers(userRefreshToken)">
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

        <v-list-item v-for="player in players" :key="player.id">
          <v-list-item-title
            ><v-btn
              :color="
                tandafuryPlayerOfThisInstance === player.id
                  ? 'pink accent-2'
                  : ''
              "
              @click="changeDevice(player.id)"
              text
            >
              <v-icon>mdi-spotify</v-icon>
              {{ player.name }}
              <span v-if="DefaultSpotifyInstanceId === player.id"
                >(default)</span
              ></v-btn
            >
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import deviceMixin from "@/mixins/device"

export default {
  mixins: [deviceMixin],
  data() {
    return {
      players: [],
      user: this.$store.getters["authApp/getUser"]
    }
  },
  computed: {
    userRefreshToken() {
      return this.user.refreshToken
    },
    tandafuryPlayerOfThisInstance() {
      return (
        this.$store.state.authSpotify.player ?? this.DefaultSpotifyInstanceId
      )
    },
    DefaultSpotifyInstanceId() {
      return this.$store.state.authSpotify.playerSpotifyDefault
    }
  },
  methods: {
    async changeDevice(idPlayer) {
      this.$store.dispatch("authSpotify/setPlayer", idPlayer)

      if (idPlayer === "classic") return true

      const header = await this.getHeaderSpotify(this.user.refreshToken)
      const serverUrl = "https://api.spotify.com/v1"

      const url = `${serverUrl}/me/player`

      try {
        const result = await this.$axios.put(
          url,
          { device_ids: [idPlayer], play: true },
          header
        )
        return result
      } catch (e) {
        alert("error, please try reloading the page", e)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
