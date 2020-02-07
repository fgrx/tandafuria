<template>
  <div>
    <v-card>
      <v-card-title>
        <h1>Create your account</h1>
      </v-card-title>
      <v-card-text>
        <v-card-content>
          <v-alert type="info" v-if="success">
            <h2>Congratulation, your account has be succesfully created</h2>
            <p>
              Please connect to your account by clicking
              <v-btn to="/signin">signin</v-btn>
            </p>
          </v-alert>

          <v-form ref="form" class="" v-model="valid" v-if="!success">
            <v-text-field
              label="Email address"
              :rules="emailRules"
              v-model="username"
              placeholder="myemail@gmail.com"
            ></v-text-field>

            <v-text-field
              label="Password"
              v-model="password"
              :rules="passwordRules"
              type="password"
            ></v-text-field>

            <v-text-field
              label="Nickname (will credit your public tanda)"
              v-model="nickname"
              :rules="[(v) => !!v || 'Choose a Nickname']"
              placeholder='example : John "El Mano"'
            ></v-text-field>
          </v-form>
        </v-card-content>
        <v-card-actions v-if="!success">
          <v-btn :disabled="!valid" color="primary" @click="createAction()"
            >Create</v-btn
          >
          <v-btn to="/">Back</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { userService } from '@/services/users.service'

export default {
  data() {
    return {
      username: '',
      password: '',
      nickname: '',
      success: false,
      valid: false,
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [
        (value) =>
          value.length >= 6 || 'Password must contain more than 6 characters'
      ]
    }
  },
  mounted() {
    console.log('valid', this.valid)
  },
  methods: {
    async createAction() {
      const user = this.userBuilder()
      const result = await userService.addUser(user)
      console.log('result add user', result)
      if (result.status === 201) {
        this.success = true
      } else {
        alert(
          'An error has happened. Please send me an email at fab.grignoux@gmail to help me resolve this problem. Thank you !'
        )
      }
    },
    userBuilder() {
      return {
        username: this.username,
        nickname: this.nickname,
        password: this.password,
        role: 'user'
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
