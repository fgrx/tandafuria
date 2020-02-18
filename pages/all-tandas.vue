<template>
  <v-container fluid grid-list-md>
    <h1>All tandas</h1>

    <v-row justify="center">
      <v-expansion-panels class="pa-5">
        <v-expansion-panel>
          <v-expansion-panel-header>
            Search in all tandas
            <template v-slot:actions>
              <v-icon>mdi-magnify</v-icon>
            </template>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <v-select
              v-model="orchestraField"
              :items="orchestraList"
              label="Orchestra"
              item-text="title"
              item-value="id"
            ></v-select>

            <v-select
              v-model="genreField"
              :items="genreList"
              label="musical genre"
              class="inputGenre"
              item-text="name"
              item-value="id"
            ></v-select>

            <v-text-field
              v-model="singerField"
              label="Singer"
              placeholder="example : Alberto Moran"
            ></v-text-field>

            <v-select
              v-model="speedField"
              :items="speedList"
              label="Speed"
            ></v-select>

            <v-btn @click="searchTandas()" color="primary"
              ><v-icon>mdi-magnify</v-icon> Search</v-btn
            >
            <v-btn @click="searchClear()">Clear</v-btn>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>

    <v-layout row wrap>
      <v-flex v-for="(tanda, index) in tandas" :key="index" xl3 lg4 md6 xs12>
        <TandaItem :tanda="tanda" />
      </v-flex>
    </v-layout>
    <NoTandaMessage v-if="tandas.length === 0" title="No tanda for now" />
  </v-container>
</template>

<script>
import TandaItem from '@/components/TandaItem'
import NoTandaMessage from '@/components/NoTandaMessage'

import { genres } from '@/data/genres'
import { speed } from '@/data/speed'
import { orchestras } from '@/data/orchestras'

export default {
  middleware: ['spotifyConnexion'],
  components: { TandaItem, NoTandaMessage },
  data() {
    return {
      tandas: this.$store.getters['tandas/getAllTandas'],
      speedList: speed,
      orchestraList: orchestras,
      genreList: genres,
      orchestraField: '',
      speedField: '',
      genreField: '',
      singerField: ''
    }
  },
  mounted() {},
  methods: {
    searchTandas() {
      if (
        this.genreField ||
        this.orchestraField ||
        this.speedField ||
        this.singerField
      ) {
      }
      console.log('search')
    },
    searchClear() {
      console.log('reinit')
    }
  }
}
</script>
