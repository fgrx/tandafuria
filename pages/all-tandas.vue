<template>
  <v-container fluid grid-list-md>
    <h1>All tandas</h1>
    <TandasList context="allTandas" />
  </v-container>
</template>

<script>
import TandasList from '@/components/TandasList'

export default {
  components: { TandasList },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>
