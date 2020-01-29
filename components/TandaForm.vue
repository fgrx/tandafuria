<template>
  <v-form ref="form" class="tandaForm" v-model="valid">
    <v-select
      label="Orchestra"
      :items="orchestraList"
      item-text="title"
      item-value="id"
      :rules="[(v) => !!v || 'Orchestra is required']"
      required
      v-model="orchestraField"
    ></v-select>

    <v-select
      label="musical genre"
      class="inputGenre"
      :items="genreList"
      item-text="name"
      item-value="id"
      :rules="[(v) => !!v || 'Musical genre is required']"
      required
      v-model="genreField"
    ></v-select>

    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          outlined
          label="Start period (year only, 4 digits)"
          v-model="periodStartField"
          placeholder="example : 1942"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          outlined
          label="End period (year only, 4 digits)"
          v-model="periodEndField"
          placeholder="example : 1946"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-select
      label="Speed"
      :items="speedList"
      v-model="speedField"
      :rules="[(v) => !!v || 'Music speed is required']"
      required
    ></v-select>

    <v-textarea
      label="description"
      rows="4"
      v-model="descriptionField"
      placeholder="Write a small description of your tanda"
    ></v-textarea>

    <v-card class="mx-auto" tile>
      <v-card-title>
        Tracks in my tanda
      </v-card-title>

      <v-card-text>
        <draggable v-model="tracks">
          <transition-group>
            <div v-for="track in tracks" :key="track.id">
              <v-list-item draggable two-line>
                <v-list-item-icon>
                  <TrackPlayer
                    :refComponent="'player' + track.id"
                    :track="track"
                    :ref="'player' + track.id"
                  />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="track.name"></v-list-item-title>
                  <v-list-item-subtitle>
                    <span v-for="artist in track.artists" :key="artist.id"
                      >{{ artist.name }}
                    </span>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon color="grey lighten-1">mdi-drag-variant</v-icon>
                  <v-btn icon @click="deleteTrack(track.id)">
                    <v-icon color="danger">mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
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
      label="Is my tanda public (other users will see your tanda)"
    ></v-switch>

    <v-dialog v-model="dialogBrowserSpotify" max-width="800px">
      <SpotifyBrowser @clicked="addTrack" />

      <v-btn color="success" @click="browserClose">Close</v-btn>
    </v-dialog>
    <v-spacer></v-spacer>
    <v-card-actions>
      <v-btn :disabled="!valid" color="primary" @click="save()">Save</v-btn>
      <v-btn to="/">Back</v-btn>
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
import TrackPlayer from '~/components/TrackPlayer'
import SpotifyPlayer from '~/components/SpotifyPlayer'

export default {
  components: {
    SpotifyBrowser,
    TrackPlayer,
    SpotifyPlayer,
    draggable
  },
  data() {
    return {
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

      maxPeriod: new Date().getFullYear(),
      minPeriod: 1920,
      isPublicField: true,
      periodRules: [
        (v) => v.length === 4 || 'period must be 4 characters ex : 1946'
      ]
    }
  },
  methods: {
    openSpotifyBrowser() {
      this.dialogBrowserSpotify = true
    },
    browserClose() {
      this.dialogBrowserSpotify = false
    },
    addTrack(track) {
      this.tracks.push(track)
      this.browserClose()
    },
    deleteTrack(trackId) {
      if (window.confirm('Do you really want to delete this track ?')) {
        const indexToDelete = this.tracks.findIndex(
          (track) => track.id === trackId
        )
        this.tracks.splice(indexToDelete, 1)
      }
    },
    save() {
      const tanda = {
        orchestra: this.orchestraField,
        speed: this.speedField,
        genre: this.genreField,
        description: this.descriptionField,
        tracks: this.tracks,
        isPublic: this.isPublicField,
        periodStart: this.periodStartField,
        periodEnd: this.periodEndField
      }
      this.$store.dispatch('myTandas/addTanda', tanda)
      if (tanda.isPublic) this.$store.dispatch('allTandas/addTanda', tanda)

      console.log(tanda)
      this.$router.replace({ path: '/' })
    }
  }
}
</script>

<style lang="scss" scoped></style>
