<template>
  <v-container fluid grid-list-md>
    <h1>Tanda list</h1>
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
  middleware: 'spotifyConnexion',
  components: { TandaItem },
  data() {
    return {
      tandas: this.$store.getters['tandas/getTandas']
    }
  },
  mounted() {
    // Remplissage du store
    this.tandas.forEach((tanda) => {
      this.$store.dispatch('tandas/addTanda', tanda)
    })
  }
}
</script>
