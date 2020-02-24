<template>
  <v-list-item four-line>
    <v-list-item-icon v-if="fullSong"
      ><TrackPlayerSpotify :track="track" />
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title v-text="track.name"></v-list-item-title>

      <v-list-item-subtitle>
        <span v-for="(artist, index) in track.artists" :key="index"
          >{{ artist.name }} </span
        ><br />
        <span v-if="track.album">Album : {{ track.album.name }}</span
        ><br />
        <v-btn
          :href="youtubeLink"
          target="_blank"
          color="secondary"
          outlined
          small
          ><v-icon>mdi-youtube</v-icon>Find on Youtube
        </v-btn>
      </v-list-item-subtitle>
      <TrackPlyr v-if="!fullSong" :track="track" />
    </v-list-item-content>
    <v-list-item-action v-if="mode === 'browser'">
      <v-btn @click="addTrackAction(track)" icon>
        <v-icon color="grey lighten-1">mdi-plus-box</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import TrackPlayerSpotify from '~/components/TrackPlayerSpotify'
import TrackPlyr from '~/components/TrackPlyr'

export default {
  components: {
    TrackPlayerSpotify,
    TrackPlyr
  },
  props: {
    track: {
      type: Object,
      default: null
    },
    mode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fullSong: false,
      youtubeLink: ''
    }
  },
  mounted() {
    const user = this.$store.getters['authApp/getUser']
    if (user.spotify) this.fullSong = true

    const reducer = (acc, artist) => acc + ',' + artist.name

    const artistsSearch = this.track.artists.reduce(reducer, '')

    this.youtubeLink = `https://www.youtube.com/results?search_query=${this.track.name}+${artistsSearch}`
  },
  methods: {
    addTrackAction(track) {
      this.$emit('clicked', track)
    }
  }
}
</script>

<style lang="scss" scoped></style>
