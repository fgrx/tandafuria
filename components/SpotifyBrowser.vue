<template>
  <v-card ref="browser">
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
        <div id="resultsBrowser" ref="resultsBrowser">
          <h2>Results for "{{ textResults }}"</h2>
          <v-btn v-if="back" @click="searchSpotify()" text
            ><v-icon>mdi-arrow-left-circle</v-icon>
            Back to results
          </v-btn>
          <template v-for="(track, index) in tracks">
            <TrackItem
              @clicked="addTrackAction"
              @requestAlbum="requestAlbumAction"
              :track="track"
              :key="index"
              mode="browser"
            />

            <v-divider
              v-if="index + 1 < tracks.length"
              :key="track._id"
            ></v-divider>
          </template>
          <div v-if="mode !== 'album'" class="text-center">
            <v-btn @click="showMore()" color="primary">Show more</v-btn>
          </div>
          <v-btn v-if="back" @click="searchSpotify()" text
            ><v-icon>mdi-arrow-left-circle</v-icon>
            Back to results
          </v-btn>
        </div>
      </v-list>

      <LoaderCircular v-if="loading" />
    </v-card-text>
  </v-card>
</template>

<script>
import LoaderCircular from '@/components/LoaderCircular'
import TrackItem from '~/components/TrackItem'

export default {
  components: {
    TrackItem,
    LoaderCircular
  },
  middleware: ['spotifyConnexion'],
  props: {
    searchDefault: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      searchString: this.searchDefault,
      tracks: [],
      loading: false,
      offset: 0,
      back: false,
      textResults: '',
      mode: 'all'
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
      this.textResults = this.searchString
      this.back = false
      this.tracks = await this.launchRequest()
    },
    async showMore(offset) {
      this.offset += 20
      const results = await this.launchRequest()
      this.tracks.push(...results)
    },
    async launchRequest() {
      this.loading = true
      this.mode = 'all'
      const results = await this.sendRequestToSpotify({
        search: this.searchString,
        offset: this.offset
      })

      this.loading = false
      return results.data.tracks.items
    },

    async sendRequestToSpotify({ search, mode, offset }) {
      try {
        const serverUrl =
          process.env.NODE_ENV === 'development'
            ? process.env.DEV_serverUrl
            : process.env.PROD_serverUrl

        let url = `${serverUrl}/spotify/search/songs/${search}/${offset}`
        if (mode === 'album') {
          url = `${serverUrl}/spotify/search/albums/${search}/${offset}`
        }

        const resultSearch = await this.$axios.get(url)

        return resultSearch
      } catch (e) {
        alert('Search error, please contact me to help me fix this problem', e)
      }
    },
    addTrackAction(track) {
      if (track.available_markets) track.available_markets = null
      if (track.album.available_markets) track.album.available_markets = null
      this.$emit('clicked', track)
    },
    async requestAlbumAction(album) {
      this.back = true
      this.loading = true
      this.mode = 'album'

      const results = await this.sendRequestToSpotify({
        search: album.id,
        mode: 'album',
        offset: this.offset
      })

      this.textResults = 'album ' + results.data.name
      const tracksWithoutAlbum = results.data.tracks.items

      tracksWithoutAlbum.forEach((track) => (track.album = album))

      this.tracks = tracksWithoutAlbum

      this.loading = false

      const container = this.$el.querySelector('#resultsBrowser')
      //this.$refs.resultsBrowser.scrollTop = 0
      console.log(container.scrollHeight)
      container.scrollY = 0
    }
  }
}
</script>

<style lang="scss" scoped></style>
