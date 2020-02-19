<template>
  <v-container fluid grid-list-md>
    <h1 v-if="countTotalResults === 0">All tandas</h1>
    <h1 v-if="countTotalResults > 0">
      {{ countTotalResults }} tanda<span v-if="countTotalResults > 1">s</span>
    </h1>

    <v-row v-if="!loading" justify="center">
      <v-expansion-panels v-model="searchEngine" class="pa-5">
        <v-expansion-panel>
          <v-expansion-panel-header>
            <div class="title">
              <v-icon>mdi-magnify</v-icon><span>Search in all tandas</span>
            </div>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <v-row>
              <v-col md-6>
                <v-select
                  v-model="genreField"
                  :items="genreList"
                  label="musical genre"
                  class="inputGenre"
                  item-text="name"
                  item-value="id"
                ></v-select>

                <v-select
                  v-model="orchestraField"
                  :items="orchestraList"
                  label="Orchestra"
                  item-text="title"
                  item-value="id"
                ></v-select> </v-col
              ><v-col md-6>
                <v-select
                  v-model="speedField"
                  :items="speedList"
                  label="Speed"
                ></v-select>

                <v-text-field
                  v-model="singerField"
                  label="Singer"
                  placeholder="example : Alberto Moran"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-btn
                @click="searchAction()"
                color="primary"
                rounded
                class="ma-2"
                ><v-icon>mdi-magnify</v-icon> Search</v-btn
              >

              <v-btn @click="searchClear()" rounded class="ma-2"
                ><v-icon>mdi-broom</v-icon> Clear</v-btn
              >
            </v-row>
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
      tandas: [],
      speedList: ['', ...speed],
      orchestraList: [{ id: null, title: '' }, ...orchestras],
      genreList: [{ id: null, name: '' }, ...genres],
      orchestraField: '',
      speedField: '',
      genreField: '',
      singerField: '',
      countTotalResults: 0,
      searchEngine: false,
      offset: 0,
      loading: false,
      endOfResults: false
    }
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (
        mutation.type === 'tandas/CLEAR_TANDA' ||
        mutation.type === 'tandas/ADD_TANDA'
      ) {
        this.tandas = this.$store.getters['tandas/getAllTandas']
      }
    })

    this.loadSearchStore()
  },
  mounted() {
    this.tandas = this.$store.getters['tandas/getAllTandas']
    if (this.tandas.length <= 0) this.initTandas()
  },
  methods: {
    searchAction() {
      if (
        this.genreField ||
        this.orchestraField ||
        this.speedField ||
        this.singerField
      ) {
        this.tandas = []
        this.initTandas()
      }
    },
    searchClear() {
      this.genreField = ''
      this.orchestraField = ''
      this.speedField = ''
      this.singerField = ''
      this.offset = 0

      this.tandas = []

      this.initTandas()
    },
    async showMore() {
      this.offset += process.env.numberOfItemsToDisplay

      const resTandas = await this.searchTandas()

      resTandas.tandas.forEach((tanda) => {
        this.$store.dispatch('tandas/addTanda', {
          target: 'allTandas',
          tanda,
          order: 'end'
        })
      })
      this.countTotalResults = resTandas.countTotalResults
      this.endOfResults = this.isEndOfResult(resTandas.countTotalResults)
    },
    async initTandas() {
      this.$store.dispatch('tandas/clearTandas', 'allTandas')

      const resTandas = await this.searchTandas()

      resTandas.tandas.forEach((tanda) => {
        this.$store.dispatch('tandas/addTanda', { target: 'allTandas', tanda })
      })
      this.countTotalResults = resTandas.countTotalResults
      this.endOfResults = this.isEndOfResult(resTandas.countTotalResults)

      this.saveSearchToStore()
    },
    async searchTandas() {
      this.loading = true
      const params = this.buildParams()

      const reqTandas = await tandaService.getTandas(this.offset, params)

      this.loading = false

      return reqTandas
    },

    isEndOfResult(totalResults) {
      return this.offset + process.env.numberOfItemsToDisplay >= totalResults
    },
    buildParams() {
      const paramsArray = []
      let paramsString = ''

      if (this.genreField) paramsArray.push('genre=' + this.genreField)
      if (this.speedField) paramsArray.push('speed=' + this.speedField)
      if (this.singerField) paramsArray.push('singer=' + this.singerField)
      if (this.orchestraField)
        paramsArray.push('orchestra=' + this.orchestraField)

      if (paramsArray) paramsString = paramsArray.join('&')

      if (paramsString) paramsString = '?' + paramsString

      return paramsString
    },
    loadSearchStore() {
      const search = this.$store.getters['searchAll/getSearch']

      if (
        search.genreField ||
        search.orchestraField ||
        search.speedField ||
        search.singerField
      ) {
        this.genreField = search.genreField
        this.orchestraField = search.orchestraField
        this.speedField = search.speedField
        this.singerField = search.singerField
        this.searchEngine = 0
        this.countTotalResults = search.countTotalResults
        this.endOfResults = this.isEndOfResult(search.countTotalResults)
      }
    },
    saveSearchToStore() {
      const search = {
        genreField: this.genreField,
        orchestraField: this.orchestraField,
        speedField: this.speedField,
        singerField: this.singerField,
        countTotalResults: this.countTotalResults
      }
      this.$store.dispatch('searchAll/setSearchState', search)
    }
  }
}
</script>
