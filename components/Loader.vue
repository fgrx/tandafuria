<template>
  <div class="text-center">
    <!-- <v-progress-circular
      size="70"
      width="7"
      indeterminate
      color="primary"
    ></v-progress-circular>
    <p class="display-1">Loading...</p> -->

    <v-layout row wrap>
      <v-flex v-for="(n, index) in 12" :key="index" xl3 lg4 md6 xs12>
        <v-sheet :key="n" color="`grey  darken-2`" class="px-3 pt-3 pb-3">
          <v-skeleton-loader
            class="mx-auto"
            max-width="300"
            type="card"
          ></v-skeleton-loader>
        </v-sheet>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  inject: ["theme"]
}
</script>

<style lang="scss" scoped></style>
