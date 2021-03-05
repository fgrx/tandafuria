<template>
  <v-card raised class="mx-auto mt-4 mb-4" max-width="850">
    <v-card-title><h1>Sign in</h1></v-card-title>
    <v-card-text class="body-1">
      <p>To access all functionnalities, please connect to your account</p>
      <p>
        You don't have an account yet ? please register by clicking
        <v-btn to="/create-account" small color="primary"
          >Create an account</v-btn
        >
      </p>

      <v-alert v-if="fail" type="warning">
        <h2>Connexion failed</h2>
        <p>Your login / password doesn't match</p>
      </v-alert>

      <form ref="form">
        <v-text-field
          v-model="username"
          label="Email address"
          placeholder="myemail@gmail.com"
        ></v-text-field>

        <v-text-field
          v-model="password"
          @keydown.enter="signin()"
          label="Password"
          type="password"
        ></v-text-field>
      </form>
      <p class="text-right">
        <v-btn to="/recover" text color="primary"
          >Did you lost your password ?</v-btn
        >
      </p>
    </v-card-text>

    <v-card-actions>
      <v-btn @click="signin()" color="primary">Sign in</v-btn>
      <v-btn to="/">Back</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import connectUserMixin from "@/mixins/connectUser"

export default {
  mixins: [connectUserMixin],
  data() {
    return {
      username: "",
      password: "",
      fail: false,
    }
  },
  methods: {
    parseJwt(token) {
      const base64Url = token.split(".")[1]
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
          })
          .join("")
      )

      return JSON.parse(jsonPayload)
    },
  },
}
</script>

<style lang="scss" scoped></style>
