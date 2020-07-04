<template>
  <v-btn @click="play()" color="primary" small fab depressed dark>
    <v-icon>{{ icon }}</v-icon>
  </v-btn>
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
      icon: "mdi-play-circle"
    }
  },
  created() {},
  mounted() {},

  methods: {
    play() {
      const playlist = []
      playlist.push(this.track)
      this.$bus.$emit("playlistPlayer", {
        display: true,
        playlist
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
