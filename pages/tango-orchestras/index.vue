<template>
  <v-container fluid grid-list-md>
    <h1>Tango orchestras</h1>
    <v-row>
      <v-col
        cols="6"
        md="3"
        v-for="orchestra in orchestrasData"
        :key="orchestra.id"
      >
        <MaestroItem :maestro="orchestra" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { orchestras } from "@/data/orchestras.js"
import MaestroItem from "@/components/MaestroItem"

export default {
  components: {
    MaestroItem,
  },
  data() {
    return {
      orchestrasData: orchestras,
    }
  },
}
</script>

<style lang="scss" scoped>
</style>
