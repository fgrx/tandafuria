<template>
  <v-container justify-center align-center>
    <v-card>
      <v-card-title>
        <h1>Tanda editor</h1>
      </v-card-title>
      <v-card-text><TandaForm /></v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import TandaForm from '@/components/TandaForm'
export default {
  middleware: ['appAuthorization'],

  components: {
    TandaForm
  },
  mounted() {}
}
</script>

<style lang="scss" scoped></style>
