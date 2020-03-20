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
            <v-list-item-icon v-if="userId !== playlistItem.author.id"
              ><v-btn
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
  head() {
    return {
      title: `Informations about ${this.user.nickname}`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `Listen to ${this.user.nickname}'s tandas and playlists`
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: `Informations about ${this.user.nickname}`
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: `Listen to ${this.user.nickname}'s tandas and playlists`
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: require('@/static/tandafurybanner.jpg')
        },
        {
          hid: 'og:image:width',
          name: 'og:image:width',
          content: `1280`
        },
        {
          hid: 'og:image:height',
          name: 'og:image:height',
          content: `486`
        }
      ]
    }
  },
  async asyncData({ params }) {
    const user = await userService.getUserInfos(params.id)
    const reqPlaylists = await playlistService.getPublicPlaylists(params.id)
    const result = reqPlaylists.data
    const playlists = result.playlists
    const countPlaylists = result.countTotalResults
    return { user: user.data, playlists, countPlaylists }
  }
}
</script>

<style lang="scss" scoped></style>
