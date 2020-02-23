<template>
  <div>
    <v-card class="ma-2 pa-1 element" light shaped>
      <v-list-item four-line>
        <v-list-item-content>
          <v-list-item-subtitle>
            <RatingInfos :tanda="tanda" />
          </v-list-item-subtitle>

          <div class="overline ">{{ tanda.genre }} - {{ tanda.speed }}</div>
          <v-list-item-title two-line class="headline mb-1">{{
            orchestra.title
          }}</v-list-item-title>

          <v-list-item-subtitle v-if="tanda.singer || tanda.isInstrumental">
            Singer : {{ tanda.singer }}
            <span v-if="tanda.isInstrumental">(instrumental)</span>
          </v-list-item-subtitle>

          <v-list-item-subtitle v-if="duration || period">
            <span>Created by : {{ tanda.author.name }}</span
            ><br />
            <span v-if="duration">Duration : {{ duration }}</span>
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-avatar v-if="tanda.tracks[0]" tile size="64" color="grey">
          <v-img :src="tanda.tracks[0].album.images[2].url"></v-img>
        </v-list-item-avatar>
      </v-list-item>

      <template v-for="(track, index) in tanda.tracks">
        <TrackItem :track="track" />
        <v-divider
          v-if="index + 1 < tanda.tracks.length"
          :key="index"
        ></v-divider>
      </template>

      <v-card-actions>
        <v-btn
          v-if="tanda.author.id !== currentUser.id && currentUser.id"
          @click="importTandaToLibrary(tanda)"
          color="primary"
          text
          ><v-icon>mdi-import</v-icon> Add to my tandas</v-btn
        >

        <v-btn
          :to="{ name: 'tanda-editor-id', params: { id: tanda._id } }"
          v-if="tanda.author.id === currentUser.id"
          color="primary"
          text
          ><v-icon>mdi-pencil</v-icon>
          Edit
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn @click="showMore = !showMore" icon>
          <v-icon>{{
            showMore ? 'mdi-chevron-up' : 'mdi-chevron-down'
          }}</v-icon>
        </v-btn>
      </v-card-actions>

      <v-expand-transition>
        <div v-show="showMore">
          <v-divider></v-divider>

          <v-card-text>
            <p class="tandaDateCreator">
              Date :
              {{ $moment(tanda.date).calendar() }}<br />

              <span v-if="period.start">period : {{ period }}</span
              ><br v-if="period.start" />
            </p>
            <div v-if="tanda.description" class="tandaDescription">
              {{ tanda.description }}
            </div>
          </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
    <v-snackbar v-model="flash.display" :color="flash.color">
      <v-icon>{{ flash.icon }}</v-icon
      >{{ flash.message }}
      <v-btn @click="snackbar = false" text>
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { orchestras } from '@/data/orchestras'
import TrackItem from '~/components/TrackItem'

import { tandaService } from '@/services/tandas.service.js'

import RatingInfos from '@/components/RatingInfos'

export default {
  components: {
    TrackItem,
    RatingInfos
  },
  props: {
    tanda: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      orchestra: {},
      flash: { message: '', display: false, icon: 'mdi-check-circle-outline' },
      flashMessage: false,
      textFlashMessage: '',
      period: '',
      duration: '',
      showMore: false,
      currentUser: this.$store.getters['authApp/getUser']
    }
  },
  mounted() {
    this.orchestra = orchestras.find(
      (orchestra) => orchestra.id === this.tanda.orchestra
    )

    this.period = this.displayPeriod(this.tanda)
  },
  methods: {
    importTandaToLibrary(tanda) {
      // Ugly way to deep clone an object in JS to avoid vuex mutations errors
      const newTanda = JSON.parse(JSON.stringify(tanda))
      newTanda.origin = {
        author: { id: tanda.author.id, name: tanda.author.name },
        id: tanda._id
      }

      delete newTanda._id
      delete newTanda.date
      newTanda.isPublic = false

      newTanda.author.id = this.currentUser.id
      newTanda.author.name = this.currentUser.name

      tandaService.save(newTanda, this.currentUser.token)

      this.$store.dispatch('tandas/addTanda', {
        target: 'myTandas',
        tanda: newTanda
      })
      this.flash = {
        color: 'success',
        message: 'Tanda imported to your library',
        display: true,
        icon: 'mdi-check-circle-outline'
      }
    },
    displayPeriod(tanda) {
      if (tanda.tracks.length > 0) {
        const durationInMS = tanda.tracks.reduce(
          (total, track) => track.duration_ms + total,
          0
        )
        this.duration = millisToMinutesAndSeconds(durationInMS)
      }

      return tanda.periodStart + ' - ' + tanda.periodEnd
    }
  }
}

function millisToMinutesAndSeconds(millis) {
  const minutes = Math.floor(millis / 60000)
  const seconds = ((millis % 60000) / 1000).toFixed(0)
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}
</script>

<style lang="scss" scoped></style>
