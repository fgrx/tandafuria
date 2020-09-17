<template>
  <div class="text-center">
    <v-progress-circular
      size="70"
      width="7"
      indeterminate
      color="primary"
    ></v-progress-circular>
    <p class="display-1">Loading... Please wait.</p>
  </div>
</template>

<script>
export default {
  inject: ["theme"]
}
</script>

<style lang="scss" scoped></style>
