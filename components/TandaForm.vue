<template>
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
        Your tanda doesn't have any track to play. Click on the button bellow to
        add your first one !
      </v-card-text>
      <v-card-text>
        <draggable v-model="tracks">
          <transition-group>
            <div v-for="track in tracks" :key="track.id">
              <v-list-item draggable two-line>
                <TrackItem :track="track" />

                <v-list-item-action>
                  <v-btn icon>
                    <v-icon color="grey lighten-1">mdi-drag-variant</v-icon>
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
      v-model="dialogBrowserSpotify"
      @input="initSpotifyBrowser()"
      max-width="800px"
      ref="dialogi"
    >
      <SpotifyBrowser @clicked="addTrack" />

      <v-btn ref="monBouton" @click="browserClose" color="success">Close</v-btn>
    </v-dialog>
    <v-spacer></v-spacer>
    <v-card-actions>
      <v-btn @click="saveAction()" :disabled="!valid" color="primary"
        >Save</v-btn
      >
      <v-btn to="/">Back</v-btn>

      <v-btn
        v-if="tandaToModify && tandaToModify.author.id === currentUser.id"
        @click="deleteTanda(tandaToModify._id)"
        color="warning"
        ><v-icon>mdi-delete</v-icon> Delete
      </v-btn>
    </v-card-actions>

    <SpotifyPlayer />
  </v-form>
</template>

<script>
import draggable from 'vuedraggable'

import { genres } from '@/data/genres'
import { speed } from '@/data/speed'
import { orchestras } from '@/data/orchestras'

import SpotifyBrowser from '@/components/SpotifyBrowser'
import TrackItem from '~/components/TrackItem'
import SpotifyPlayer from '~/components/SpotifyPlayer'

import { tandaService } from '@/services/tandas.service.js'

export default {
  components: {
    SpotifyBrowser,
    TrackItem,
    SpotifyPlayer,
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
      console.log('etape 1')
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
    saveAction() {
      if (!this.tandaToModify) {
        this.saveNewTanda()
      } else {
        this.updateTanda()
      }

      this.$router.replace({ path: '/my-tandas' })
      // this.$router.back()
    },
    async saveNewTanda() {
      const tanda = this.buildTandaFromForm()
      const newTandaInDB = await tandaService.save(
        tanda,
        this.currentUser.token
      )

      tanda._id = newTandaInDB.data._id
      this.$store.dispatch('tandas/addTanda', { target: 'myTandas', tanda })
      if (tanda.isPublic)
        this.$store.dispatch('tandas/addTanda', { target: 'allTandas', tanda })
    },
    updateTanda() {
      const tanda = this.buildTandaFromForm()

      tandaService.update(this.tandaToModify._id, tanda, this.currentUser.token)

      tanda._id = this.tandaToModify._id

      this.$store.dispatch('tandas/updateTanda', tanda)
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
        tandaService.delete(idTanda, this.currentUser.token)
        this.$store.dispatch('tandas/deleteTanda', idTanda)
        this.$router.replace({ path: '/' })
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
