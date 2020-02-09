<template>
  <v-card>
    <v-card-title><h1>Browser</h1></v-card-title>

    <v-card-text>
      <v-text-field
        ref="searchString"
        v-model="searchString"
        placeholder="search an artist, a song, ... exemple : la cumparsita"
        append-outer-icon="mdi-magnify"
        solo
        prepend-inner-icon="mdi-file-find-outline"
        @click:append-outer="searchSpotify"
        clearable
        @keydown.enter="searchSpotify"
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
          <TrackItem :track="track" @clicked="addTrackAction" />

          <v-divider v-if="index + 1 < tracks.length" :key="index"></v-divider>
        </template>
        <div class="text-center">
          <v-btn color="primary" @click="showMore()">Show more</v-btn>
        </div>
      </v-list>
      <div class="text-center" v-if="loading">
        <v-progress-circular
          size="70"
          width="7"
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import TrackItem from '~/components/TrackItem'

export default {
  components: {
    TrackItem
  },
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
  },
  methods: {
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
        const url = `https://tandafuria.herokuapp.com/spotify/search/${search}/${offset}`
        const resultSearch = await this.$axios.get(url)
        return resultSearch
      } catch (e) {
        console.log('search error', e)
      }
    },
    addTrackAction(track) {
      console.log('pouet')
      this.$emit('clicked', track)
    }
  }
}
</script>

<style lang="scss" scoped></style>
