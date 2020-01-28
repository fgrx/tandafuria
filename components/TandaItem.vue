<template>
  <div>
    <v-card>
      <v-list-item three-line>
        <v-list-item-content>
          <div class="overline mb-4">{{ tanda.genre }} - {{ tanda.speed }}</div>
          <v-list-item-title class="headline mb-1">{{
            orchestra.title
          }}</v-list-item-title>
          <v-list-item-subtitle v-if="duration || period"
            ><span v-if="period">period : {{ period }}</span
            ><br v-if="period && duration" />
            <span v-if="duration">Duration : {{ duration }}</span>
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-avatar tile size="64" color="grey">
          <v-img :src="tanda.tracks[0].album.images[2].url"></v-img>
        </v-list-item-avatar>
      </v-list-item>
      <v-card-text>
        <template v-for="(track, index) in tanda.tracks">
          <v-list-item two-line>
            <v-list-item-icon><TrackPlayer :track="track" /> </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="track.name"></v-list-item-title>
              <v-list-item-subtitle>
                <span v-for="(artist, index) in track.artists" :key="index"
                  >{{ artist.name }}
                </span>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider
            v-if="index + 1 < tanda.tracks.length"
            :key="index"
          ></v-divider>
        </template>
        <v-expansion-panels v-if="tanda.description">
          <v-expansion-panel>
            <v-expansion-panel-header
              >More informations</v-expansion-panel-header
            >
            <v-expansion-panel-content>
              {{ tanda.description }}
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { orchestras } from '@/data/orchestras'
import TrackPlayer from '~/components/TrackPlayer'

export default {
  components: {
    TrackPlayer
  },
  props: {
    tanda: {
      type: Object
    }
  },
  data() {
    return {
      orchestra: {},
      period: '',
      duration: ''
    }
  },
  mounted() {
    console.log(this.tanda)
    this.orchestra = orchestras.find(
      (orchestra) => orchestra.id === this.tanda.orchestra
    )
    const durationInMS = this.tanda.tracks.reduce(
      (total, track) => track.duration_ms + total,
      0
    )
    this.duration = millisToMinutesAndSeconds(durationInMS)

    this.period = this.tanda.periodStart + ' - ' + this.tanda.periodEnd
  }
}

function millisToMinutesAndSeconds(millis) {
  const minutes = Math.floor(millis / 60000)
  const seconds = ((millis % 60000) / 1000).toFixed(0)
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}
</script>

<style lang="scss" scoped></style>
