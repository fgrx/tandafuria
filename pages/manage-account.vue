<template>
  <div>
    <v-card>
      <v-card-title>
        <h1>Manage your account</h1>
      </v-card-title>
      <UserForm mode="update" />
    </v-card>
  </div>
</template>

<script>
import UserForm from '~/components/UserForm'
export default {
  middleware: ['appAuthorization'],
  components: {
    UserForm
  }
}
</script>

<style lang="scss" scoped></style>
