<template>
  <v-card
    :to="{
      name: 'tango-orchestras-slug',
      params: { slug: orchestra.slug },
    }"
    shaped
    raised
    class="mx-auto"
    max-width="400"
  >
    <div class="centerVertically">
      <h3 class="maestroName title">{{ orchestra.title }}</h3>
    </div>

    <v-img
      v-if="orchestra.image"
      :src="orchestra.image"
      :class="'white--text align-end ' + classDecoration"
      height="200px"
    />
    <v-img
      v-if="!orchestra.image"
      :src="require('@/static/person.png')"
      :class="'white--text align-end ' + classDecoration"
      height="200px"
    />
  </v-card>
</template>

<script>
import { orchestras } from "@/data/orchestras.js"

export default {
  props: {
    id: {
      type: String,
      default: "",
    },
    maestro: {
      type: Object,
      default: null,
    },
    classDecoration: {
      type: String,
      default: "itemMaestro1",
    },
  },
  computed: {
    orchestra() {
      if (this.maestro) return this.maestro

      const findOrchestra = orchestras.filter((o) => o.id === this.id)
      return findOrchestra[0]
    },
  },
}
</script>

<style lang="scss" scoped>
.itemMaestro2::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  // height: 100%;
  background: -webkit-linear-gradient(
    top,
    rgba(18, 204, 148, 0.81) 0%,
    rgba(49, 27, 146, 0.81) 100%
  );
}

.itemMaestro1::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: -webkit-linear-gradient(
    top,
    rgba(49, 27, 146, 0.81) 0%,
    rgba(18, 204, 148, 0.81) 100%
  );
}

.centerVertically {
  z-index: 1;
  position: absolute;
  align-items: center;
  width: 100%;
  padding: 30px;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.maestroName {
  color: white;
  font-family: "Overpass" !important;
}
</style>
