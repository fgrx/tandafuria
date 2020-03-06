<template>
  <div class=" ma-4">
    <h2 class="display-2">
      Dj {{ user.nickname }}
      <p>
        <v-btn v-if="user.link" :href="user.link" target="_blank" outlined
          ><v-icon>mdi-link</v-icon> visite page
        </v-btn>
      </p>
    </h2>

    <h2 class="mt-12">{{ user.nickname }}'s public Playlists</h2>
    <v-card class="mx-auto mb-4 mt-4">
      <v-card-title v-if="!loading">
        <h3>{{ countPlaylists }} playlists found</h3>
      </v-card-title>

      <v-card-text>
        <div v-for="(playlistItem, index) in playlists" :key="playlistItem._id">
          <v-list-item>
            <v-list-item-icon
              ><v-btn
                v-if="userId !== playlistItem.author.id"
                @click="setAsFavAction(playlistItem)"
                color="primary"
                small
                dark
                ><v-icon>mdi-star</v-icon> Set as Favorite</v-btn
              >
            </v-list-item-icon>
            <v-list-item-content
              :to="{
                name: 'playlists-id',
                params: { id: playlistItem._id }
              }"
            >
              <v-list-item-title
                :to="{
                  name: 'playlists-id',
                  params: { id: playlistItem._id }
                }"
                two-line
                class="headline mb-1"
              >
                <v-btn
                  :to="{
                    name: 'playlists-id',
                    params: { id: playlistItem._id }
                  }"
                  text
                  >{{ playlistItem.name }}</v-btn
                >
              </v-list-item-title>
              <v-list-item-subtitle v-if="playlistItem.countTracks">
                <span class="font-regular"
                  >by
                  <nuxt-link
                    :to="{
                      name: 'djs-id',
                      params: { id: playlistItem.author.id }
                    }"
                  >
                    {{ playlistItem.author.name }}
                  </nuxt-link>
                </span>
              </v-list-item-subtitle>

              <v-list-item-subtitle v-if="playlistItem.countTracks">
                {{ playlistItem.countTracks }} tracks
                <span v-if="playlistItem.isPublic"> - public playlist</span>
                <span v-if="!playlistItem.isPublic"> - private playlist</span>
                {{ playlistItem.description }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider
            v-if="index + 1 < playlists.length"
            :key="index"
          ></v-divider>
        </div>

        <LoaderCircular v-if="loading" />
      </v-card-text>
    </v-card>

    <h2 class="mt-12">{{ user.nickname }}'s public tandas</h2>
    <TandasList :userIdParam="userId" context="publicUserTandas" />
  </div>
</template>

<script>
import { userService } from '@/services/users.service'
import { playlistService } from '@/services/playlistService'

import TandasList from '@/components/TandasList'

export default {
  components: { TandasList },
  data() {
    return {
      user: {},
      userId: this.$route.params.id,
      loading: false,
      playlists: [],
      countPlaylists: 0
    }
  },
  async mounted() {
    this.user = await this.getUser()
    this.loadPlaylists()
  },
  methods: {
    async getUser() {
      const user = await userService.getUserInfos(this.userId)
      return user.data
    },
    async loadPlaylists() {
      const reqPlaylists = await playlistService.getPlublicPlaylists(
        this.userId
      )

      const result = reqPlaylists.data

      this.playlists = result.playlists
      this.countPlaylists = result.countTotalResults
    }
  }
}
</script>

<style lang="scss" scoped></style>
