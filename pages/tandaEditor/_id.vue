<template>
  <v-container justify-center align-center>
    <v-card>
      <v-card-title>
        Tanda editor
      </v-card-title>
      <v-card-text
        ><TandaForm v-if="loaded" :tandaToModify="tanda"
      /></v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import TandaForm from '@/components/TandaForm'
import { tandaService } from '@/services/tandas.service.js'

export default {
  middleware: 'spotifyConnexion',

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
    this.tanda = tandaQueryResult.data
    this.loaded = true
    console.log('tomodify', this.tanda)
  }
}
</script>

<style lang="scss" scoped></style>
