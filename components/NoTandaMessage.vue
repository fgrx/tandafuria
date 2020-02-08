<template>
  <v-card>
    <v-card-text
      ><h2>{{ title }}</h2>
      <p>
        Maybe you should consider creating a new one by clicking the create
        button :
      </p>
      <p>
        <v-btn :to="{ name: 'tandaEditor' }" color="primary"
          >+ Create a tanda</v-btn
        >
      </p>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'No tanda found'
    }
  }
}
</script>

<style lang="scss" scoped></style>
