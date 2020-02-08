<template>
  <v-container fluid grid-list-md>
    <h1>All tandas</h1>
    <v-layout row wrap>
      <v-flex v-for="(tanda, index) in tandas" :key="index" lg4 md4 xs6>
        <TandaItem :tanda="tanda" />
      </v-flex>
    </v-layout>
    <NoTandaMessage v-if="tandas.length === 0" title="No tanda for now" />
  </v-container>
</template>

<script>
import TandaItem from '@/components/TandaItem'
import NoTandaMessage from '@/components/NoTandaMessage'

export default {
  // middleware: ['spotifyConnexion', 'appAuthorization'],
  middleware: ['appAuthorization'],
  components: { TandaItem, NoTandaMessage },
  data() {
    return {
      tandas: this.$store.getters['tandas/getAllTandas']
    }
  },
  mounted() {}
}
</script>
