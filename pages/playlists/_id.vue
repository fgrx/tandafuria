<template>
  <v-flex>
    <v-card v-if="playlist" class="mx-auto mb-4 mt-4" max-width="850">
      <v-card-title>
        <h1 class="display-1 text--primary">{{ playlist.name }}</h1>
      </v-card-title>

      <v-card-subtitle v-if="playlist.author">
        <span v-if="playlist.isPublic">Public</span>
        <span v-if="!playlist.isPublic">Private</span>
        playlist by
        {{ playlist.author.name }}
      </v-card-subtitle>

      <v-card-text v-if="playlist.description">
        {{ playlist.description }}
      </v-card-text>

      <v-card-text>
        <v-btn v-if="tracks" @click="play(tracks[0])" block>
          <v-icon>mdi-play</v-icon>Start playlist
        </v-btn>
      </v-card-text>

      <LoaderCircular v-if="loading" />

      <v-card-text v-if="!tracks && !loading">
        Your playlist doesn't have any track to play. Click on the button bellow
        to add your first one !
      </v-card-text>

      <draggable
        v-model="tracks"
        @change="updateCurrentPlayingPlaylist"
        @start="isDragging = true"
        @end="isDragging = false"
        v-bind="dragOptions"
        class="list-group"
        tag="ul"
        handle=".handle"
      >
        <transition-group type="transition" name="flip-list">
          <div v-for="(track, index) in tracks" :key="index">
            <v-list-item
              :class="[
                { playing: track.id === trackPlaying },
                { isCortina: track.isCortina === true },
              ]"
              draggable
              two-line
              class="ml-n6"
            >
              <TrackItem :track="track" :playlist="playlist" />

              <v-list-item-action>
                <v-btn
                  v-if="playlist.author.id === currentUser.id"
                  class="handle"
                >
                  <v-icon color="primary">mdi-drag-variant</v-icon>
                </v-btn>

                <v-menu v-if="currentUser.id" offset-y>
                  <template v-slot:activator="{ on }">
                    <v-list-item v-on="on">
                      <v-btn color="primary" icon>
                        <v-icon>mdi-dots-horizontal-circle-outline</v-icon>
                      </v-btn>
                    </v-list-item>
                  </template>
                  <v-list>
                    <v-list-item v-if="playlist.author.id === currentUser.id">
                      <v-list-item-title>
                        <v-btn @click="setAsCortina(track)" text small>
                          <v-icon>mdi-party-popper</v-icon>
                          <span v-if="!track.isCortina">Set as a cortina</span>
                          <span v-if="track.isCortina">Unset cortina</span>
                        </v-btn>
                      </v-list-item-title>
                    </v-list-item>

                    <v-list-item v-if="playlist.author.id === currentUser.id">
                      <v-list-item-title>
                        <v-btn @click="addToPlaylist(track)" text small>
                          <v-icon>mdi-playlist-music</v-icon>
                          <span v-if="!track.isCortina">Add to playlist</span>
                          <span v-if="track.isCortina">Unset cortina</span>
                        </v-btn>
                      </v-list-item-title>
                    </v-list-item>

                    <v-list-item v-if="playlist.author.id === currentUser.id">
                      <v-list-item-title>
                        <v-btn @click="deleteTrack(track.id)">
                          <v-icon color="danger">mdi-delete</v-icon>Delete track
                        </v-btn>
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-list-item-action>
            </v-list-item>
            <v-divider></v-divider>
          </div>
        </transition-group>
      </draggable>
      <v-row v-if="playlist.author && currentUser.id === playlist.author.id">
        <v-col class="text-center">
          <v-btn @click="openSpotifyBrowser()" color="secondary" class="mr-4">
            <v-icon>mdi-plus</v-icon>Add track
          </v-btn>
          <v-btn @click="createTanda" color="secondary">
            <v-icon>mdi-library-music</v-icon>Create tanda
          </v-btn>
        </v-col>
      </v-row>

      <v-card-actions class="justify-center">
        <v-btn
          v-if="playlist.author && currentUser.id === playlist.author.id"
          @click="savePlaylist()"
          color="primary"
        >
          <v-icon>mdi-content-save</v-icon>Save
        </v-btn>
        <v-btn
          v-if="
            currentUser.spotify &&
            playlist.author &&
            currentUser.id === playlist.author.id
          "
          @click="savePlaylistSpotify()"
          color="secondary"
        >
          <v-icon>mdi-spotify</v-icon>Sync Spotify
        </v-btn>

        <v-btn @click="sharePLaylist()" color="secondary">
          <v-icon>mdi-share</v-icon>Share
        </v-btn>

        <v-btn @click="back">back</v-btn>
      </v-card-actions>
    </v-card>

    <div id="end" class="spaceBottom"></div>

    <v-dialog ref="dialog" v-model="dialogBrowserSpotify" max-width="800px">
      <SpotifyBrowser @clicked="addTrack" />

      <v-btn ref="monBouton" @click="browserClose" color="primary">Close</v-btn>
    </v-dialog>

    <PlaylistSelector />
  </v-flex>
</template>

<script>
import playlistMixin from "@/mixins/playlist"
import { playlistService } from "@/services/playlist.service"
import LoaderCircular from "@/components/LoaderCircular"
import SpotifyBrowser from "@/components/SpotifyBrowser"
import draggable from "vuedraggable"
import PlaylistSelector from "../../components/PlaylistSelector.vue"
import TrackItem from "~/components/TrackItem"

export default {
  components: {
    LoaderCircular,
    SpotifyBrowser,
    draggable,
    TrackItem,
    PlaylistSelector,
  },
  mixins: [playlistMixin],
  middleware: ["spotifyConnexion"],
  head() {
    return {
      title: `Playlist "${this.playlist.name}"  by ${this.playlist.author.name} containing ${this.playlist.nbTracks} tracks`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: `Listen to "${this.playlist.name}". A playlist created by ${this.playlist.author.name} containing ${this.nbTracks} tango tracks`,
        },
        {
          hid: "og:title",
          name: "og:title",
          content: `Playlist "${this.playlist.name}" by ${this.playlist.author.name} containing ${this.nbTracks} tracks`,
        },
        {
          hid: "og:description",
          name: "og:description",
          content: `Listen to "${this.playlist.name}". A playlist created by ${this.playlist.author.name} containing ${this.playlist.nbTracks} tango tracks`,
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
  data() {
    return {
      playlist: this.playlist,
      loading: false,
      dialogBrowserSpotify: false,
      tracks: this.tracks,
      trackPlaying: "",
      currentUser: this.$store.getters["authApp/getUser"],
      modified: false,
      nbTracks: 0,
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      }
    },
  },
  async asyncData({ params }) {
    const playlist = await playlistService.findOne(params.id)
    let nbTracks = 0
    if (playlist.tracks) nbTracks = playlist.tracks.length
    playlist.nbTracks = nbTracks
    const testedTracks = playlistService.testNoDuplicateTracks(playlist)

    return {
      playlist,
      tracks: testedTracks,
      nbTracks,
    }
  },
  mounted() {
    this.$bus.$on("playingTrack", (idTrackPlaying) => {
      this.trackPlaying = idTrackPlaying.trackId
    })
  },
  beforeDestroy() {
    if (
      this.playlist.author &&
      this.currentUser.id === this.playlist.author.id &&
      this.modified
    ) {
      this.savePlaylist()
    }
  },
  methods: {
    play(trackNumber) {
      this.playPlaylistMixin(this.playlist, trackNumber)
    },
    openSpotifyBrowser() {
      this.dialogBrowserSpotify = true
      // this.initSpotifyBrowser()
    },
    browserClose() {
      this.dialogBrowserSpotify = false
    },
    addTrack(track) {
      this.tracks.push(track)
      this.browserClose()
      this.modified = true
    },
    back() {
      this.$router.back()
    },
    deleteTrack(trackId) {
      if (window.confirm("Do you really want to delete this track ?")) {
        const indexToDelete = this.tracks.findIndex(
          (track) => track.id === trackId
        )

        this.tracks.splice(indexToDelete, 1)
      }
    },
    setAsCortina(track) {
      this.tracks = this.tracks.map((trackItem) => {
        if (trackItem.id === track.id) {
          trackItem.isCortina
            ? (trackItem.isCortina = false)
            : (trackItem.isCortina = true)

          playlistService.setAsCortina(
            this.playlist._id,
            trackItem,
            this.currentUser.token
          )
        }
        return trackItem
      })
    },
    updateCurrentPlayingPlaylist() {
      if (this.playlist._id === this.$store.state.player.playlistPlaying._id) {
        this.$store.dispatch("player/setPlaylistPlaying", {
          ...this.playlist,
          tracks: this.tracks,
        })
      }
    },
    async savePlaylist() {
      this.playlist.tracks = this.tracks
      this.playlist.countTracks = this.tracks ? this.nbTracks : 0

      try {
        await playlistService.update(this.playlist, this.currentUser.token)

        this.$bus.$emit("flashMessage", {
          message: "Your playlist has been saved",
          status: "success",
        })
      } catch (e) {
        this.$bus.$emit("flashMessage", {
          message: "An error has occured",
          status: "error",
        })
      }
      this.modified = false
    },
    async savePlaylistSpotify() {
      let playlistSpotifyId = ""

      if (!this.playlist.spotifySync) {
        const resultCreationPlaylist = await playlistService.createPlaylistSpotify(
          this.playlist,
          this.currentUser
        )

        playlistSpotifyId = resultCreationPlaylist.id
        this.playlist.spotifySync = playlistSpotifyId
      } else {
        playlistSpotifyId = this.playlist.spotifySync
      }

      await playlistService.updatePlaylistSpotify(
        playlistSpotifyId,
        this.currentUser,
        this.tracks
      )

      this.savePlaylist()
    },
    createTanda() {
      const url = "../tanda-editor?playlist=" + this.playlist._id
      this.$router.push(url)
    },
    async sharePLaylist() {
      const baseUrl =
        process.env.NODE_ENV === "development"
          ? process.env.DEV_clientUrl
          : process.env.PROD_clientUrl

      try {
        await this.$copyText(`${baseUrl}/playlists/${this.playlist._id}`)
      } catch (e) {
        // console.error(e)
      }

      this.$bus.$emit("flashMessage", {
        message: "The link has been copied to your clipboard",
        status: "success",
      })
    },
    checkNoDuplicateTrack(playlist) {
      const tracks = playlist.tracks
      return tracks
    },
    addToPlaylist(track) {
      const tracks = [track]
      this.$bus.$emit("openDialogPlaylistPicker", tracks)
    },
  },
}
</script>

<style lang="scss" scoped>
.playing {
  background: #e3cdf7;
}

.isCortina {
  background: #79f8e1;
}

.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>
