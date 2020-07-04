<template>
  <v-card raised class="mx-auto mt-4 mb-4" max-width="850">
    <v-card-title><h1>Set a new password</h1></v-card-title>
    <v-card-text class="body-1">
      <div v-if="resetDone">
        <v-alert
          border="left"
          colored-border
          color="deep-purple accent-4"
          elevation="2"
        >
          <h2>Your password has been updated</h2>
          <h3>You can now signin using your new password.</h3>

          <p><v-btn to="../signin">signin</v-btn></p>
        </v-alert>
      </div>

      <div v-if="!resetDone">
        <p>
          Please type a new password for {{ email }} below to finish reseting
          your password
        </p>

        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="password"
            @keydown.enter="resetPassword()"
            :rules="passwordRules"
            label="Password"
            type="password"
          ></v-text-field>
        </v-form>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn
        v-if="!resetDone"
        :disabled="!valid"
        @click="resetPassword()"
        color="primary"
        >Reset password</v-btn
      >
      <v-btn to="../signin">Back</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { userService } from "@/services/users.service"
export default {
  data() {
    return {
      email: "",
      password: "",
      fail: false,
      resetDone: false,
      valid: false,
      passwordRules: [
        (value) =>
          value.length >= 6 || "Password must contain more than 6 characters"
      ]
    }
  },
  mounted() {
    this.email = this.$route.query.email
    this.code = this.$route.query.code
  },
  methods: {
    async resetPassword() {
      try {
        await userService.resetPassword(this.email, this.code, this.password)
        this.resetDone = true
      } catch (e) {
        alert("Something went wrong. Your password has not been updated.")
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
