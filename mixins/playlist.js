export default {
  methods: {
    playPlaylistMixin(playlist, track) {
      this.$store.dispatch("player/setPlaylistPlaying", playlist)
      this.$store.dispatch("player/setTrackPlaying", track)
      this.$bus.$emit("playlistPlayer", {
        display: true,
        track
      })
    }
  }
}
