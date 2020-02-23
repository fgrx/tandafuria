<template>
  <div>
    <v-card>
      <v-card-title>
        <h1>Create your account</h1>
      </v-card-title>

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
