<template>
  <v-list-item four-line>
    <v-list-item-icon>
      <v-btn @click="play()" color="primary" small fab depressed dark>
        <v-icon>mdi-play-circle</v-icon>
      </v-btn>
    </v-list-item-icon>
    <v-list-item-content>
      <p v-if="track.duplicate" class="duplicate">
        <v-icon class="duplicate">mdi-alert-decagram</v-icon>
        Similar song detected !
      </p>

      <v-list-item-title v-text="track.name"></v-list-item-title>

      <v-list-item-subtitle class="text--primary">
        <span v-for="(artist, index) in track.artists" :key="index"
          >{{ artist.name }}
        </span>
        <span v-if="track.album">
          <br />
          {{ track.album.name.substr(0, 30) }} </span
        ><br />
        <v-btn
          v-if="track.album && mode === 'browser'"
          @click="requestAlbum(track.album)"
          color="primary"
          small
          outlined
        >
          <v-icon>mdi-album</v-icon>Album</v-btn
        >

        <v-btn :href="youtubeLink" target="_blank" color="red" small outlined
          ><v-icon>mdi-youtube</v-icon>Youtube
        </v-btn>

        <v-btn :href="elRecodoLink" target="_blank" color="blue" small outlined
          ><v-icon>mdi-database-search</v-icon>El Recodo
        </v-btn>
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action v-if="mode === 'browser'">
      <v-btn @click="addTrackAction(track)" icon x-large>
        <v-icon color="primary lighten-1">mdi-plus-box</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import playlistMixin from "@/mixins/playlist"

export default {
  components: {},
  mixins: [playlistMixin],
  props: {
    track: {
      type: Object,
      default: null
    },
    trackNumber: {
      type: Number,
      default: 0
    },
    playlist: {
      type: Object,
      default: null
    },
    mode: {
      type: String,
      default: ""
    },
    playerId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      fullSong: false,
      youtubeLink: "",
      elRecodoLink: ""
    }
  },
  mounted() {
    const user = this.$store.getters["authApp/getUser"]
    if (user.spotify) this.fullSong = true

    const reducer = (acc, artist) => acc + "," + artist.name

    const artistsSearch = this.track.artists.reduce(reducer, "")

    const trackNameForSearch = this.track.name
      .replace(" - Remastered", "")
      .replace(" - Remasterizado", "")
      .replace(" - Instrumental", "")

    this.youtubeLink = `https://www.youtube.com/results?search_query=${trackNameForSearch}+${artistsSearch}`
    this.elRecodoLink = `https://www.el-recodo.com/music?lang=en&T=${trackNameForSearch}`
  },

  methods: {
    addTrackAction(track) {
      this.$emit("clicked", track)
    },
    requestAlbum(album) {
      this.$emit("requestAlbum", album)
    },
    play() {
      this.playPlaylistMixin(this.playlist, this.track)
    }
  }
}
</script>

<style lang="scss" scoped>
.duplicate {
  color: rgb(219, 106, 0) !important;
}
</style>
