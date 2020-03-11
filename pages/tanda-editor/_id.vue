<template>
  <v-container justify-center align-center>
    <Loader v-if="!loaded" />
    <v-card class="mx-auto mt-4 mb-4" max-width="850">
      <v-card-title>
        <h1>Tanda editor</h1>
      </v-card-title>

      <v-card-text v-if="loaded"
        ><TandaForm :tandaToModify="tanda"
      /></v-card-text>
    </v-card>
    <div class="spaceBottom"></div>
  </v-container>
</template>

<script>
import TandaForm from '@/components/TandaForm'
import { tandaService } from '@/services/tandas.service.js'
import Loader from '@/components/Loader'

export default {
  middleware: ['appAuthorization', 'spotifyConnexion'],

  components: {
    TandaForm,
    Loader
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
