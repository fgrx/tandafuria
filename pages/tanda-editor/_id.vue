<template>
  <v-container justify-center align-center>
    <LoaderCircular v-if="!loaded" />
    <v-card class="mx-auto mt-4 mb-4" max-width="850">
      <v-card-title>
        <h1>Tanda editor</h1>
      </v-card-title>

      <v-card-text v-if="loaded"
        ><TandaForm :tandaToModify="tanda"
      /></v-card-text>
    </v-card>
    <div class="spaceBottom"></div>
  </v-container>
</template>

<script>
import TandaForm from "@/components/TandaForm"
import { tandaService } from "@/services/tandas.service.js"
import LoaderCircular from "@/components/LoaderCircular"

export default {
  middleware: ["appAuthorization", "spotifyConnexion"],

  components: {
    TandaForm,
    LoaderCircular
  },
  data() {
    return {
      tanda: {},
      loaded: false
    }
  },

  head() {
    return {
      title: "Create a new tanda",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Create a new tanda using this form"
        },
        {
          hid: "og:title",
          name: "og:title",
          content: "Create a new tanda"
        },
        {
          hid: "og:description",
          name: "og:description",
          content: "Create a new tanda using this form"
        },
        {
          hid: "og:image",
          name: "og:image",
          content: require("@/static/tandafurybanner.jpg")
        },
        {
          hid: "og:image:width",
          name: "og:image:width",
          content: "1280"
        },
        {
          hid: "og:image:height",
          name: "og:image:height",
          content: "486"
        }
      ]
    }
  },
  async mounted() {
    const tandaQueryResult = await tandaService.getOneTanda(
      this.$route.params.id
    )
    this.tanda = tandaQueryResult

    this.loaded = true
  }
}
</script>

<style lang="scss" scoped></style>
