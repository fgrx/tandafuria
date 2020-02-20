<template>
  <v-container fluid grid-list-md>
    <h1>My tandas</h1>
    <TandasList context="myTandas" />
  </v-container>
</template>

<script>
import TandasList from '@/components/TandasList'

export default {
  middleware: ['spotifyConnexion'],
  components: { TandasList },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>
