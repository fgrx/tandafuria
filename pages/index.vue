<template>
  <v-container fluid grid-list-md>
    <h1>My tandas</h1>
    <v-layout row wrap>
      <v-flex v-for="(tanda, index) in tandas" :key="index" lg4 md4 xs6>
        <TandaItem :tanda="tanda" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import TandaItem from '@/components/TandaItem'

export default {
  middleware: ['spotifyConnexion', 'appAuthorization', 'initializeAppData'],
  components: { TandaItem },
  data() {
    return {
      tandas: this.$store.getters['tandas/getMyTandas']
    }
  },
  mounted() {}
}
</script>
