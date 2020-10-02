<template>
  <v-layout>
    <v-flex>
      <v-container fluid grid-list-md>
        <h1>Browse playlists</h1>
        <v-card
          v-if="playlistsFav.length > 0"
          class="mx-auto mb-10 mt-4"
          max-width="850"
        >
          <v-card-title>
            <h2>My favorites playlists</h2>
          </v-card-title>
          <v-card-title v-if="!loading">
            <h3>{{ countPlaylists }} playlists found</h3>
          </v-card-title>

          <v-card-text>
            <div
              v-for="(playlistItem, index) in playlistsFav"
              :key="playlistItem._id"
            >
              <v-list-item>
                <v-list-item-icon
                  ><v-btn
                    v-if="
                      currentUser.id &&
                        currentUser.id !== playlistItem.author.id
                    "
                    @click="removeFromFavs(playlistItem)"
                    color="primary"
                    small
                    light
                    ><v-icon>mdi-star-off</v-icon> Remove from Favs</v-btn
                  >
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title two-line class="headline mb-1">
                    <v-btn
                      :to="{
                        name: 'playlist',
                        params: { id: playlistItem._id }
                      }"
                      >{{ playlistItem.name }} !!!</v-btn
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
                    <span v-if="!playlistItem.isPublic">
                      - private playlist</span
                    >
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
        <v-card class="mx-auto mb-4 mt-4" max-width="850">
          <v-card-title>
            <h2>All Playlists</h2>
          </v-card-title>
          <v-card-title v-if="!loading">
            <h3>{{ countPlaylists }} playlists found</h3>
          </v-card-title>

          <v-card-text>
            <v-list>
              <div
                v-for="(playlistItem, index) in playlists"
                :key="playlistItem._id"
                :class="
                  currentUser.id === playlistItem.author.id
                    ? 'usersPlaylist'
                    : ''
                "
              >
                <v-list-item color="primary">
                  <v-list-item-action
                    v-if="
                      !currentUser.id ||
                        currentUser.id === playlistItem.author.id
                    "
                  >
                    <v-icon>mdi-playlist-music</v-icon>
                  </v-list-item-action>
                  <v-list-item-action v-else>
                    <v-list-item-icon
                      v-if="
                        currentUser.id &&
                          currentUser.id !== playlistItem.author.id
                      "
                      ><v-btn
                        @click="setAsFavAction(playlistItem)"
                        color="primary"
                        small
                        dark
                        ><v-icon>mdi-star</v-icon>
                      </v-btn>
                    </v-list-item-icon>
                  </v-list-item-action>

                  <v-list-item-content>
                    <v-list-item-title two-line class="headline mb-1">
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
                      <span v-if="playlistItem.isPublic">
                        - public playlist</span
                      >
                      <span v-if="!playlistItem.isPublic">
                        - private playlist</span
                      >
                      {{ playlistItem.description }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-divider
                  v-if="index + 1 < playlists.length"
                  :key="index"
                ></v-divider>
              </div>
            </v-list>
            <v-row v-if="!loading && !endOfResults" justify="center">
              <v-btn @click="showMore()" color="primary"
                >+ More playlists</v-btn
              >
            </v-row>
            <LoaderCircular v-if="loading" />
          </v-card-text>
        </v-card>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import { playlistService } from "@/services/playlist.service"
import { userService } from "@/services/users.service"
import LoaderCircular from "@/components/LoaderCircular"

export default {
  middleware: ["spotifyConnexion"],
  components: {
    LoaderCircular
  },
  data() {
    return {
      playlists: [],
      playlistsFav: [],
      offset: 0,
      itemsToDisplay: 12,
      countPlaylists: 0,
      loading: false,
      favoritesInStore: [],
      endOfResults: true,
      currentUser: {}
    }
  },
  head() {
    return {
      title: "Browse all playlists",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Browse all playlists from our contributors."
        },
        {
          hid: "og:title",
          name: "og:title",
          content: "Browse all playlists from our contributors."
        },
        {
          hid: "og:description",
          name: "og:description",
          content: "Browse all public tandas that users shared with us. "
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
  mounted() {
    this.currentUser = this.$store.getters["authApp/getUser"]
    this.favoritesInStore = this.$store.state.favoritesPlaylists
    this.loadPlaylists()
    if (this.currentUser.username) {
      this.getFavorites()
    }
  },
  methods: {
    async loadPlaylists() {
      this.loading = true
      const reqPlaylists = await playlistService.getAllPlaylists(this.offset)

      const result = reqPlaylists

      result.playlists.forEach((itemPlaylist) =>
        this.playlists.push(itemPlaylist)
      )

      this.countPlaylists = result.countTotalResults
      this.loading = false
      this.endOfResults = this.isEndOfList()
    },
    setAsFavAction(playlist) {
      const exist = this.playlistsFav.find((e) => e._id === playlist._id)

      if (!exist) {
        this.playlistsFav.push(playlist)
        this.$store.dispatch(
          "favoritesPlaylists/updateActionFavoritesPlaylists",
          this.playlistsFav
        )

        userService.updateUser(
          { ...this.currentUser, favorites: this.playlistsFav },
          this.currentUser.token
        )

        this.$bus.$emit("flashMessage", {
          message: "This playlist has been added to your favorites",
          status: "success"
        })
      } else {
        this.$bus.$emit("flashMessage", {
          message: "This playlist is already in your favorites",
          status: "success"
        })
      }
    },
    removeFromFavs(fav) {
      const indexToDelete = this.playlistsFav.findIndex(
        (favElement) => favElement.id === fav._id
      )

      this.playlistsFav.splice(indexToDelete, 1)

      this.$store.dispatch(
        "favoritesPlaylists/updateActionFavoritesPlaylists",
        this.playlistsFav
      )
      userService.updateUser(
        { ...this.currentUser, favorites: this.playlistsFav },
        this.currentUser.token
      )
    },
    isEndOfList() {
      return this.offset + this.itemsToDisplay >= this.countPlaylists
    },
    showMore() {
      this.offset = this.offset + this.itemsToDisplay
      this.loadPlaylists()
    },
    async getFavorites() {
      const reqPlaylists = await playlistService.getFavsPlaylists(
        this.currentUser.id
      )

      this.playlistsFav = reqPlaylists
    }
  }
}
</script>

<style lang="scss" scoped>
a {
  color: rgb(115, 40, 158);
}

.usersPlaylist {
  background: rgba(245, 227, 253, 0.993);
}
</style>
