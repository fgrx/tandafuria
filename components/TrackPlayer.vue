<template>
  <div>
    <v-btn @click="play()" color="primary" fab x-small dark>
      <v-icon>{{ icon }}</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    track: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      icon: 'mdi-play-circle'
    }
  },
  created() {},
  mounted() {},

  methods: {
    play() {
      const playlist = []
      playlist.push(this.track)
      this.$bus.$emit('playlistPlayer', {
        display: true,
        playlist
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
