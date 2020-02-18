<template>
  <v-container fluid grid-list-md>
    <h1>My tandas</h1>
    <v-layout row wrap>
      <v-flex v-for="(tanda, index) in tandas" :key="index" xl3 lg4 md6 xs12>
        <TandaItem :tanda="tanda" />
      </v-flex>
    </v-layout>
    <NoTandaMessage
      v-if="tandas.length === 0"
      title="No tanda in your library"
    />
  </v-container>
</template>

<script>
import TandaItem from '@/components/TandaItem'
import NoTandaMessage from '@/components/NoTandaMessage'

export default {
  middleware: ['appAuthorization', 'spotifyConnexion'],
  components: { TandaItem, NoTandaMessage },
  data() {
    return {
      tandas: this.$store.getters['tandas/getMyTandas']
    }
  },
  mounted() {
    console.log(this.tandas)
  }
}
</script>
