<template>
  <v-app light>
    <v-app-bar
      :clipped-left="clipped"
      color="transparent"
      flat
      absolute
      fixed
      class
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" class="d-lg-none" />

      <v-toolbar-title centered>
        <v-spacer></v-spacer>
        <a @click="toHomeAction" href="#">
          <img
            src="~/static/logo.png"
            alt="Tanda fury"
            class="mt-8 mx-auto"
            height="40em"
            centered
          />
        </a>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <div class="d-none d-lg-flex">
        <v-menu v-if="user.id" transition="slide-y-transition" bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" text color="primary" dark>
              <v-icon>mdi-account</v-icon>
              {{ user.nickname }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-btn outlined block color="primary" to="/manage-account">
                <v-icon>mdi-account</v-icon>Manage your account
              </v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn @click="logout()" outlined block color="primary">
                <v-icon>mdi-logout</v-icon>Logout
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn
          v-if="!user.id"
          to="create-account"
          outlined
          large
          color="primary"
        >
          <v-icon>mdi-account-plus</v-icon>Create your account
        </v-btn>
        &nbsp;
        <v-btn v-if="!user.id" to="/signin" color="primary" outlined large>
          <v-icon>mdi-account-arrow-right</v-icon>Sign In
        </v-btn>
      </div>
    </v-app-bar>
    <v-content class="base">
      <v-navigation-drawer
        v-model="drawer"
        dark
        fixed
        app
        class="navigationDrawer"
      >
        <v-list>
          <v-list-item to="/">
            <v-list-item-action>
              <v-icon>mdi-home</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-if="user.id" to="/my-tandas">
            <v-list-item-action>
              <v-icon>mdi-music</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>My Tandas</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item v-if="user.id" to="/playlists/my-playlists">
            <v-list-item-action>
              <v-icon>mdi-playlist-music</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>My Playlists</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <PlayerSwitcher v-if="user.spotify" />

          <v-list-item v-if="user.id">
            <v-divider></v-divider>
          </v-list-item>

          <v-list-item to="/all-tandas">
            <v-list-item-action>
              <v-icon>mdi-music</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>All Tandas</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/playlists/all-playlists">
            <v-list-item-action>
              <v-icon>mdi-playlist-music</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>All Playlists</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item to="/about">
            <v-list-item-action>
              <v-icon>mdi-information-outline</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>About</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-btn :to="{ name: 'tanda-editor' }" block color="primary"
              >+ Create a tanda</v-btn
            >
          </v-list-item>

          <v-list-item v-if="!user.id" class="d-flex d-lg-none">
            <v-btn
              block
              to="signin"
              color="light-blue lighten-5"
              small
              outlined
            >
              <v-icon>mdi-account-arrow-right</v-icon>Sign In
            </v-btn>
          </v-list-item>

          <v-list-item v-if="!user.id" class="d-flex d-lg-none">
            <v-btn
              block
              to="create-account"
              outlined
              small
              color="light-blue lighten-5"
            >
              <v-icon>mdi-account-plus</v-icon>Create your account
            </v-btn>
          </v-list-item>

          <div class="d-flex d-lg-none">
            <v-menu v-if="user.id" transition="slide-y-transition" bottom>
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" text color="primary" block dark>
                  <v-icon>mdi-account</v-icon>
                  {{ user.nickname }}
                </v-btn>
              </template>
              <v-list>
                <v-list-item class="d-flex d-lg-none">
                  <v-btn text block color="primary" to="/manage-account">
                    <v-icon>mdi-account</v-icon>Manage your account
                  </v-btn>
                </v-list-item>
                <v-list-item class="d-flex d-lg-none">
                  <v-btn @click="logout()" text block color="primary">
                    <v-icon>mdi-logout</v-icon>
                    Logout
                    {{ user.nickname }}
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </v-list>

        <div class="to-bottom">
          <p>
            Follow us on
            <v-btn
              href="https://www.facebook.com/TandaFury-106496657656216"
              target="_blank"
              text
              x-large
              block
              color="white"
            >
              <v-icon>mdi-facebook</v-icon>Facebook
            </v-btn>
          </p>
        </div>
      </v-navigation-drawer>

      <v-snackbar v-model="flash.display" :color="flash.color">
        <v-icon>{{ flash.icon }}</v-icon>
        {{ flash.message }}
        <v-btn @click="snackbar = false" text>Close</v-btn>
      </v-snackbar>

      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <PlaylistPlayer />
    <BarBottom :user="user" />
  </v-app>
</template>

<script>
import { userService } from "@/services/users.service"
import PlayerSwitcher from "@/components/PlayerSwitcher"
import PlaylistPlayer from "@/components/PlaylistPlayer"
import BarBottom from "@/components/BarBottom"
import PlayerMixin from "@/mixins/player"
import DeviceMixin from "@/mixins/device"

export default {
  mixins: [PlayerMixin, DeviceMixin],
  components: {
    PlaylistPlayer,
    PlayerSwitcher,
    BarBottom
  },
  middleware: ["initializeAppData"],
  data() {
    return {
      clipped: false,
      drawer: !this.$vuetify.breakpoint.mdAndDown,
      fixed: false,
      user: this.$store.getters["authApp/getUser"],
      device: null,
      accessToken: this.$store.getters["authSpotify/getToken"],
      flash: { message: "", display: false, icon: "mdi-check-circle-outline" },
      flashMessage: false,
      textFlashMessage: "",
      miniVariant: false,
      title: "Tandafury",
      subtitle: "The tanda creation tool"
    }
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === "authSpotify/SET_TOKEN") {
        this.accessToken = state.authSpotify.token
      }
    })
  },
  async mounted() {
    const code = this.$route.query.code
    const state = this.$route.query.state
    if (code) {
      await this.initializeSpotifyTokens(code, state)
    }

    this.$bus.$on("flashMessage", (params) => {
      this.displayFlashMessage(params.message, params.status)
    })

    // refresh user infos if credentials are too old
    try {
      if (this.user.token) await userService.getUser(this.user)
    } catch (e) {
      this.$router.replace({ path: "/signin" })
    }

    if (this.user.spotify && !this.tandaFuryPlayer) {
      this.spotifyPlayer = await this.initiatePlayerSpotifyPlayer()
    }

    await this.waitForSpotifyWebPlaybackSDKToLoad()

    const sleep = (milliseconds) => {
      const date = Date.now()
      let currentDate = null
      do {
        currentDate = Date.now()
      } while (currentDate - date < milliseconds)
    }

    sleep(500)

    const spotifyPlayersLoaded = await this.detectActualPlayers(
      this.user.refreshToken
    )

    if (this.user.refreshToken) {
      this.tandaFuryPlayer = this.findSpotifyPlayerInPlayersList(
        spotifyPlayersLoaded
      )
    }
  },
  methods: {
    logout() {
      this.$cookies.removeAll()
      this.$store.dispatch("authApp/clearUser")
      document.location.href = "/"
    },
    async initializeSpotifyTokens(code, state) {
      const resultTokensFromSpotify = await this.getTokenFromSpotify(
        code,
        state
      )
      console.log("token ? ", resultTokensFromSpotify)
      if (resultTokensFromSpotify.accessToken)
        this.memorizeTokenFromSpotify(resultTokensFromSpotify)
    },
    async getTokenFromSpotify(code, state) {
      const serverUrl =
        process.env.NODE_ENV === "development"
          ? process.env.DEV_serverUrl
          : process.env.PROD_serverUrl
      const resultSpotify = await this.$axios.get(
        `${serverUrl}/spotify/callback/${code}?state=${state}`
      )

      const tokens = {
        accessToken: resultSpotify.data.access_token,
        refreshToken: resultSpotify.data.refresh_token
      }

      return tokens
    },
    async memorizeTokenFromSpotify(resultTokensFromSpotify) {
      await this.$store.dispatch(
        "authSpotify/setToken",
        resultTokensFromSpotify.accessToken
      )

      // localStorage.setItem(
      //   'access_token',
      //   resultTokensFromSpotify.accessToken
      // )

      this.$cookies.set("access_token", resultTokensFromSpotify.accessToken)

      await this.$store.dispatch(
        "authSpotify/setRefreshToken",
        resultTokensFromSpotify.refreshToken
      )

      // localStorage.setItem(
      //   'refresh_token',
      //   resultTokensFromSpotify.refreshToken
      // )

      this.$cookies.set("refresh_token", resultTokensFromSpotify.refreshToken)

      const userUpdated = JSON.parse(JSON.stringify(this.user))
      userUpdated.refreshToken = resultTokensFromSpotify.refreshToken

      await userService.updateUser(userUpdated, this.user.token)
    },
    displayFlashMessage(message, status) {
      const color = status === "success" ? "primary" : "info"
      this.flash = {
        color,
        message,
        display: true,
        icon: "mdi-check-circle-outline"
      }
    },
    toHomeAction() {
      this.$router.replace({ path: "/" })
    }
  }
}
</script>

<style lang="scss">
h1,
h2,
h3 {
  color: #4527a0;
  font-family: "Overpass", Arial, sans-serif !important;
}
a {
  color: rgb(115, 40, 158);
}

.spaceBottom {
  height: 8em;
}

.to-bottom {
  bottom: 0%;
  position: fixed;
  text-align: center;
  color: white;
  font-size: 1.2em;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s, transform 0.3s ease-in-out;
}

.page-enter {
  opacity: 0;
  transform: translateY(-100px);
}

.page-enter-to {
  opacity: 1;
  transform: translateY(0px);
}

.page-leave {
  opacity: 1;
  transform: translateY(0px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(100px);
}
</style>
