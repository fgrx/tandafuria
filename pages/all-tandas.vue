<template>
  <v-container fluid grid-list-md>
    <h1>All {{ titleSpecified }} tandas</h1>
    <TandasList :defaultTandas="defaultTandas" context="allTandas" />
  </v-container>
</template>

<script>
import TandasList from "@/components/TandasList"
import { orchestras } from "@/data/orchestras"
import { tandaService } from "@/services/tandas.service"

export default {
  middleware: ["spotifyConnexion"],
  components: { TandasList },
  data() {
    return {
      defaultTandas: [],
    }
  },
  head() {
    return {
      title: `Browse all ${this.titleSpecified} tandas`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: `Browse all public ${this.titleSpecified} tandas that users shares with us. You can also create your own tandas and share it (or not) with others Tango Djs.`,
        },
        {
          hid: "og:title",
          name: "og:title",
          content: `Browse all ${this.titleSpecified} tandas`,
        },
        {
          hid: "og:description",
          name: "og:description",
          content: `Browse all public ${this.titleSpecified} tandas that users shares with us. You can also create your own tandas and share it (or not) with others Tango Djs.`,
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
  async asyncData({ params, route }) {
    let titleSpecified = ""
    let paramsString = ""
    const paramsArray = []

    const offset = 0

    if (route.query.orchestra) {
      paramsArray.push("orchestra=" + route.query.orchestra)

      const orchestra = orchestras.filter((e) => e.id === route.query.orchestra)
      if (orchestra[0].id !== "mixed" && orchestra[0].id !== "other") {
        titleSpecified = orchestra[0].title
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
      defaultTandas: result,
    }
  },
}
</script>
