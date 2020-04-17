<template>
  <v-row class="mx-auto mb-4 mt-4">
    <v-col offset-md="3" md="6">
      <h1>
        <span v-if:="tanda.instrumental">Instrumental</span>
        {{ orchestra.title }} {{ tanda.genre }} tanda
        <span v-if:="!tanda.instrumental">{{ tanda.singer }} </span>
      </h1>
      <TandaItem v-if="tanda.tracks" :tanda="tanda" />
      <div class="spaceBottom"></div>
    </v-col>
  </v-row>
</template>

<script>
import { tandaService } from '@/services/tandas.service.js'
import { orchestras } from '@/data/orchestras'

import TandaItem from '~/components/TandaItem'

export default {
  components: {
    TandaItem
  },
  head() {
    const tandaDate = this.$moment(this.tanda.date).format('MM-DD-YYYY')
    return {
      title: `${this.orchestra.title} ${this.tanda.genre} tanda by ${this.tanda.author.name} the ${tandaDate}`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `${this.orchestra.title} ${this.tanda.genre} tanda created by ${this.tanda.author.name} containing ${this.tanda.tracks.length} tracks`
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: `${this.orchestra.title} ${this.tanda.genre} tanda by ${this.tanda.author.name} the ${tandaDate}`
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: `${this.orchestra.title} ${this.tanda.genre} tanda created by ${this.tanda.author.name} containing ${this.tanda.tracks.length} tracks`
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: this.tanda.tracks[0].album.images[0].url
          //content: require('@/static/tandafurybanner.jpg')
        }
        /*
        {
          hid: 'og:image:width',
          name: 'og:image:width',
          content: `1280`
        },
        {
          hid: 'og:image:height',
          name: 'og:image:height',
          content: `486`
        }*/
      ]
    }
  },
  data() {
    return {
      id: this.$route.params.id,
      tanda: this.tanda,
      orchestra: this.orchestra
    }
  },

  async asyncData({ params }) {
    const tanda = await tandaService.getOneTanda(params.id)
    const orchestra = orchestras.find(
      (orchestra) => orchestra.id === tanda.orchestra
    )

    return {
      tanda,
      orchestra
    }
  },

  mounted() {}
}
</script>

<style lang="scss" scoped></style>
