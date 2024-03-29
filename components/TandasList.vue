<template>
  <div>
    <h2 v-if="!loading && countTotalResults !== 0">
      {{ countTotalResults }} tanda<span v-if="countTotalResults > 1">s</span>
      found
    </h2>

    <v-row v-if="!loading && search" justify="center">
      <v-expansion-panels v-model="searchEngine" class="pa-5">
        <v-expansion-panel>
          <v-expansion-panel-header>
            <div class="title">
              <v-icon>mdi-magnify</v-icon><span>Search</span>
            </div>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <v-row>
              <v-col cols="12" sm="12" md="6">
                <v-select
                  v-model="genreField"
                  :items="genreList"
                  @keydown.enter="searchAction()"
                  label="musical genre"
                  class="inputGenre"
                  item-text="name"
                  item-value="id"
                ></v-select>

                <v-select
                  v-model="orchestraField"
                  :items="orchestraList"
                  @keydown.enter="searchAction()"
                  label="Orchestra"
                  item-text="title"
                  item-value="id"
                ></v-select> </v-col
              ><v-col cols="12" sm="12" md="6">
                <v-select
                  v-model="speedField"
                  :items="speedList"
                  @keydown.enter="searchAction()"
                  label="Speed"
                ></v-select>

                <v-text-field
                  v-model="singerField"
                  @keydown.enter="searchAction()"
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

              <v-btn @click="searchClearAction()" rounded class="ma-2"
                ><v-icon>mdi-broom</v-icon> Clear</v-btn
              >
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>

    <v-layout v-if="countTotalResults" ref="results" row wrap>
      <v-flex v-for="tanda in tandas" :key="tanda._id" xl3 lg4 md6 xs12>
        <TandaItem :tanda="tanda" />
      </v-flex>
    </v-layout>

    <PlaylistSelector />

    <Loader v-if="loading" />

    <v-row v-if="!loading && !endOfResults" justify="center">
      <v-btn @click="showMore()" color="primary">+ More tandas</v-btn>
    </v-row>

    <v-row>
      <v-col
        ><NoTandaMessage v-if="countTotalResults === 0 && !loading"
      /></v-col>
    </v-row>
  </div>
</template>

<script>
import TandaItem from "@/components/TandaItem"
import NoTandaMessage from "@/components/NoTandaMessage"

import { genres } from "@/data/genres"
import { speed } from "@/data/speed"
import { orchestras } from "@/data/orchestras"

import { tandaService } from "@/services/tandas.service"

import PlaylistSelector from "@/components/PlaylistSelector"
import LoaderCircular from "@/components/LoaderCircular"

export default {
  components: {
    TandaItem,
    NoTandaMessage,
    Loader: LoaderCircular,
    PlaylistSelector,
  },
  props: {
    defaultTandas: {
      type: Object,
      default: null,
    },
    context: { type: String, default: "allTandas" },
    userIdParam: { type: String, default: "" },
    memoriseRequest: {
      type: Boolean,
      default: true,
    },
    genre: { type: String, default: "" },
    slug: { type: String, default: "" },
    search: { type: Boolean, default: true },
  },
  data() {
    return {
      tandas: [],
      speedList: ["", ...speed],
      orchestraList: [{ id: null, title: "" }, ...orchestras],
      genreList: [{ id: null, name: "" }, ...genres],
      orchestraField: "",
      speedField: "",
      genreField: "",
      singerField: "",
      countTotalResults: 0,
      searchEngine: false,
      offset: 0,
      loading: false,
      endOfResults: false,
    }
  },
  computed: {
    orchestra() {
      const findOrchestra = orchestras.filter(
        (orchestra) => orchestra.slug === this.slug
      )
      return findOrchestra[0]
    },
  },
  watch: {
    genre: function (newVal, oldVal) {
      this.getParamsInUrlAndSearch()
      this.initTandas()
    },
  },

  created() {
    this.$store.subscribe((mutation, state) => {
      if (
        mutation.type === "tandas/CLEAR_TANDA" ||
        mutation.type === "tandas/ADD_TANDA"
      ) {
        const storeToWatch = this.selectStoreForTanda()
        this.tandas = this.$store.getters[`tandas/${storeToWatch}`]
      }
    })

    this.loadSearchStore()

    this.getParamsInUrlAndSearch()

    if (this.defaultTandas && this.tandas.length === 0) {
      this.tandas = this.defaultTandas.tandas
      this.countTotalResults = this.defaultTandas.countTotalResults
      if (this.context === "allTandas" || this.context === "myTandas") {
        this.addResultsToStore(this.tandas)
      }
    } else {
      if (!this.memoriseRequest) this.searchClearAction()
      const storeToWatch = this.selectStoreForTanda()
      this.tandas = this.$store.getters[`tandas/${storeToWatch}`]
      this.initTandas()
    }
  },
  methods: {
    searchAction() {
      this.tandas = []
      this.initTandas()
    },
    searchClearAction() {
      this.searchClear()
      this.initTandas()
    },
    searchClear() {
      this.genreField = ""
      this.orchestraField = ""
      this.speedField = ""
      this.singerField = ""
      this.offset = 0
      this.countTotalResults = 0

      this.tandas = []
    },
    async showMore() {
      // get position
      this.loading = true
      const pos = window.scrollY

      this.offset += process.env.numberOfItemsToDisplay

      const resTandas = await this.searchTandas()

      if (this.context === "allTandas" || this.context === "myTandas") {
        this.addResultsToStore(resTandas.tandas)
      }

      if (this.context === "orchestra") {
        resTandas.tandas.forEach((tanda) => this.tandas.push(tanda))
      }

      this.loading = false
      window.scroll(0, pos)

      this.countTotalResults = resTandas.countTotalResults
      this.endOfResults = this.isEndOfResult(resTandas.countTotalResults)
    },
    async initTandas() {
      this.loading = true
      const resTandas = await this.searchTandas()

      this.loading = false

      if (this.context === "allTandas" || this.context === "myTandas") {
        this.addResultsToStore(resTandas.tandas)
      }
      this.tandas = resTandas.tandas

      this.countTotalResults = resTandas.countTotalResults
      this.endOfResults = this.isEndOfResult(resTandas.countTotalResults)

      if (this.context === "allTandas" || this.context === "myTandas") {
        this.saveSearchToStore()
      }
    },
    addResultsToStore(tandas) {
      //this.$store.dispatch("tandas/clearTandas", this.context)
      tandas.forEach((tanda) => {
        this.$store.dispatch("tandas/addTanda", {
          target: this.context,
          tanda,
          order: "end",
        })
      })
    },

    async searchTandas() {
      const params = this.buildParams()

      let result = []

      if (this.context === "allTandas" || this.context === "orchestra") {
        result = await tandaService.getTandas(this.offset, params)
      } else {
        const user = this.$store.getters["authApp/getUser"]
        let userIdSearch = user.id

        if (this.context === "publicUserTandas") {
          userIdSearch = this.userIdParam
        }

        result = await tandaService.getTandasUser(
          userIdSearch,
          this.offset,
          params
        )
      }

      return result
    },
    isEndOfResult(totalResults) {
      return this.offset + process.env.numberOfItemsToDisplay >= totalResults
    },
    buildParams() {
      const paramsArray = []
      let paramsString = ""
      if (this.context === "publicUserTandas") paramsArray.push("isPublic=true")
      if (this.userId) paramsArray.push("author=" + this.userId)
      if (this.genreField) paramsArray.push("genre=" + this.genreField)
      if (this.speedField) paramsArray.push("speed=" + this.speedField)
      if (this.singerField) paramsArray.push("singer=" + this.singerField)
      if (this.orchestraField)
        paramsArray.push("orchestra=" + this.orchestraField)

      if (this.slug) paramsArray.push("orchestra=" + this.slug)
      if (this.genre) paramsArray.push("genre=" + this.genre)

      if (paramsArray) paramsString = paramsArray.join("&")

      if (paramsString) paramsString = "?" + paramsString

      return paramsString
    },
    loadSearchStore() {
      const storeForSearch = this.selectStoreForSearch()
      const search = this.$store.getters[`${storeForSearch}/getSearch`]

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
        countTotalResults: this.countTotalResults,
      }
      if (this.context === "allTandas" || this.context === "myTandas") {
        const storeForSearch = this.selectStoreForSearch()
        this.$store.dispatch(`${storeForSearch}/setSearchState`, search)
      }
    },
    selectStoreForSearch() {
      return this.context === "allTandas" ? "searchAllTandas" : "searchMyTandas"
    },
    selectStoreForTanda() {
      return this.context === "allTandas" ? "getAllTandas" : "getMyTandas"
    },
    getParamsInUrlAndSearch() {
      if (
        this.$route.query.orchestra ||
        this.$route.query.genre ||
        this.$route.query.speed ||
        this.$route.query.singer
      ) {
        this.searchEngine = 0
        this.tandas = []
        this.$store.dispatch("tandas/clearTandas", this.context)
      }

      if (this.$route.query.orchestra) {
        this.orchestraField = this.$route.query.orchestra
      }

      if (this.slug) {
        this.orchestraField = this.orchestra.id
      }

      if (this.$route.query.genre) {
        this.genreField = this.$route.query.genre
      }

      this.genreField = this.genre

      if (this.$route.query.speed) {
        this.speedField = this.$route.query.speed
      }

      if (this.$route.query.singer) {
        this.singerField = this.$route.query.singer
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
