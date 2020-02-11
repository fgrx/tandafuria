<template>
  <div>
    <v-card>
      <v-card-title>
        <h1>Create your account</h1>
      </v-card-title>
      <v-card-text>
        <v-alert type="info">
          <p>Creating an account is free and allow you to :</p>
          <ul>
            <li>Create and publish a tanda for the community</li>
            <li>Create your own tandas database</li>
            <li>Comments others tanda and help others to improve their work</li>
            <li>
              Access to full length track if you have a spotify's user premium
              account
            </li>
            <li>Manage your own playlists</li>
          </ul>
        </v-alert>
      </v-card-text>
      <UserForm mode="create" />
    </v-card>
  </div>
</template>

<script>
import UserForm from '~/components/UserForm'
export default {
  components: {
    UserForm
  }
}
</script>

<style lang="scss" scoped></style>
