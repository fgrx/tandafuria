<template>
  <v-container fluid grid-list-md>
    <h1>My tandas</h1>
    <v-layout row wrap>
      <v-flex v-for="(tanda, index) in tandas" :key="index" xl3 lg4 md6 xs12>
        <TandaItem :tanda="tanda" />
      </v-flex>
    </v-layout>
    <loader v-if="loading" />
    <NoTandaMessage
      v-if="tandas.length === 0 && !loading"
      title="No tanda in your library"
    />
  </v-container>
</template>

<script>
import TandaItem from '@/components/TandaItem'
import NoTandaMessage from '@/components/NoTandaMessage'
import loader from '@/components/loader'
import { tandaService } from '@/services/tandas.service'

export default {
  middleware: ['appAuthorization', 'spotifyConnexion'],
  components: { TandaItem, NoTandaMessage, loader },
  data() {
    return {
      tandas: this.$store.getters['tandas/getMyTandas'],
      loading: false
    }
  },
  async mounted() {
    this.loading = true
    const user = this.$store.getters['authApp/getUser']
    if (user.id) {
      const myTandas = await tandaService.getTandasUser(user.id)

      myTandas.tandas.forEach((tanda) => {
        this.$store.dispatch('tandas/addTanda', { target: 'myTandas', tanda })
      })
    }
    this.loading = false
  }
}
</script>
