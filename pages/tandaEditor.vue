<template>
  <v-container justify-center align-center>
    <v-card>
      <v-card-title>
        Tanda editor
      </v-card-title>
      <v-card-text><TandaForm /></v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import TandaForm from '@/components/TandaForm'
export default {
  middleware: 'spotifyConnexion',
  components: {
    TandaForm
  }
}
</script>

<style lang="scss" scoped></style>
