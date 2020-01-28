<template>
  <v-card>
    <v-card-title><h1>Spotify Browser</h1></v-card-title>

    <v-card-text>
      <v-text-field
        v-model="searchString"
        placeholder="search an artist, a song, ... exemple : la cumparsita"
        @keyup="searchSpotify"
        solo
        prepend-inner-icon="mdi-file-find-outline"
      ></v-text-field>
      <v-list
        two-line
        subheader
        v-if="tracks.length > 0"
        style="max-height: 500px"
        class="overflow-y-auto"
      >
        <h2>Results</h2>
        <template v-for="(track, index) in tracks">
          <v-list-item two-line>
            <v-list-item-icon><TrackPlayer :track="track" /> </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="track.name"></v-list-item-title>
              <v-list-item-subtitle>
                <span v-for="artist in track.artists">{{ artist.name }} </span>
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn icon @click="addTrack(track)">
                <v-icon color="grey lighten-1">mdi-plus-box</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>

          <v-divider v-if="index + 1 < tracks.length" :key="index"></v-divider>
        </template>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import TrackPlayer from '~/components/TrackPlayer'

export default {
  components: {
    TrackPlayer
  },
  data() {
    return {
      searchString: '',
      tracks: {}
    }
  },
  mounted() {
    console.log('token', this.$store.getters['authSpotify/getToken'])
  },
  methods: {
    browserClose() {
      this.dialogBrowserSpotify = false
    },
    searchSpotify() {
      // timeout is used to add delay before sending request to spotify to let user finishing typing
      let timeout = null
      if (this.searchString.length >= 3) {
        clearTimeout(timeout)

        timeout = setTimeout(async () => {
          const results = await this.sendRequestToSpotify(this.searchString)
          this.tracks = results.data.tracks.items
          console.log(results.data.tracks.items)
        }, 500)
      }
    },
    async sendRequestToSpotify(search) {
      try {
        const resultSearch = await this.$axios({
          method: 'get',
          params: {
            q: search,
            type: 'track',
            access_token: this.$store.getters['authSpotify/getToken']
          },
          url: 'https://api.spotify.com/v1/search'
        })
        return resultSearch
      } catch (e) {
        if (e.response.status === 401) {
          // Auth error so reset the credentials
        }
      }
    },
    addTrack(track) {
      this.$emit('clicked', track)
    }
  }
}
</script>

<style lang="scss" scoped></style>
