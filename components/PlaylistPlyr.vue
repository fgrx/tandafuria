<template>
  <div class="text-center">
    <v-bottom-sheet v-model="display" @input="(v) => v || close()" dark inset>
      <v-list>
        <v-list-item>
          <v-list-item-content v-if="currentTrack">
            <v-list-item-title>{{ currentTrack.name }}</v-list-item-title>
            <v-list-item-subtitle
              ><span
                v-for="(artist, index) in currentTrack.artists"
                :key="index"
                >{{ artist.name }}
              </span></v-list-item-subtitle
            >
          </v-list-item-content>

          <v-spacer></v-spacer>

          <v-list-item-icon>
            <v-btn @click="previous()" icon>
              <v-icon>mdi-skip-previous</v-icon>
            </v-btn>
          </v-list-item-icon>

          <v-list-item-icon>
            <v-btn v-if="!isPlaying" @click="undoPause()" value="favorites">
              <v-icon>mdi-play-circle-outline</v-icon>
            </v-btn>
            <v-btn v-if="isPlaying" @click="pause()" value="favorites">
              <v-icon>mdi-pause-circle-outline</v-icon>
            </v-btn>
          </v-list-item-icon>

          <v-list-item-icon class="ml-0">
            <v-btn @click="next()" icon>
              <v-icon>mdi-skip-next</v-icon>
            </v-btn>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-bottom-sheet>
    <vue-plyr ref="bottomPlayer">
      <audio>
        <source :src="playTrack" type="audio/mp3" />
      </audio>
    </vue-plyr>
  </div>
</template>

<script>
export default {
  data() {
    return {
      display: false,
      playlist: null,
      playTrack: null,
      playerComponentRef: null,
      currentTrackPosition: 0,
      currentTrack: null,
      isPlaying: true
    }
  },
  computed: {
    player() {
      const playerRef = 'bottomPlayer'
      return this.$refs[playerRef].player
    }
  },
  mounted() {
    this.$bus.$on('playlistPlyr', (params) => {
      this.display = true
      this.playlist = params.playlist
      this.playTrack = this.playlist[0].preview_url
      this.isPlaying = true
      this.currentTrackPosition = 0
      this.play(this.playlist[this.currentTrackPosition])
    })
    const playerComponentRef = this.player

    playerComponentRef.on('ended', (event) => {
      this.next()
    })
  },
  methods: {
    close() {
      this.display = false
      const playerComponentRef = this.player
      playerComponentRef.pause()
    },
    pause() {
      const playerComponentRef = this.player
      playerComponentRef.pause()
      this.isPlaying = false
    },
    undoPause() {
      const playerComponentRef = this.player
      playerComponentRef.play()
      this.isPlaying = true
    },
    next() {
      if (this.currentTrackPosition + 1 < this.playlist.length) {
        this.currentTrackPosition++
        this.play(this.playlist[this.currentTrackPosition])
        this.isPlaying = true
      }
    },
    previous() {
      if (this.currentTrackPosition - 1 >= 0) {
        this.currentTrackPosition--
        this.play(this.playlist[this.currentTrackPosition])
        this.isPlaying = true
      }
    },
    play(track) {
      const playerComponentRef = this.player
      playerComponentRef.source = this.setSource(track)
      playerComponentRef.on('ready', (event) => {
        playerComponentRef.play()
      })
      this.currentTrack = track
    },
    setSource(track) {
      return {
        type: 'audio',
        sources: [
          {
            src: track.preview_url,
            type: 'audio/mp3'
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hide {
  display: none;
}
</style>
