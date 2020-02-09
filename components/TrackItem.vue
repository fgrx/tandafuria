<template>
  <v-list-item three-line>
    <v-list-item-icon v-if="fullSong"
      ><TrackPlayerSpotify :track="track" />
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title v-text="track.name"></v-list-item-title>
      <v-list-item-subtitle>
        <span v-for="(artist, index) in track.artists" :key="index"
          >{{ artist.name }} </span
        ><br />
        <span v-if="track.album">Album : {{ track.album.name }}</span>
      </v-list-item-subtitle>
      <vue-plyr v-if="!fullSong">
        <audio>
          <source :src="track.preview_url" type="audio/mp3" />
        </audio>
      </vue-plyr>
    </v-list-item-content>
    <v-list-item-action>
      <v-btn icon @click="addTrackAction(track)">
        <v-icon color="grey lighten-1">mdi-plus-box</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import TrackPlayerSpotify from '~/components/TrackPlayerSpotify'
export default {
  components: {
    TrackPlayerSpotify
  },
  props: {
    track: {
      type: Object
    }
  },
  data() {
    return {
      fullSong: false
    }
  },
  mounted() {
    if (this.$store.getters['authSpotify/getToken'] !== '') this.fullSong = true
  },
  methods: {
    addTrackAction(track) {
      this.$emit('clicked', track)
    }
  }
}
</script>

<style lang="scss" scoped></style>
