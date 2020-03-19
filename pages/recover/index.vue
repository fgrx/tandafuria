<template>
  <v-card raised class="mx-auto mt-4 mb-4" max-width="850">
    <v-card-title><h1>Recover your password</h1></v-card-title>
    <v-card-text class="body-1">
      <div v-if="!emailSent">
        <p>
          Did you lost your password ? no problem, we will send you an email to
          reset it.
        </p>
        <p>
          If you don't receive an email in few seconds, please check spams in
          you mailbox.
        </p>

        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="username"
            @keydown.enter="sendMail()"
            :rules="emailRules"
            label="Email address"
            placeholder="myemail@gmail.com"
          ></v-text-field>
        </v-form>
      </div>

      <div v-if="emailSent">
        <v-alert
          border="left"
          colored-border
          color="deep-purple accent-4"
          elevation="2"
        >
          <h2>An email has been sent to {{ username }}</h2>
          <p>
            Please check your spams if you don't receive anything in a few
            seconds
          </p>
        </v-alert>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn
        v-if="!emailSent"
        :disabled="!valid"
        @click="sendMail()"
        color="primary"
        >Recover password</v-btn
      >
      <v-btn to="../signin">Back</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { userService } from '@/services/users.service'
export default {
  data() {
    return {
      username: '',
      emailSent: false,
      valid: false,
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+/.test(v) || 'E-mail must be valid'
      ]
    }
  },
  methods: {
    sendMail() {
      userService.sendRecoveryMail(this.username)
      this.emailSent = true
    }
  }
}
</script>

<style lang="scss" scoped></style>
