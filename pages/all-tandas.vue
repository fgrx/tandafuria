<template>
  <v-container fluid grid-list-md>
    <h1>All tandas</h1>
    <TandasList context="allTandas" />
  </v-container>
</template>

<script>
import TandasList from '@/components/TandasList'
import { orchestras } from '@/data/orchestras'

export default {
  middleware: ['spotifyConnexion'],
  components: { TandasList },
  data() {
    return {
      titleSpecified: 'Browse all tandas'
    }
  },
  head() {
    return {
      title: `Browse all ${this.titleSpecified} tandas`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `Browse all public ${this.titleSpecified} tandas that users shares with us. You can also create your own tandas and share it (or not) with others Tango Djs.`
        }
      ]
    }
  },
  mounted() {
    if (this.$route.query.orchestra) {
      const orchestra = orchestras.filter(
        (e) => e.id === this.$route.query.orchestra
      )
      if (orchestra[0].id !== 'mixed' && orchestra[0].id !== 'other') {
        this.titleSpecified = orchestra[0].title
      }
    }

    if (this.$route.query.genre) {
      this.titleSpecified = this.$route.query.genre
    }
  },
  methods: {}
}
</script>
