<template>
  <v-card>
    <v-card-title><h1>Browser</h1></v-card-title>

    <v-card-text>
      <v-text-field
        ref="searchString"
        @click:append-outer="searchSpotify"
        @keydown.enter="searchSpotify"
        v-model="searchString"
        placeholder="search an artist, a song, ... exemple : la cumparsita"
        append-outer-icon="mdi-magnify"
        solo
        prepend-inner-icon="mdi-file-find-outline"
        clearable
      ></v-text-field>
      <v-list
        v-if="tracks.length > 0"
        two-line
        subheader
        style="max-height: 500px"
        class="overflow-y-auto"
      >
        <h2>Results</h2>
        <template v-for="(track, index) in tracks">
          <TrackItem @clicked="addTrackAction" :track="track" mode="browser" />

          <v-divider v-if="index + 1 < tracks.length" :key="index"></v-divider>
        </template>
        <div class="text-center">
          <v-btn @click="showMore()" color="primary">Show more</v-btn>
        </div>
      </v-list>

      <Loader v-if="loading" />
    </v-card-text>
  </v-card>
</template>

<script>
import TrackItem from '~/components/TrackItem'
import Loader from '@/components/Loader'

export default {
  components: {
    TrackItem,
    Loader
  },
  middleware: ['spotifyConnexion'],
  data() {
    return {
      searchString: '',
      tracks: [],
      loading: false,
      offset: 0
    }
  },
  mounted() {
    // sfautofocus
    this.$nextTick(this.$refs.searchString.focus)
    this.$bus.$on('initBrowser', (orchestra) => this.initBrowser(orchestra))
  },
  methods: {
    initBrowser(orchestra) {
      this.tracks = []
    },
    browserClose() {
      this.dialogBrowserSpotify = false
    },
    async searchSpotify() {
      this.tracks = await this.launchRequest()
    },
    async showMore(offset) {
      this.offset += 20
      const results = await this.launchRequest()
      this.tracks.push(...results)
    },
    async launchRequest() {
      this.loading = true
      const results = await this.sendRequestToSpotify({
        search: this.searchString,
        offset: this.offset
      })

      this.loading = false
      return results.data.tracks.items
    },

    async sendRequestToSpotify({ search, offset }) {
      try {
        const serverUrl =
          process.env.NODE_ENV === 'development'
            ? process.env.DEV_serverUrl
            : process.env.PROD_serverUrl
        const url = `${serverUrl}/spotify/search/${search}/${offset}`
        const resultSearch = await this.$axios.get(url)
        return resultSearch
      } catch (e) {
        alert('Search error, please contact me to help me fix this problem', e)
      }
    },
    addTrackAction(track) {
      this.$emit('clicked', track)
    }
  }
}
</script>

<style lang="scss" scoped></style>
