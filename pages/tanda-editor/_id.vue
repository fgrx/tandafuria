<template>
  <v-container justify-center align-center>
    <v-card>
      <v-card-title>
        Tanda editor
      </v-card-title>

      <v-card-text v-if="loaded"
        ><TandaForm :tandaToModify="tanda"
      /></v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import TandaForm from '@/components/TandaForm'
import { tandaService } from '@/services/tandas.service.js'

export default {
  middleware: ['appAuthorization', 'spotifyConnexion'],

  components: {
    TandaForm
  },
  data() {
    return {
      tanda: {},
      loaded: false
    }
  },
  async mounted() {
    const tandaQueryResult = await tandaService.getOneTanda(
      this.$route.params.id
    )
    this.tanda = tandaQueryResult

    this.loaded = true
  }
}
</script>

<style lang="scss" scoped></style>
