<template>
  <div>
    Francisco Canaro
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
    const durationInMS = this.tanda.tracks.reduce(
      (total, track) => track.duration_ms + total,
      0
    )
    this.duration = millisToMinutesAndSeconds(durationInMS)
    this.period = this.tanda.periodStart + ' - ' + this.tanda.periodEnd
  }
  // methods: {
  //   importTandaToLibrary(tanda) {
  //     // Ugly way to deep clone an object in JS to avoid vuex mutations errors
  //     const newTanda = JSON.parse(JSON.stringify(tanda))
  //     newTanda.isPublic = false
  //     newTanda.author.id = this.currentUser.id
  //     newTanda.author.name = this.currentUser.name
  //     this.$store.dispatch('tandas/addTanda', {
  //       target: 'myTandas',
  //       tanda: newTanda
  //     })
  //     this.flash = {
  //       color: 'success',
  //       message: 'Tanda imported to your library',
  //       display: true,
  //       icon: 'mdi-check-circle-outline'
  //     }
  //   }
  // }
}

function millisToMinutesAndSeconds(millis) {
  const minutes = Math.floor(millis / 60000)
  const seconds = ((millis % 60000) / 1000).toFixed(0)
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}
</script>

<style lang="scss" scoped></style>
