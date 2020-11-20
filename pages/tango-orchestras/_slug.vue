<template>
  <v-container fluid grid-list-md>
    <p class="font-weight-bold">
      <v-btn
        fab
        color="primary"
        :to="{ name: 'tango-orchestras' }"
        small
        class="mr-2"
        depressed
        ><v-icon>mdi-arrow-left</v-icon> </v-btn
      >back to all tango orchestras
    </p>
    <v-row class="mb-8">
      <v-col cols="12" sm="3">
        <v-img
          v-if="orchestra.image"
          aspect-ratio="1"
          :src="require('@/static/' + orchestra.image)"
          class="portrait"
          max-height="200"
          max-width="200"
        />
      </v-col>
      <v-col cols="12" sm="9">
        <h1>{{ orchestra.title }}</h1>
      </v-col>
    </v-row>
    <TandasList
      :defaultTandas="defaultTandas"
      context="allTandas"
      :memoriseRequest="false"
    />
  </v-container>
</template>

<script>
import { orchestras } from "@/data/orchestras.js"
import TandasList from "@/components/TandasList"

import { tandaService } from "@/services/tandas.service"

export default {
  components: { TandasList },
  data() {
    return {
      slug: this.$route.params.slug,
      orchestras,
      defaultTandas: [],
      titleSpecified: "",
    }
  },
  head() {
    return {
      title: `Listen to all ${this.titleSpecified}'s tandas`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: `Listen to all ${this.titleSpecified}'s tandas created by our tango djs users.`,
        },
        {
          hid: "og:title",
          name: "og:title",
          content: `Listen to all ${this.titleSpecified}'s tandas`,
        },
        {
          hid: "og:description",
          name: "og:description",
          content: `Listen to all ${this.titleSpecified}'s tandas created by our tango djs users.`,
        },
        {
          hid: "og:image",
          name: "og:image",
          content: require("@/static/tandafurybanner.jpg"),
        },
        {
          hid: "og:image:width",
          name: "og:image:width",
          content: "1280",
        },
        {
          hid: "og:image:height",
          name: "og:image:height",
          content: "486",
        },
      ],
    }
  },

  computed: {
    orchestra() {
      const findOrchestra = this.orchestras.filter(
        (orchestra) => orchestra.slug === this.slug
      )
      const orchestra = findOrchestra[0]

      if (!orchestra.image) orchestra.image = "person.png"

      return orchestra
    },
  },
  async asyncData({ params, route }) {
    let titleSpecified = ""
    let paramsString = ""
    const paramsArray = []

    const offset = 0

    const slug = route.params.slug
    const findOrchestra = orchestras.filter(
      (orchestra) => orchestra.slug === slug
    )
    const orchestra = findOrchestra[0]

    if (slug) {
      paramsArray.push("orchestra=" + orchestra.id)

      if (orchestra.id !== "mixed" && orchestra.id !== "other") {
        titleSpecified = orchestra.title
      }
    }

    if (route.query.genre) {
      titleSpecified = route.query.genre
      paramsArray.push("genre=" + route.query.genre)
    }

    if (paramsArray) paramsString = paramsArray.join("&")
    if (paramsString) paramsString = "?" + paramsString

    const result = await tandaService.getTandas(offset, paramsString)

    return {
      titleSpecified,
      defaultTandas: result.tandas,
    }
  },
}
</script>

<style lang="scss" scoped>
</style>
