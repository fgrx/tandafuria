<template>
  <v-card-text>
    <v-alert type="info" v-if="successCreation">
      <h2>Congratulation !</h2>
      <h3>your account has be succesfully created</h3>
      <p>
        Please connect to your account by clicking the sign in button
      </p>
      <p><v-btn to="/signin">signin</v-btn></p>
    </v-alert>

    <v-form ref="form" class="" v-model="valid" v-if="!successCreation">
      <v-text-field
        :disabled="disableUsername"
        label="Email address"
        :rules="emailRules"
        v-model="username"
        placeholder="myemail@gmail.com"
      ></v-text-field>

      {{ this.mode }}

      <v-text-field
        label="Password"
        v-model="password"
        :rules="passwordRules"
        type="password"
        autocomplete="new-password"
      ></v-text-field>

      <v-text-field
        label="Nickname (will credit your public tanda)"
        v-model="nickname"
        :rules="[(v) => !!v || 'Choose a Nickname']"
        placeholder='example : John "El Mano"'
      ></v-text-field>

      <v-text-field
        label="Facebook or website link"
        v-model="link"
        placeholder='example : https://www.facebook.com/fabien.grignoux"'
      ></v-text-field>

      <v-switch
        v-model="contactByMail"
        prepend-icon="mdi-at"
        class="ma-4"
        label="Do you want to be conctacted by email by other users ?"
      ></v-switch>

      <v-switch
        v-model="spotify"
        prepend-icon="mdi-spotify"
        class="ma-4"
        label="Do you have a Spotify premium account and do you want to use it ? "
        messages="You will gain access to full length track (otherwise you only get 30s of music per track)"
      ></v-switch>
    </v-form>
    <v-card-actions v-if="!successCreation">
      <v-btn
        :disabled="!valid"
        v-if="mode === 'create'"
        color="primary"
        @click="createAction()"
        >Create</v-btn
      >
      <v-btn
        :disabled="!valid"
        v-if="mode === 'update'"
        color="primary"
        @click="updateAction()"
        >Update</v-btn
      >
      <v-btn to="/">Back</v-btn>
    </v-card-actions>
    <v-snackbar v-model="snackbar">
      {{ scnackMessage }}
      <v-btn color="pink" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </v-card-text>
</template>

<script>
import { userService } from '@/services/users.service'
export default {
  props: {
    mode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      username: '',
      password: '',
      nickname: '',
      disableUsername: false,
      successCreation: false,
      valid: false,
      spotify: false,
      link: '',
      contactByMail: false,
      userInStore: {},
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [
        (value) =>
          value.length >= 6 || 'Password must contain more than 6 characters'
      ],
      snackbar: false,
      scnackMessage: ''
    }
  },
  mounted() {
    this.userInStore = this.$store.getters['authApp/getUser']

    if (this.userInStore.username) {
      this.disableUsername = true
      this.username = this.userInStore.username
      this.nickname = this.userInStore.nickname
      this.spotify = this.userInStore.spotify
      this.contactByMail = this.userInStore.contactByMail
      this.link = this.userInStore.link
      this.passwordRules = []
    }
  },
  methods: {
    async createAction() {
      const user = this.userBuilder()
      const result = await userService.addUser(user)
      if (result.status === 201 || result.status === 200) {
        this.successCreation = true
      } else {
        alert(
          'An error has happened. Please send me an email at fab.grignoux@gmail to help me resolve this problem. Thank you !'
        )
      }
    },
    async updateAction() {
      const user = this.userBuilder()
      user.username = this.userInStore.username
      const result = await userService.updateUser(user, this.userInStore.token)

      if (result.status === 201 || result.status === 200) {
        this.scnackMessage = 'Your account has been succesfully updated'
        this.snackbar = true
        // this.$store.dispatch('authApp/setUser', user)
        //  need to signin again
        alert(
          'Your modifications have been saved. You will have to sign in again, thank you !'
        )
        userService.logout()
        this.$store.dispatch('authApp/clearUser')
        document.location.href = '/signin'
      } else {
        alert(
          'An error has happened. Please send me an email at fab.grignoux@gmail to help me resolve this problem. Thank you !'
        )
      }
    },
    userBuilder() {
      const user = {
        username: this.username,
        nickname: this.nickname,
        spotify: this.spotify,
        contactByMail: this.contactByMail,
        link: this.link,
        role: 'user'
      }

      if (this.password != null && this.password !== '') {
        user.password = this.password
      }

      return user
    }
  }
}
</script>

<style lang="scss" scoped></style>
