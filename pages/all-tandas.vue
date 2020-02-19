<template>
  <v-container fluid grid-list-md>
    <h1>All tandas</h1>

    <v-row v-if="!loading" justify="center">
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

            <v-btn @click="searchAction()" color="primary"
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

    <loader v-if="loading" />

    <v-row v-if="!loading && !endOfResults" justify="center">
      <v-btn @click="showMore()" color="primary">+ More tandas</v-btn>
    </v-row>

    <NoTandaMessage
      v-if="tandas.length === 0 && !loading"
      title="No tanda for now"
    />
  </v-container>
</template>

<script>
import TandaItem from '@/components/TandaItem'
import NoTandaMessage from '@/components/NoTandaMessage'

import { genres } from '@/data/genres'
import { speed } from '@/data/speed'
import { orchestras } from '@/data/orchestras'

import { tandaService } from '@/services/tandas.service'
import loader from '@/components/loader'

export default {
  middleware: ['spotifyConnexion'],
  components: { TandaItem, NoTandaMessage, loader },
  data() {
    return {
      tandas: this.$store.getters['tandas/getAllTandas'],
      speedList: speed,
      orchestraList: orchestras,
      genreList: genres,
      orchestraField: '',
      speedField: '',
      genreField: '',
      singerField: '',
      offset: 0,
      loading: false,
      endOfResults: false
    }
  },
  mounted() {
    this.searchTandas()
  },
  methods: {
    searchAction() {
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
    },
    showMore() {
      this.offset += process.env.numberOfItemsToDisplay
      this.searchTandas()
    },
    async searchTandas() {
      this.loading = true
      const allTandas = await tandaService.getTandas(this.offset)

      allTandas.tandas.forEach((tanda) => {
        this.$store.dispatch('tandas/addTanda', { target: 'allTandas', tanda })
      })

      this.endOfResults = this.isEndOfResult(allTandas.countTotalResults)

      this.loading = false
    },
    isEndOfResult(totalResults) {
      return this.offset + process.env.numberOfItemsToDisplay >= totalResults
    }
  }
}
</script>
