<template>
  <v-layout>
    <v-flex class="text-center">
      <img width="155px" src="/spotify.png" alt="Vuetify.js" class="mb-5" />
      <h1>Connect your Spotify premium account</h1>
      <p>
        Connect your Spotify premium account to get access to full songs.
      </p>

      <p>
        <v-btn @click="askCode()" color="primary" dark
          ><v-icon>mdi-spotify</v-icon>Connect to spotify</v-btn
        ><br />
        (You will be redirected to the Spotify official website for
        authentication)
      </p>
      <p>
        <v-btn @click="leaveConnexion()" outlined small color="secondary" dark
          >I don't want to connect my account</v-btn
        >
      </p>
    </v-flex>
  </v-layout>
</template>

<script>
import { userService } from "@/services/users.service"

export default {
  data() {
    return {
      userInStore: {}
    }
  },
  mounted() {
    this.userInStore = this.$store.getters["authApp/getUser"]
  },
  methods: {
    askCode() {
      const serverUrl =
        process.env.NODE_ENV === "development"
          ? process.env.DEV_serverUrl
          : process.env.PROD_serverUrl
      window.location.href = `${serverUrl}/spotify/askcode`
    },
    async leaveConnexion() {
      const modifiedUser = { ...this.userInStore }
      modifiedUser.spotify = false

      this.$store.dispatch("authApp/setUser", modifiedUser)

      await userService.updateUser(modifiedUser, this.userInStore.token)

      // localStorage.setItem('user', JSON.stringify(modifiedUser))
      this.$cookies.set("user", JSON.stringify(modifiedUser))

      this.$router.replace({ path: "/" })
    }
  }
}
</script>

<style lang="scss" scoped></style>
