<template>
  <v-row class="mx-auto mb-4 mt-4">
    <v-col offset-md="3" md="6">
      <TandaItem v-if="tanda.tracks" :tanda="tanda" />
      <div class="spaceBottom"></div>
    </v-col>
  </v-row>
</template>

<script>
import { tandaService } from '@/services/tandas.service.js'
import TandaItem from '~/components/TandaItem'

export default {
  components: {
    TandaItem
  },
  head() {
    return {
      title: `Listen to great tandas on Tandafuria`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Create and discover great tandas on tandafuria.'
        }
      ]
    }
  },
  data() {
    return {
      id: this.$route.query.id,
      tanda: {}
    }
  },
  async created() {
    this.tanda = await tandaService.getOneTanda(this.id)
  },
  mounted() {}
}
</script>

<style lang="scss" scoped></style>
