<template>
  <div class=" ma-4">
    <h2 class="display-2">
      Dj {{ user.nickname }}
      <p>
        <v-btn v-if="user.link" :href="user.link" target="_blank" text
          ><v-icon>mdi-link</v-icon> {{ user.link }}
        </v-btn>
      </p>
    </h2>

    <TandasList :userIdParam="userId" context="publicUserTandas" />
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
