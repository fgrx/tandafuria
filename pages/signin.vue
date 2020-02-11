<template>
  <v-card>
    <v-card-title><h1>Sign in</h1></v-card-title>
    <v-card-text>
      <p>To access all functionnalities, please connect to your account</p>
      <p>
        You don't have an account yet ? please register by clicking
        <v-btn to="/create-account" small color="primary"
          >Create an account</v-btn
        >
      </p>

      <v-alert type="warning" v-if="fail">
        <h2>Connexion failed</h2>
        <p>Your login / password doesn't match</p>
      </v-alert>

      <form ref="form">
        <v-text-field
          label="Email address"
          v-model="username"
          placeholder="myemail@gmail.com"
        ></v-text-field>

        <v-text-field
          label="Password"
          v-model="password"
          type="password"
        ></v-text-field>
      </form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="signin()">Sign in</v-btn>
      <v-btn to="/">Back</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { userService } from '@/services/users.service'
export default {
  data() {
    return {
      username: '',
      password: '',
      fail: false
    }
  },
  methods: {
    async signin() {
      try {
        const result = await userService.signin(this.username, this.password)
        const token = result.data.accessToken
        const infos = this.parseJwt(token)

        const user = {
          id: infos.id,
          username: infos.username,
          role: infos.role,
          nickname: infos.nickname,
          spotify: infos.spotify,
          link: infos.link,
          contactByMail: infos.contactByMail,
          token
        }

        this.$store.dispatch('authApp/setUser', user)
        localStorage.setItem('user', JSON.stringify(user))

        // this.$router.replace({ path: '/my-tandas' })
        document.location.href = '/my-tandas'
      } catch (e) {
        this.fail = true
      }
    },
    parseJwt(token) {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
          })
          .join('')
      )

      return JSON.parse(jsonPayload)
    }
  }
}
</script>

<style lang="scss" scoped></style>
