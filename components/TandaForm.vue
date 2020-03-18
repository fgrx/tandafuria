<template>
  <div>
    <v-form ref="form" v-model="valid" class="tandaForm">
      <v-select
        v-model="genreField"
        :rules="[(v) => !!v || 'Musical genre is required']"
        :items="genreList"
        label="musical genre"
        class="inputGenre"
        item-text="name"
        item-value="id"
        required
      ></v-select>

      <v-select
        v-model="orchestraField"
        :items="orchestraList"
        :rules="[(v) => !!v || 'Orchestra is required']"
        @change="changeDefaultSearchValue()"
        label="Orchestra"
        item-text="title"
        item-value="id"
        required
      ></v-select>

      <v-switch
        v-model="isInstrumentalField"
        label="This is an instrumental tanda ?"
      ></v-switch>

      <v-text-field
        v-model="singerField"
        v-if="!isInstrumentalField"
        label="Singer"
        placeholder="example : Alberto Moran"
      ></v-text-field>

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="periodStartField"
            outlined
            label="Start period (year only, 4 digits)"
            placeholder="example : 1942"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="periodEndField"
            outlined
            label="End period (year only, 4 digits)"
            placeholder="example : 1946"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-select
        v-model="speedField"
        :items="speedList"
        :rules="[(v) => !!v || 'Music speed is required']"
        label="Speed"
        required
      ></v-select>

      <v-textarea
        v-model="descriptionField"
        label="description"
        rows="4"
        placeholder="Write a small description of your tanda"
      ></v-textarea>

      <v-card class="mx-auto" tile>
        <v-card-title>
          Tracks in my tanda
        </v-card-title>

        <v-card-text v-if="!tracks.length">
          Your tanda doesn't have any track to play. Click on the button below
          to add one!
        </v-card-text>
        <v-card-text>
          <draggable
            v-model="tracks"
            v-bind="dragOptions"
            @start="isDragging = true"
            @end="isDragging = false"
            class="list-group"
            tag="ul"
            handle=".handle"
          >
            <transition-group type="transition" name="flip-list">
              <div v-for="track in tracks" :key="track.id">
                <v-list-item draggable two-line>
                  <TrackItem :track="track" />

                  <v-list-item-action>
                    <v-btn class="handle" icon>
                      <v-icon color="primary">mdi-drag-variant</v-icon>
                    </v-btn>
                    <v-btn @click="deleteTrack(track.id)" icon>
                      <v-icon color="danger">mdi-delete</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
                <v-divider></v-divider>
              </div>
            </transition-group>
          </draggable>
        </v-card-text>

        <v-card-actions class="justify-center">
          <div class="text-xs-center">
            <v-btn @click="openSpotifyBrowser()" color="secondary"
              >+ Add a track</v-btn
            >
          </div>
        </v-card-actions>
      </v-card>

      <v-switch
        v-model="isPublicField"
        class="ma-2"
        label="My tanda is public (other users will be able to see your tanda)"
      ></v-switch>

      <v-dialog
        ref="dialog"
        v-model="dialogBrowserSpotify"
        @input="initSpotifyBrowser()"
        max-width="800px"
      >
        <SpotifyBrowser @clicked="addTrack" :searchDefault="searchDefault" />

        <v-btn ref="monBouton" @click="browserClose" color="primary"
          >Close</v-btn
        >
      </v-dialog>
      <v-spacer></v-spacer>
      <v-card-actions class="justify-center">
        <v-btn @click="saveAction()" :disabled="!valid" color="primary"
          >Save</v-btn
        >
        <v-btn to="/my-tandas">Back</v-btn>

        <v-btn
          v-if="tandaToModify && tandaToModify.author.id === currentUser.id"
          @click="deleteTanda(tandaToModify._id)"
          color="warning"
          ><v-icon>mdi-delete</v-icon> Delete
        </v-btn>
      </v-card-actions>
    </v-form>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

import { genres } from '@/data/genres'
import { speed } from '@/data/speed'
import { orchestras } from '@/data/orchestras'

import { tandaService } from '@/services/tandas.service.js'
import { playlistService } from '@/services/playlistService.js'
import { userService } from '@/services/users.service'

import SpotifyBrowser from '@/components/SpotifyBrowser'
import TrackItem from '~/components/TrackItem'

export default {
  components: {
    SpotifyBrowser,
    TrackItem,
    draggable
  },
  props: {
    tandaToModify: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      currentUser: this.$store.getters['authApp/getUser'],
      speedList: speed,
      orchestraList: orchestras,
      genreList: genres,
      description: '',
      dialogBrowserSpotify: false,
      dialog: false,
      tracks: [],
      valid: true,
      descriptionField: '',
      orchestraField: '',
      speedField: '',
      genreField: '',
      periodStartField: '',
      periodEndField: '',
      isInstrumentalField: false,
      singerField: '',
      searchDefault: '',
      dragOptions: '',
      playlistId: null,

      maxPeriod: new Date().getFullYear(),
      minPeriod: 1920,
      isPublicField: true,
      periodRules: [
        (v) => v.length === 4 || 'period must be 4 characters ex : 1946'
      ]
    }
  },
  mounted() {
    if (this.tandaToModify) {
      // fill the form with the tanda data to edit
      this.descriptionField = this.tandaToModify.description
      this.orchestraField = this.tandaToModify.orchestra
      this.speedField = this.tandaToModify.speed
      this.genreField = this.tandaToModify.genre
      this.periodStartField = this.tandaToModify.periodStart
      this.periodEndField = this.tandaToModify.periodEnd
      this.isPublicField = this.tandaToModify.isPublic
      this.isInstrumentalField = this.tandaToModify.isInstrumental
      this.singerField = this.tandaToModify.singer
      this.tracks = this.tandaToModify.tracks
    }
    this.changeDefaultSearchValue()

    if (this.$route.query.playlist) this.playlistId = this.$route.query.playlist
  },
  methods: {
    openSpotifyBrowser() {
      this.dialogBrowserSpotify = true
      this.initSpotifyBrowser()
    },
    browserClose() {
      this.dialogBrowserSpotify = false
    },
    addTrack(track) {
      this.tracks.push(track)
      this.browserClose()
    },
    initSpotifyBrowser() {
      const orchestra =
        this.orchestraField !== 'other' ? this.orchestraField : ''

      this.$bus.$emit('initBrowser', orchestra)
    },
    deleteTrack(trackId) {
      if (window.confirm('Do you really want to delete this track ?')) {
        const indexToDelete = this.tracks.findIndex(
          (track) => track.id === trackId
        )
        this.tracks.splice(indexToDelete, 1)
      }
    },
    changeDefaultSearchValue() {
      const orchestraSelected = this.orchestraList.filter(
        (e) => e.id === this.orchestraField
      )

      if (
        orchestraSelected &&
        orchestraSelected.length > 0 &&
        orchestraSelected[0].id !== 'mixed' &&
        orchestraSelected[0].id !== 'other'
      ) {
        this.searchDefault = orchestraSelected[0].title
      }
    },
    async saveAction() {
      let tanda = null
      if (!this.tandaToModify) {
        tanda = await this.saveNewTanda()
      } else {
        await this.updateTanda()
      }

      if (this.playlistId) {
        await playlistService.addTracks(
          this.playlistId,
          tanda.tracks,
          this.currentUser.token
        )

        this.$router.replace({
          path: `/playlists/${this.playlistId}#end`
        })
      } else {
        this.$router.replace({ path: '/my-tandas' })
      }
    },
    async saveNewTanda() {
      const tanda = this.buildTandaFromForm()
      const newTandaInDB = await tandaService.save(
        tanda,
        this.currentUser.token
      )

      tanda._id = newTandaInDB.data._id
      tanda.date = newTandaInDB.data.date
      tanda.author = newTandaInDB.data.author

      this.updateTandaCountForUser()

      this.$store.dispatch('tandas/addTanda', {
        target: 'myTandas',
        tanda,
        order: 'top'
      })
      if (tanda.isPublic)
        this.$store.dispatch('tandas/addTanda', {
          target: 'allTandas',
          tanda,
          order: 'top'
        })

      this.$bus.$emit('flashMessage', {
        message: 'Your tanda has been saved',
        status: 'success'
      })

      return tanda
    },
    async updateTandaCountForUser() {
      this.userInStore = this.$store.getters['authApp/getUser']
      const modifiedUser = { ...this.userInStore }

      const countTanda = await tandaService.getCountTandaUser(
        this.userInStore.id
      )

      if (modifiedUser.countTanda == null) modifiedUser.countTanda = 0

      modifiedUser.countTanda = countTanda + 1
      this.$store.dispatch('authApp/setUser', modifiedUser)

      userService.updateUser(modifiedUser, this.userInStore.token)

      //localStorage.setItem('user', JSON.stringify(modifiedUser))
      this.$cookies.set('user', JSON.stringify(modifiedUser))
    },
    updateTanda() {
      const tanda = this.buildTandaFromForm()

      tandaService.update(this.tandaToModify._id, tanda, this.currentUser.token)

      tanda._id = this.tandaToModify._id

      this.$store.dispatch('tandas/updateTanda', tanda)

      this.$bus.$emit('flashMessage', {
        message: 'Your tanda has been saved',
        status: 'success'
      })
    },
    buildTandaFromForm() {
      const user = this.$store.getters['authApp/getUser']

      return {
        author: { id: user.id, name: user.name },
        orchestra: this.orchestraField,
        speed: this.speedField,
        genre: this.genreField,
        description: this.descriptionField,
        tracks: this.tracks,
        isPublic: this.isPublicField,
        periodStart: this.periodStartField,
        periodEnd: this.periodEndField,
        isInstrumental: this.isInstrumentalField,
        singer: !this.isInstrumentalField ? this.singerField : ''
      }
    },
    deleteTanda(idTanda) {
      if (window.confirm('Do you really want to delete this tanda ? ')) {
        this.updateTandaCountForUser()

        tandaService.delete(idTanda, this.currentUser.token)
        this.$store.dispatch('tandas/deleteTanda', idTanda)
        this.$router.replace({ path: '../my-tandas' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
