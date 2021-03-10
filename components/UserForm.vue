<template>
  <v-card-text>
    <v-alert
      v-if="successCreation"
      border="left"
      colored-border
      color="deep-purple accent-4"
      elevation="2"
    >
      <h2>Congratulation !</h2>
      <h3>your account has be succesfully created</h3>
      <p>Please connect to your account by clicking the sign in button</p>
      <p><v-btn to="/signin">signin</v-btn></p>
    </v-alert>

    <v-alert
      v-if="errorCreation"
      border="left"
      colored-border
      color="red accent-4"
      elevation="2"
    >
      <h2>Error</h2>
      <h3>Your account already exist</h3>
      <p>Please connect to your account by clicking the sign in button</p>
      <p><v-btn to="/signin">signin</v-btn></p>
    </v-alert>

    <v-form ref="form" v-model="valid" v-if="!successCreation" class="">
      <v-text-field
        v-model="username"
        :disabled="disableUsername"
        :rules="emailRules"
        label="Email address"
        placeholder="myemail@gmail.com"
      ></v-text-field>

      <v-text-field
        v-model="password"
        :rules="passwordRules"
        label="Password"
        type="password"
        autocomplete="new-password"
      ></v-text-field>

      <v-text-field
        v-model="nickname"
        :rules="[(v) => !!v || 'Choose a Nickname']"
        label="Nickname (will credit your public tanda)"
        placeholder='example : John "El Mano"'
      ></v-text-field>

      <v-text-field
        v-model="link"
        label="Facebook or website link"
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
        @click="createAction()"
        v-if="mode === 'create'"
        :disabled="!valid"
        color="primary"
        >Create</v-btn
      >
      <v-btn
        @click="updateAction()"
        v-if="mode === 'update'"
        :disabled="!valid"
        color="primary"
        >Update</v-btn
      >
      <v-btn to="/">Back</v-btn>
    </v-card-actions>
    <v-snackbar v-model="snackbar">
      {{ scnackMessage }}
      <v-btn @click="snackbar = false" color="pink" text> Close </v-btn>
    </v-snackbar>
  </v-card-text>
</template>

<script>
import { userService } from "@/services/users.service"
import connectUserMixin from "@/mixins/connectUser"

export default {
  mixins: [connectUserMixin],
  props: {
    mode: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      username: "",
      password: "",
      nickname: "",
      disableUsername: false,
      successCreation: false,
      errorCreation: false,
      valid: false,
      spotify: false,
      link: "",
      contactByMail: false,
      userInStore: {},
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+/.test(v) || "E-mail must be valid",
      ],
      passwordRules: [
        (value) =>
          value.length >= 6 || "Password must contain more than 6 characters",
      ],
      snackbar: false,
      scnackMessage: "",
    }
  },
  mounted() {
    this.userInStore = this.$store.getters["authApp/getUser"]

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
      user.role = "user"
      const result = await userService.addUser(user)
      if (result) {
        await this.signin()
      } else {
        this.errorCreation = true
      }
    },
    async updateAction() {
      const user = this.userBuilder()
      user.username = this.userInStore.username
      user.id = this.userInStore.id
      user.token = this.userInStore.token

      const result = await userService.updateUser(user, this.userInStore.token)

      if (result) {
        this.scnackMessage = "Your account has been succesfully updated"
        this.snackbar = true

        this.$store.dispatch("authApp/setUser", user)

        // localStorage.setItem('user', JSON.stringify(user))
        this.$cookies.set("user", JSON.stringify(user))

        //  need to signin again if password has changed
        if (this.password) {
          alert(
            "Your modifications have been saved. You will have to sign in again, thank you !"
          )
          this.$cookies.removeAll()
          document.location.href = "/signin"
        }
      } else {
        alert(
          "An error has happened. Please send me an email at fab.grignoux@gmail to help me resolve this problem. Thank you !"
        )
      }
    },
    userBuilder() {
      const usernameClean = this.username.replace(/\s/g, "").toLowerCase()
      const user = {
        username: usernameClean,
        nickname: this.nickname,
        spotify: this.spotify,
        contactByMail: this.contactByMail,
        link: this.link,
      }

      if (this.password != null && this.password !== "") {
        user.password = this.password
      }

      return user
    },
  },
}
</script>

<style lang="scss" scoped></style>
