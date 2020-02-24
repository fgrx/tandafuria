<template>
  <vue-plyr :ref="track.id">
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
    }
  },
  computed: {
    player() {
      return this.$refs[this.track.id].player
    }
  },
  mounted() {
    this.refComponent = this.track.id

    const playingComponentRef = this.player
    console.log(playingComponentRef)
    this.player.on('play', function() {
      playingComponentRef.stop()
    })

    // console.log(playingComponentRef)

    /*
    this.$root.$on('stopPlaying', (playingComponentRef) => {
      if (playingComponentRef === this.refComponent) {
        this.stop()
      }
    })
    */
  }
}
</script>

<style lang="scss" scoped></style>
