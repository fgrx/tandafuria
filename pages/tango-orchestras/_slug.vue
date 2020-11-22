<template>
  <v-container fluid grid-list-md>
    <v-row class="mb-8">
      <v-col cols="12" sm="3" class="d-flex justify-center">
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
        <p class="font-weight-bold mb-5">
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
        <h1>
          <span v-if="genre">{{ capitalizedGenre }} tandas by </span
          >{{ orchestra.title }}
        </h1>
        <div>
          <h2>Filter tandas by genre :</h2>
          <v-btn
            :to="`/tango-orchestras/${slug}`"
            color="primary"
            :disabled="!genre"
            >All</v-btn
          >
          <v-btn
            :to="`/tango-orchestras/${slug}/tango`"
            color="secondary"
            :disabled="genre === 'tango'"
            >Tango</v-btn
          >
          <v-btn
            :to="`/tango-orchestras/${slug}/vals`"
            color="secondary"
            :disabled="genre === 'vals'"
            >Vals</v-btn
          >
          <v-btn
            :to="`/tango-orchestras/${slug}/milonga`"
            color="secondary"
            :disabled="genre === 'milonga'"
            >Milonga</v-btn
          >
        </div>
      </v-col>
    </v-row>
    <TandasList
      :defaultTandas="defaultTandas"
      context="orchestra"
      :memoriseRequest="false"
      :slug="slug"
      :genre="genre"
      :search="false"
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
    capitalizedGenre() {
      return this.genre.charAt(0).toUpperCase() + this.genre.slice(1)
    },
    slug() {
      return this.$route.params.slug
    },
    genre() {
      return this.$route.params.genre
    },
  },
  async asyncData({ params, route }) {
    let titleSpecified = ""
    let paramsString = ""
    const paramsArray = []

    const offset = 0

    const slug = route.params.slug
    const genre = route.params.genre

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

    if (genre) {
      titleSpecified = genre
      paramsArray.push("genre=" + genre)
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

<style lang="scss" scoped>
.portrait::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;

  background: linear-gradient(
    0.25turn,
    rgba(53, 30, 156, 0.7) 0%,
    rgba(206, 39, 161, 0.5) 100%
  );
}
</style>
