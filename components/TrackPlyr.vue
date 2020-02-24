<template>
  <vue-plyr :ref="playerId">
    <audio>
      <source :src="track.preview_url" type="audio/mp3" />
    </audio>
  </vue-plyr>
</template>

<script>
export default {
  props: {
    track: {
      type: Object,
      default: null
    },
    playerId: {
      type: String,
      default: null
    }
  },
  computed: {
    player() {
      const playerRef = this.playerId
      return this.$refs[playerRef].player
    }
  },
  mounted() {
    const playerComponentRef = this.player
    const trackComponent = this.track.id
    const bus = this.$bus

    playerComponentRef.on('play', function() {
      bus.$emit('playTrackPlyr', trackComponent)
    })

    bus.$on('playTrackPlyr', (element) => {
      if (trackComponent !== element) playerComponentRef.stop()
    })
  }
}
</script>

<style lang="scss" scoped></style>
