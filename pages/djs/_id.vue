<template>
  <div class=" ma-4">
    <h2 class="display-2">
      Dj {{ user.nickname }}
      <v-btn :href="user.link" target="_blank"
        ><v-icon>mdi-link</v-icon> contact
      </v-btn>
    </h2>

    <p v-if="user.countTanda">Number of tandas : {{ user.countTanda }}</p>

    <TandasList context="allTandas" :userId="userId" />
  </div>
</template>

<script>
import { userService } from '@/services/users.service'
import TandasList from '@/components/TandasList'

export default {
  components: { TandasList },
  data() {
    return {
      user: {},
      userId: this.$route.params.id
    }
  },
  async mounted() {
    this.user = await this.getUser()
  },
  methods: {
    async getUser() {
      const user = await userService.getUserInfos(this.userId)
      return user.data
    }
  }
}
</script>

<style lang="scss" scoped></style>
